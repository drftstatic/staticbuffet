// The Static Buffet compositor: two video decks in, shader pipeline out.
//
// Pass 1 (MIX): deck textures sampled with contain-fit + geometry transform,
//               A/B crossfade.
// Pass 2 (FX):  single über-shader — pixelate, glitch, chromatic aberration,
//               blur/sharpen, full color grade, noise, vignette, scanlines.
//               Every stage is identity at its default parameter value.
// Pass 3 (FEEDBACK): ping-pong trails/warp — the temporal pass CSS could
//               never do — then blit to screen.
//
// Portable core: no React, no store, no DOM beyond the canvas (and the
// HTMLVideoElements handed in as sources).

import { createProgram, createQuad, createTarget, createVideoTexture, destroyTarget, QUAD_VS, type Target } from './gl';
import { IDENTITY_PARAMS, type AudioLevels, type EngineParams } from './params';
import { RACK_EFFECTS } from './effects';

const MIX_FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uCrossfade;      // 0 = A, 1 = B
uniform vec2 uVideoSizeA;
uniform vec2 uVideoSizeB;
uniform vec2 uCanvasSize;
uniform float uHasB;
// geometry
uniform float uRotate;         // radians
uniform vec2 uScale;           // 1 = identity
uniform vec2 uSkew;            // tan(radians)
uniform vec2 uTranslate;       // fraction of frame

vec2 containUv(vec2 uv, vec2 videoSize, vec2 canvasSize) {
  float va = videoSize.x / max(videoSize.y, 1.0);
  float ca = canvasSize.x / max(canvasSize.y, 1.0);
  vec2 scale = va > ca ? vec2(1.0, ca / va) : vec2(va / ca, 1.0);
  return (uv - 0.5) / scale + 0.5;
}

vec4 sampleDeck(sampler2D tex, vec2 videoSize, vec2 uv) {
  // geometry: translate, then rotate/skew/scale around center
  vec2 p = uv - 0.5 - uTranslate;
  float c = cos(-uRotate), s = sin(-uRotate);
  p = mat2(c, -s, s, c) * p;
  p = vec2(p.x - uSkew.x * p.y, p.y - uSkew.y * p.x);
  p /= max(uScale, vec2(0.001));
  p += 0.5;
  vec2 cuv = containUv(p, videoSize, uCanvasSize);
  if (cuv.x < 0.0 || cuv.x > 1.0 || cuv.y < 0.0 || cuv.y > 1.0) return vec4(0.0, 0.0, 0.0, 1.0);
  // video textures arrive Y-flipped relative to GL
  return texture(tex, vec2(cuv.x, 1.0 - cuv.y));
}

