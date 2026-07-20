// BeatClock — turns a stream of bass-energy samples into a musical clock:
// onset detection, BPM estimation, and a continuous 0..1 beat phase that
// effects and quantized triggers can lock to. Tap-tempo works with no audio
// analysis at all. Portable: no DOM, no React, no audio APIs — the host
// feeds it energy samples from whatever analyser it owns.

const MIN_BPM = 60;
const MAX_BPM = 180;
const ONSET_REFRACTORY_MS = 240;   // ignore re-triggers faster than 250 BPM
const ENERGY_WINDOW = 43;          // ~0.7s of history at 60 fps
const IOI_HISTORY = 8;             // inter-onset intervals kept for the estimate
const CONFIDENCE_DECAY_MS = 4000;  // confidence fades if onsets stop arriving

export class BeatClock {
  private energyHistory: number[] = [];
  private lastOnsetAt = 0;
  private intervals: number[] = [];
  private periodMs = 500;          // 120 BPM default
  private anchorMs = 0;            // timestamp of the last accepted beat
  private lastUpdateMs = 0;
  private tapTimes: number[] = [];
  private manualBpm: number | null = null;

  /** 0..1 confidence that the detected grid is real. */
  confidence = 0;

  /** Feed one bass-band energy sample (0..1) with a timestamp (ms). */
  update(bassEnergy: number, nowMs: number) {
    this.lastUpdateMs = nowMs;
    this.energyHistory.push(bassEnergy);
    if (this.energyHistory.length > ENERGY_WINDOW) this.energyHistory.shift();
    if (this.energyHistory.length < 12) return;

    const mean = this.energyHistory.reduce((a, b) => a + b, 0) / this.energyHistory.length;
    const variance = this.energyHistory.reduce((a, b) => a + (b - mean) * (b - mean), 0) / this.energyHistory.length;
    const threshold = mean + Math.max(0.06, Math.sqrt(variance) * 1.6);

    if (bassEnergy > threshold && nowMs - this.lastOnsetAt > ONSET_REFRACTORY_MS) {
      this.onOnset(nowMs);
    }

    // Confidence decays when the music stops
    if (nowMs - this.lastOnsetAt > CONFIDENCE_DECAY_MS && this.manualBpm === null) {
      this.confidence = Math.max(0, this.confidence - 0.005);
    }
  }

  private onOnset(nowMs: number) {
    if (this.lastOnsetAt > 0) {
      let ioi = nowMs - this.lastOnsetAt;
      // Fold intervals into the plausible BPM band (double/halve)
      while (ioi < 60000 / MAX_BPM) ioi *= 2;
      while (ioi > 60000 / MIN_BPM) ioi /= 2;
      this.intervals.push(ioi);
      if (this.intervals.length > IOI_HISTORY) this.intervals.shift();

      if (this.intervals.length >= 4 && this.manualBpm === null) {
        const sorted = [...this.intervals].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        const agreeing = this.intervals.filter(i => Math.abs(i - median) / median < 0.08).length;
        const agreement = agreeing / this.intervals.length;
        if (agreement >= 0.5) {
          this.periodMs = this.periodMs * 0.6 + median * 0.4;
          this.confidence = Math.min(1, 0.3 + agreement * 0.7);
        }
      }
    }
    this.lastOnsetAt = nowMs;

    // Re-anchor phase to the onset when it lands near a predicted beat,
    // or adopt it outright while confidence is still forming.
    const drift = this.anchorMs > 0
      ? Math.abs(((nowMs - this.anchorMs) % this.periodMs + this.periodMs) % this.periodMs)
      : 0;
    const nearBeat = Math.min(drift, this.periodMs - drift) < this.periodMs * 0.2;
    if (this.confidence < 0.5 || nearBeat) {
      this.anchorMs = nowMs;
    }
  }

  /** Tap-tempo: call on each tap. Returns the current BPM. */
  tap(nowMs: number): number {
    if (this.tapTimes.length && nowMs - this.tapTimes[this.tapTimes.length - 1] > 2500) {
      this.tapTimes = [];
    }
    this.tapTimes.push(nowMs);
    if (this.tapTimes.length >= 2) {
      const diffs = this.tapTimes.slice(1).map((t, i) => t - this.tapTimes[i]);
      const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      this.manualBpm = Math.round(60000 / avg);
      this.periodMs = avg;
      this.anchorMs = nowMs;
      this.confidence = 1;
    }
    return this.bpm;
  }

  /** Pin the tempo by hand (null returns control to detection). */
  setBpm(bpm: number | null) {
    this.manualBpm = bpm;
    if (bpm !== null) {
      this.periodMs = 60000 / Math.min(MAX_BPM, Math.max(MIN_BPM, bpm));
      this.anchorMs = this.lastUpdateMs || performance.now();
      this.confidence = 1;
    }
  }

  get bpm(): number {
    return Math.round(60000 / this.periodMs);
  }

  /** Continuous beat phase 0..1 at the given time (defaults to last update). */
  phase(nowMs?: number): number {
    const t = nowMs ?? this.lastUpdateMs ?? 0;
    if (this.anchorMs === 0) return 0;
    return (((t - this.anchorMs) % this.periodMs) + this.periodMs) % this.periodMs / this.periodMs;
  }

  /** Milliseconds until the next beat boundary. */
  msToNextBeat(nowMs: number): number {
    if (this.anchorMs === 0 || this.confidence < 0.3) return 0;
    return this.periodMs * (1 - this.phase(nowMs));
  }

  /** Milliseconds until the next bar (4/4) boundary. */
  msToNextBar(nowMs: number): number {
    if (this.anchorMs === 0 || this.confidence < 0.3) return 0;
    const barMs = this.periodMs * 4;
    const barPhase = (((nowMs - this.anchorMs) % barMs) + barMs) % barMs / barMs;
    return barMs * (1 - barPhase);
  }
}
