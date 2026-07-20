// Engine parameter surface. Deliberately mirrors the store's VideoEffects
// shape (CSS-era percentages/degrees) so existing panels drive the GPU
// pipeline unchanged; the compositor normalizes internally.

export interface EngineParams {
  // Color grade
  brightness: number;   // 100 = identity (%)
  contrast: number;     // 100 = identity (%)
  saturation: number;   // 100 = identity (%)
  hue: number;          // degrees
  gamma: number;        // 1 = identity
  exposure: number;     // 0 = identity (stops)
  temperature: number;  // 0 = identity (-100..100)
  tint: number;         // 0 = identity (-100..100)
  grayscale: number;    // 0..100
  invert: number;       // 0..100
  sepia: number;        // 0..100
  opacity: number;      // 0..100

  // Spatial / stylize
  blur: number;                // px-ish, 0 = identity
  sharpen: number;             // 0..100
  pixelate: number;            // 0 = identity, grows blockier
  glitchIntensity: number;     // 0..100
  chromaticAberration: number; // 0..100
  scanlines: boolean;
  noise: number;               // 0..100
  vignette: number;            // 0..100

  // Geometry
  rotate: number;     // degrees
  scaleX: number;     // 100 = identity (%)
  scaleY: number;     // 100 = identity (%)
  skewX: number;      // degrees
  skewY: number;      // degrees
  translateX: number; // % of frame
  translateY: number; // % of frame

  // Temporal (new in the GPU engine — impossible with CSS filters)
  trails: number;     // 0..100 feedback persistence
  warp: number;       // 0..100 feedback zoom/rotate drift
}

export const IDENTITY_PARAMS: EngineParams = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  gamma: 1,
  exposure: 0,
  temperature: 0,
  tint: 0,
  grayscale: 0,
  invert: 0,
  sepia: 0,
  opacity: 100,
  blur: 0,
  sharpen: 0,
  pixelate: 0,
  glitchIntensity: 0,
  chromaticAberration: 0,
  scanlines: false,
  noise: 0,
  vignette: 0,
  rotate: 0,
  scaleX: 100,
  scaleY: 100,
  skewX: 0,
  skewY: 0,
  translateX: 0,
  translateY: 0,
  trails: 0,
  warp: 0,
};

/** Audio analysis levels the host feeds in; the engine maps them to
 *  subtle grade modulation when audio-reactive mode is on. */
export interface AudioLevels {
  bass: number;   // 0..1
  mid: number;    // 0..1
  treble: number; // 0..1
}