void main() {
  vec4 a = sampleDeck(uTexA, uVideoSizeA, vUv);
  vec4 b = uHasB > 0.5 ? sampleDeck(uTexB, uVideoSizeB, vUv) : vec4(0.0, 0.0, 0.0, 1.0);
  outColor = mix(a, b, uCrossfade * uHasB);
}`;

const FX_FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform sampler2D uTex;
uniform vec2 uResolution;
uniform float uTime;
uniform float uBeat;           // 0..1 audio energy (0 when reactive off)
uniform float uBeatPhase;      // 0..1 position within the current beat (0 = on the beat)

uniform float uBrightness;     // 1 = identity
uniform float uContrast;       // 1 = identity
uniform float uSaturation;     // 1 = identity
uniform float uHue;            // radians
uniform float uGamma;          // 1 = identity
uniform float uExposure;       // 0 = identity
uniform float uTemperature;    // -1..1
uniform float uTint;           // -1..1
uniform float uGrayscale;      // 0..1
uniform float uInvert;         // 0..1
uniform float uSepia;          // 0..1
uniform float uOpacity;        // 0..1
uniform float uBlur;           // 0 = identity (uv radius)
uniform float uSharpen;        // 0..1
uniform float uPixelate;       // 0 = identity (block count factor)
uniform float uGlitch;         // 0..1
uniform float uChroma;         // 0..1
uniform float uScanlines;      // 0 or 1
uniform float uNoise;          // 0..1
uniform float uVignette;       // 0..1

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec3 sampleBase(vec2 uv) {
  if (uBlur <= 0.0001) return texture(uTex, uv).rgb;
  vec2 px = uBlur / uResolution;
  vec3 acc = vec3(0.0);
  for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++)
      acc += texture(uTex, uv + vec2(float(x), float(y)) * px).rgb;
  return acc / 9.0;
}

void main() {
  vec2 uv = vUv;

  // Pixelate
  if (uPixelate > 0.001) {
    float blocks = mix(240.0, 8.0, clamp(uPixelate, 0.0, 1.0));
    vec2 grid = vec2(blocks * uResolution.x / uResolution.y, blocks);
    uv = (floor(uv * grid) + 0.5) / grid;
  }

  // Glitch: horizontal slice displacement, time-driven
  if (uGlitch > 0.001) {
    float slice = floor(uv.y * 24.0);
    float jump = hash(vec2(slice, floor(uTime * 12.0)));
    float beatPulse = uBeatPhase > 0.0 ? (1.0 - uBeatPhase) * (1.0 - uBeatPhase) : 0.0;
    float amt = step(1.0 - uGlitch * 0.6, jump) * (jump - 0.5) * 0.2 * (1.0 + uBeat + beatPulse);
    uv.x = fract(uv.x + amt * uGlitch);
  }

  // Chromatic aberration + base sample
  vec3 col;
  if (uChroma > 0.001) {
    vec2 dir = (uv - 0.5) * uChroma * 0.04 * (1.0 + uBeat * 0.5);
    col = vec3(sampleBase(uv + dir).r, sampleBase(uv).g, sampleBase(uv - dir).b);
  } else {
    col = sampleBase(uv);
  }

  // Sharpen (unsharp mask)
  if (uSharpen > 0.001) {
    vec2 px = 1.0 / uResolution;
    vec3 blurN = (texture(uTex, uv + vec2(px.x, 0.0)).rgb + texture(uTex, uv - vec2(px.x, 0.0)).rgb +
                  texture(uTex, uv + vec2(0.0, px.y)).rgb + texture(uTex, uv - vec2(0.0, px.y)).rgb) * 0.25;
    col += (col - blurN) * uSharpen * 2.0;
  }

  // Grade: exposure -> temperature/tint -> brightness/contrast -> saturation/hue
  col *= exp2(uExposure);
  col.r *= 1.0 + uTemperature * 0.3;
  col.b *= 1.0 - uTemperature * 0.3;
  col.g *= 1.0 + uTint * 0.25;
  col *= uBrightness;
  col = (col - 0.5) * uContrast + 0.5;
  col = pow(max(col, 0.0), vec3(1.0 / max(uGamma, 0.01)));

  float luma = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(luma), col, uSaturation);

  if (abs(uHue) > 0.001) {
    float c = cos(uHue), s = sin(uHue);
    mat3 hueM = mat3(
      0.299 + 0.701 * c + 0.168 * s, 0.587 - 0.587 * c + 0.330 * s, 0.114 - 0.114 * c - 0.497 * s,
      0.299 - 0.299 * c - 0.328 * s, 0.587 + 0.413 * c + 0.035 * s, 0.114 - 0.114 * c + 0.292 * s,
      0.299 - 0.300 * c + 1.250 * s, 0.587 - 0.588 * c - 1.050 * s, 0.114 + 0.886 * c - 0.203 * s);
    col = col * hueM;
  }

  col = mix(col, vec3(luma), uGrayscale);
  col = mix(col, 1.0 - col, uInvert);
  vec3 sep = vec3(
    dot(col, vec3(0.393, 0.769, 0.189)),
    dot(col, vec3(0.349, 0.686, 0.168)),
    dot(col, vec3(0.272, 0.534, 0.131)));
  col = mix(col, sep, uSepia);

  // Noise
  if (uNoise > 0.001) {
    col += (hash(vUv * uResolution + fract(uTime) * 1000.0) - 0.5) * uNoise * 0.5;
  }

  // Vignette
  if (uVignette > 0.001) {
    float d = distance(vUv, vec2(0.5));
    col *= 1.0 - smoothstep(0.35, 0.85, d) * uVignette;
  }

  // Scanlines
  if (uScanlines > 0.5) {
    float line = sin(vUv.y * uResolution.y * 3.14159) * 0.5 + 0.5;
    col *= mix(0.82, 1.0, line);
  }

  outColor = vec4(clamp(col, 0.0, 1.0), 1.0) * uOpacity;
}`;

const FEEDBACK_FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform sampler2D uCurrent;
uniform sampler2D uPrevious;
uniform float uTrails;   // 0..1 persistence
uniform float uWarp;     // 0..1 zoom/rotate drift
uniform float uTime;

