// The effect rack: chainable single-pass GPU effects with the Radiance
// contract — exactly one 0..1 intensity, identity at 0, smooth response,
// and a beat-phase uniform so every effect can ride the clock. Each entry
// is a fragment shader body run between the FX and FEEDBACK passes.
//
// The registry shape is deliberately ISF-adjacent (name + shader + one
// normalized input) so an ISF importer can populate it later.

export interface RackEffectDef {
  id: string;
  name: string;
  /** Fragment source. Receives: uTex, uIntensity, uBeatPhase, uTime, uResolution. */
  fs: string;
}

const HEADER = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uTex;
uniform float uIntensity;   // 0..1, identity at 0
uniform float uBeatPhase;   // 0..1 within the beat, 0 = on the beat (0 when clock idle)
uniform float uTime;
uniform vec2 uResolution;
float rhash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
`;

export const RACK_EFFECTS: RackEffectDef[] = [
  {
    id: 'kaleido',
    name: 'Kaleidoscope',
    fs: HEADER + `
void main() {
  vec2 c = vUv - 0.5;
  float ang = atan(c.y, c.x);
  float rad = length(c);
  float seg = 6.2831853 / 6.0;
  ang = abs(mod(ang, seg * 2.0) - seg);
  vec2 kUv = vec2(cos(ang), sin(ang)) * rad + 0.5;
  vec4 orig = texture(uTex, vUv);
  vec4 kal = texture(uTex, clamp(kUv, 0.0, 1.0));
  outColor = mix(orig, kal, uIntensity);
}`,
  },
  {
    id: 'mirror',
    name: 'Mirror',
    fs: HEADER + `
void main() {
  vec2 m = vec2(vUv.x < 0.5 ? vUv.x : 1.0 - vUv.x, vUv.y);
  vec4 orig = texture(uTex, vUv);
  vec4 mir = texture(uTex, m);
  outColor = mix(orig, mir, uIntensity);
}`,
  },
  {
    id: 'posterize',
    name: 'Posterize',
    fs: HEADER + `
void main() {
  vec4 col = texture(uTex, vUv);
  float levels = mix(256.0, 3.0, uIntensity);
  vec3 post = floor(col.rgb * levels) / levels;
  outColor = vec4(mix(col.rgb, post, min(uIntensity * 4.0, 1.0)), col.a);
}`,
  },
  {
    id: 'wave',
    name: 'Wave',
    fs: HEADER + `
void main() {
  float amt = uIntensity * 0.05;
  vec2 uv = vUv;
  uv.x += sin(uv.y * 12.0 + uTime * 2.0) * amt;
  uv.y += cos(uv.x * 10.0 + uTime * 1.6) * amt * 0.6;
  outColor = texture(uTex, clamp(uv, 0.0, 1.0));
}`,
  },
  {
    id: 'zoompulse',
    name: 'Zoom Pulse',
    fs: HEADER + `
void main() {
  // Kick on the beat: strongest at phase 0, decays across the beat.
  float pulse = uBeatPhase > 0.0 ? (1.0 - uBeatPhase) * (1.0 - uBeatPhase) : 0.5 + 0.5 * sin(uTime * 2.0);
  float zoom = 1.0 - uIntensity * 0.18 * pulse;
  vec2 uv = (vUv - 0.5) * zoom + 0.5;
  outColor = texture(uTex, clamp(uv, 0.0, 1.0));
}`,
  },
  {
    id: 'vhs',
    name: 'VHS',
    fs: HEADER + `
void main() {
  vec2 uv = vUv;
  // Tracking line wander
  float track = rhash(vec2(floor(uTime * 4.0), floor(uv.y * 30.0)));
  if (track > 1.0 - uIntensity * 0.25) {
    uv.x += (track - 0.5) * 0.08 * uIntensity;
  }
  // Color bleed
  float bleed = uIntensity * 0.006;
  vec3 col = vec3(
    texture(uTex, uv + vec2(bleed, 0.0)).r,
    texture(uTex, uv).g,
    texture(uTex, uv - vec2(bleed, 0.0)).b);
  // Tape noise band
  float band = smoothstep(0.97, 1.0, fract(uv.y * 0.5 - uTime * 0.12));
  col += band * rhash(uv * uResolution + uTime * 100.0) * uIntensity * 0.6;
  // Slight desaturation at high intensity
  float luma = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, vec3(luma), uIntensity * 0.25);
  outColor = vec4(col, 1.0);
}`,
  },
];
