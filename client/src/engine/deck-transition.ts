// Deck-to-deck crossfade: the new clip spins up on the hidden transition
// deck (B), the compositor mixes A→B on the GPU, then deck A silently
// re-loads the new clip, aligns to B's clock, and the mix snaps back to A.
// The program deck (A) therefore always ends up owning the current clip,
// so every existing Player control keeps working unchanged.

export interface CrossfadeOptions {
  deckA: HTMLVideoElement;
  deckB: HTMLVideoElement;
  url: string;
  startAt: number;          // seconds into the new clip
  duration: number;         // fade length in seconds
  volume: number;           // 0..1 program volume
  setCrossfade: (v: number) => void;
  onDone: () => void;
  onError: (err: unknown) => void;
}

export interface TransitionHandle {
  cancel: () => void;
}

function waitForEvent(el: HTMLVideoElement, event: string, timeoutMs: number, signal: { cancelled: boolean }): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for ${event}`));
    }, timeoutMs);
    const onEvent = () => { cleanup(); resolve(); };
    const onErr = () => { cleanup(); reject(new Error(`Media error while waiting for ${event}`)); };
    const cleanup = () => {
      clearTimeout(timer);
      el.removeEventListener(event, onEvent);
      el.removeEventListener('error', onErr);
    };
    if (signal.cancelled) { cleanup(); reject(new Error('cancelled')); return; }
    el.addEventListener(event, onEvent, { once: true });
    el.addEventListener('error', onErr, { once: true });
  });
}

export function runCrossfade(opts: CrossfadeOptions): TransitionHandle {
  const signal = { cancelled: false };
  const { deckA, deckB, url, startAt, duration, volume, setCrossfade } = opts;

  (async () => {
    // 1. Arm deck B with the incoming clip
    deckB.crossOrigin = 'anonymous';
    deckB.preload = 'auto';
    deckB.muted = false;
    deckB.volume = 0;
    deckB.src = url;
    deckB.load();
    await waitForEvent(deckB, 'canplay', 10000, signal);
    if (signal.cancelled) return;
    if (startAt > 0.05) {
      deckB.currentTime = startAt;
      await waitForEvent(deckB, 'seeked', 5000, signal);
      if (signal.cancelled) return;
    }
    await deckB.play();
    if (signal.cancelled) return;

    // 2. Animate the GPU mix A -> B (with an audio ramp to match)
    await new Promise<void>((resolve) => {
      const t0 = performance.now();
      const tick = () => {
        if (signal.cancelled) { resolve(); return; }
        const t = Math.min(1, (performance.now() - t0) / (duration * 1000));
        // smoothstep for an eased mix
        const s = t * t * (3 - 2 * t);
        setCrossfade(s);
        deckB.volume = s * volume;
        deckA.volume = (1 - s) * volume;
        if (t < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });
    if (signal.cancelled) return;

    // 3. Hand the clip back to the program deck: load the same URL on A,
    //    align to B's clock, then snap the mix home. Both decks show the
    //    same content at the same time, so the snap is invisible.
    deckA.muted = true;
    deckA.src = url;
    deckA.load();
    await waitForEvent(deckA, 'canplay', 10000, signal);
    if (signal.cancelled) return;
    deckA.currentTime = deckB.currentTime + 0.05;
    await waitForEvent(deckA, 'seeked', 5000, signal);
    if (signal.cancelled) return;
    await deckA.play();
    if (signal.cancelled) return;

    setCrossfade(0);
    deckA.muted = false;
    deckA.volume = volume;
    deckB.pause();
    deckB.removeAttribute('src');
    deckB.load();
    opts.onDone();
  })().catch((err) => {
    if (signal.cancelled) return;
    // Fallback: hard-load the clip on the program deck so playback never dies
    setCrossfade(0);
    deckB.pause();
    deckA.muted = false;
    deckA.volume = volume;
    if (!deckA.src.includes(url)) {
      deckA.src = url;
      deckA.load();
      deckA.play().catch(() => {});
    }
    opts.onError(err);
  });

  return {
    cancel: () => {
      signal.cancelled = true;
      setCrossfade(0);
      deckB.pause();
    },
  };
}

/** Parse "MM:SS" / "HH:MM:SS" / plain seconds into seconds. */
export function parseTimecode(tc: string | undefined): number {
  if (!tc) return 0;
  const parts = tc.split(':').map(Number);
  if (parts.some(isNaN)) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}