void main() {
  vec4 cur = texture(uCurrent, vUv);
  if (uTrails <= 0.001) { outColor = cur; return; }

  // Warp the history: slight zoom + rotation drift around center
  vec2 p = vUv - 0.5;
  float zoom = 1.0 - uWarp * 0.012;
  float ang = uWarp * 0.01 * sin(uTime * 0.4);
  float c = cos(ang), s = sin(ang);
  p = mat2(c, -s, s, c) * p * zoom;
  vec4 prev = texture(uPrevious, p + 0.5);

  // Decayed max blend: bright trails that die out
  float keep = 0.55 + uTrails * 0.43;
  outColor = max(cur, prev * keep);
}`;

const BLIT_FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uTex;
void main() { outColor = texture(uTex, vUv); }`;

interface Deck {
  video: HTMLVideoElement | null;
  texture: WebGLTexture;
  width: number;
  height: number;
}

export class Compositor {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private quad: WebGLVertexArrayObject;
  private progMix: WebGLProgram;
  private progFx: WebGLProgram;
  private progFeedback: WebGLProgram;
  private progBlit: WebGLProgram;
  private targets: Target[] = [];
  private feedback: [Target, Target] | null = null;
  private feedbackIndex = 0;
  private deckA: Deck;
  private deckB: Deck;
  private params: EngineParams = { ...IDENTITY_PARAMS };
  private crossfade = 0;
  private audio: AudioLevels = { bass: 0, mid: 0, treble: 0 };
  private audioReactive = false;
  private clockProvider: (() => { phase: number; confidence: number }) | null = null;
  private rack: { id: string; intensity: number }[] = [];
  private rackPrograms = new Map<string, WebGLProgram>();
  private raf = 0;
  private startTime = performance.now();
  private running = false;
  private uniformCache = new Map<WebGLProgram, Map<string, WebGLUniformLocation | null>>();

  // Rolling frame-time stats for the host's FPS meter
  frameCount = 0;
  lastFrameMs = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });
    if (!gl) throw new Error('WebGL2 is not available');
    this.gl = gl;
    this.quad = createQuad(gl);
    this.progMix = createProgram(gl, QUAD_VS, MIX_FS);
    this.progFx = createProgram(gl, QUAD_VS, FX_FS);
    this.progFeedback = createProgram(gl, QUAD_VS, FEEDBACK_FS);
    this.progBlit = createProgram(gl, QUAD_VS, BLIT_FS);
    this.deckA = { video: null, texture: createVideoTexture(gl), width: 1, height: 1 };
    this.deckB = { video: null, texture: createVideoTexture(gl), width: 1, height: 1 };
  }

  setVideoA(video: HTMLVideoElement | null) { this.deckA.video = video; }
  setVideoB(video: HTMLVideoElement | null) { this.deckB.video = video; }
  setCrossfade(v: number) { this.crossfade = Math.min(1, Math.max(0, v)); }
  setParams(p: Partial<EngineParams>) { this.params = { ...this.params, ...p }; }
  setAudioLevels(levels: AudioLevels, reactive: boolean) {
    this.audio = levels;
    this.audioReactive = reactive;
  }
  /** Active rack effects in chain order; intensity 0 entries are skipped. */
  setRack(rack: { id: string; intensity: number }[]) { this.rack = rack; }

  /** Host hands in a beat-clock reader; sampled once per rendered frame. */
  setClockProvider(fn: (() => { phase: number; confidence: number }) | null) {
    this.clockProvider = fn;
  }

  start() {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      const t0 = performance.now();
      this.renderFrame();
      this.lastFrameMs = performance.now() - t0;
      this.frameCount++;
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
    const gl = this.gl;
    for (const t of this.targets) destroyTarget(gl, t);
    if (this.feedback) { destroyTarget(gl, this.feedback[0]); destroyTarget(gl, this.feedback[1]); }
    gl.deleteTexture(this.deckA.texture);
    gl.deleteTexture(this.deckB.texture);
    gl.deleteProgram(this.progMix);
    gl.deleteProgram(this.progFx);
    gl.deleteProgram(this.progFeedback);
    gl.deleteProgram(this.progBlit);
    for (const prog of this.rackPrograms.values()) gl.deleteProgram(prog);
  }

  private rackProgram(id: string): WebGLProgram | null {
    let prog = this.rackPrograms.get(id);
    if (prog) return prog;
    const def = RACK_EFFECTS.find(e => e.id === id);
    if (!def) return null;
    try {
      prog = createProgram(this.gl, QUAD_VS, def.fs);
    } catch (err) {
      console.error(`Rack effect '${id}' failed to compile:`, err);
      return null;
    }
    this.rackPrograms.set(id, prog);
    return prog;
  }

  private u(prog: WebGLProgram, name: string): WebGLUniformLocation | null {
    let cache = this.uniformCache.get(prog);
    if (!cache) { cache = new Map(); this.uniformCache.set(prog, cache); }
    if (!cache.has(name)) cache.set(name, this.gl.getUniformLocation(prog, name));
    return cache.get(name)!;
  }

  private uploadDeck(deck: Deck) {
    const gl = this.gl;
    const v = deck.video;
    if (!v || v.readyState < 2 || v.videoWidth === 0) return;
    gl.bindTexture(gl.TEXTURE_2D, deck.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, v);
    deck.width = v.videoWidth;
    deck.height = v.videoHeight;
  }

  private ensureTargets(w: number, h: number) {
    const gl = this.gl;
    if (this.targets.length && this.targets[0].width === w && this.targets[0].height === h) return;
    for (const t of this.targets) destroyTarget(gl, t);
    if (this.feedback) { destroyTarget(gl, this.feedback[0]); destroyTarget(gl, this.feedback[1]); }
    this.targets = [createTarget(gl, w, h), createTarget(gl, w, h)];
    this.feedback = [createTarget(gl, w, h), createTarget(gl, w, h)];
    // clear feedback history
    for (const t of this.feedback) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  private renderFrame() {
    const gl = this.gl;
    const canvas = this.canvas;

    // Size canvas to display size (device-pixel aware, capped for perf)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(2, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(2, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    this.ensureTargets(w, h);

    this.uploadDeck(this.deckA);
    this.uploadDeck(this.deckB);

    const p = this.params;
    const time = (performance.now() - this.startTime) / 1000;
    const beat = this.audioReactive ? Math.min(1, this.audio.bass * 0.7 + this.audio.mid * 0.3) : 0;
    const [t0, t1] = this.targets;

    gl.bindVertexArray(this.quad);
    gl.viewport(0, 0, w, h);

    // --- Pass 1: MIX -> t0
    gl.bindFramebuffer(gl.FRAMEBUFFER, t0.fbo);
    gl.useProgram(this.progMix);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.deckA.texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.deckB.texture);
    gl.uniform1i(this.u(this.progMix, 'uTexA'), 0);
    gl.uniform1i(this.u(this.progMix, 'uTexB'), 1);
    gl.uniform1f(this.u(this.progMix, 'uCrossfade'), this.crossfade);
    gl.uniform2f(this.u(this.progMix, 'uVideoSizeA'), this.deckA.width, this.deckA.height);
    gl.uniform2f(this.u(this.progMix, 'uVideoSizeB'), this.deckB.width, this.deckB.height);
    gl.uniform2f(this.u(this.progMix, 'uCanvasSize'), w, h);
    gl.uniform1f(this.u(this.progMix, 'uHasB'), this.deckB.video ? 1 : 0);
    gl.uniform1f(this.u(this.progMix, 'uRotate'), (p.rotate * Math.PI) / 180);
    gl.uniform2f(this.u(this.progMix, 'uScale'), p.scaleX / 100, p.scaleY / 100);
    gl.uniform2f(this.u(this.progMix, 'uSkew'),
      Math.tan(((p.skewX || 0) * Math.PI) / 180), Math.tan(((p.skewY || 0) * Math.PI) / 180));
    gl.uniform2f(this.u(this.progMix, 'uTranslate'), (p.translateX || 0) / 100, -(p.translateY || 0) / 100);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // --- Pass 2: FX t0 -> t1
    gl.bindFramebuffer(gl.FRAMEBUFFER, t1.fbo);
    gl.useProgram(this.progFx);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, t0.tex);
    gl.uniform1i(this.u(this.progFx, 'uTex'), 0);
    gl.uniform2f(this.u(this.progFx, 'uResolution'), w, h);
    gl.uniform1f(this.u(this.progFx, 'uTime'), time);
    gl.uniform1f(this.u(this.progFx, 'uBeat'), beat);
    const clock = this.clockProvider ? this.clockProvider() : null;
    gl.uniform1f(this.u(this.progFx, 'uBeatPhase'), clock && clock.confidence > 0.3 ? clock.phase : 0);
    gl.uniform1f(this.u(this.progFx, 'uBrightness'), (p.brightness / 100) * (1 + beat * 0.3));
    gl.uniform1f(this.u(this.progFx, 'uContrast'), p.contrast / 100);
    gl.uniform1f(this.u(this.progFx, 'uSaturation'), (p.saturation / 100) * (1 + (this.audioReactive ? this.audio.mid * 0.5 : 0)));
    gl.uniform1f(this.u(this.progFx, 'uHue'), ((p.hue + (this.audioReactive ? this.audio.treble * 30 : 0)) * Math.PI) / 180);
    gl.uniform1f(this.u(this.progFx, 'uGamma'), p.gamma);
    gl.uniform1f(this.u(this.progFx, 'uExposure'), p.exposure);
    gl.uniform1f(this.u(this.progFx, 'uTemperature'), p.temperature / 100);
    gl.uniform1f(this.u(this.progFx, 'uTint'), p.tint / 100);
    gl.uniform1f(this.u(this.progFx, 'uGrayscale'), p.grayscale / 100);
    gl.uniform1f(this.u(this.progFx, 'uInvert'), p.invert / 100);
    gl.uniform1f(this.u(this.progFx, 'uSepia'), p.sepia / 100);
    gl.uniform1f(this.u(this.progFx, 'uOpacity'), p.opacity / 100);
    gl.uniform1f(this.u(this.progFx, 'uBlur'), p.blur);
    gl.uniform1f(this.u(this.progFx, 'uSharpen'), p.sharpen / 100);
    gl.uniform1f(this.u(this.progFx, 'uPixelate'), p.pixelate / 100);
    gl.uniform1f(this.u(this.progFx, 'uGlitch'), p.glitchIntensity / 100);
    gl.uniform1f(this.u(this.progFx, 'uChroma'), p.chromaticAberration / 100);
    gl.uniform1f(this.u(this.progFx, 'uScanlines'), p.scanlines ? 1 : 0);
    gl.uniform1f(this.u(this.progFx, 'uNoise'), p.noise / 100);
    gl.uniform1f(this.u(this.progFx, 'uVignette'), p.vignette / 100);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // --- Rack chain: ping-pong between t1 and t0 for each active effect
    let rackSrc = t1;
    let rackDst = t0;
    for (const entry of this.rack) {
      if (entry.intensity <= 0.001) continue;
      const prog = this.rackProgram(entry.id);
      if (!prog) continue;
      gl.bindFramebuffer(gl.FRAMEBUFFER, rackDst.fbo);
      gl.useProgram(prog);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, rackSrc.tex);
      gl.uniform1i(this.u(prog, 'uTex'), 0);
      gl.uniform1f(this.u(prog, 'uIntensity'), Math.min(1, entry.intensity));
      gl.uniform1f(this.u(prog, 'uBeatPhase'), clock && clock.confidence > 0.3 ? clock.phase : 0);
      gl.uniform1f(this.u(prog, 'uTime'), time);
      gl.uniform2f(this.u(prog, 'uResolution'), w, h);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      const tmp = rackSrc; rackSrc = rackDst; rackDst = tmp;
    }
    const rackOut = rackSrc;

    // --- Pass 3: FEEDBACK rackOut + history -> feedback[i], then blit to screen
    const fb = this.feedback!;
    const write = fb[this.feedbackIndex];
    const read = fb[1 - this.feedbackIndex];
    gl.bindFramebuffer(gl.FRAMEBUFFER, write.fbo);
    gl.useProgram(this.progFeedback);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, rackOut.tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, read.tex);
    gl.uniform1i(this.u(this.progFeedback, 'uCurrent'), 0);
    gl.uniform1i(this.u(this.progFeedback, 'uPrevious'), 1);
    gl.uniform1f(this.u(this.progFeedback, 'uTrails'), p.trails / 100);
    gl.uniform1f(this.u(this.progFeedback, 'uWarp'), p.warp / 100);
    gl.uniform1f(this.u(this.progFeedback, 'uTime'), time);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(this.progBlit);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, write.tex);
    gl.uniform1i(this.u(this.progBlit, 'uTex'), 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    this.feedbackIndex = 1 - this.feedbackIndex;
  }
}
