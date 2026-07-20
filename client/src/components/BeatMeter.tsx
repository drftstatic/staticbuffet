import { useEffect, useRef, useState } from 'react';
import { beatClock } from '@/lib/clock';
import { useStore } from '@/lib/store';

// Compact transport clock for the status bar: pulsing beat dot, BPM readout,
// tap-tempo, and the quantize toggle. The dot animates via rAF directly on
// the DOM node so the meter never re-renders React at frame rate.
export function BeatMeter() {
  const { quantize, setQuantize } = useStore();
  const dotRef = useRef<HTMLSpanElement>(null);
  const [bpm, setBpm] = useState(beatClock.bpm);
  const [confident, setConfident] = useState(false);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const phase = beatClock.phase(now);
      const conf = beatClock.confidence;
      if (dotRef.current) {
        const pulse = conf > 0.3 ? (1 - phase) * (1 - phase) : 0;
        dotRef.current.style.opacity = String(0.25 + pulse * 0.75);
        dotRef.current.style.transform = `scale(${1 + pulse * 0.5})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const readout = setInterval(() => {
      setBpm(beatClock.bpm);
      setConfident(beatClock.confidence > 0.3);
    }, 500);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(readout);
    };
  }, []);

  return (
    <div className="flex items-center space-x-2" data-testid="beat-meter">
      <span
        ref={dotRef}
        className="inline-block w-2 h-2 rounded-full bg-lime-400"
        style={{ opacity: 0.25 }}
      />
      <span className={confident ? 'text-lime-300' : 'text-gray-500'}>
        {bpm} BPM
      </span>
      <button
        className="px-1.5 rounded border border-lime-500/40 hover:bg-lime-900/40 text-lime-300"
        onClick={() => beatClock.tap(performance.now())}
        title="Tap tempo"
        data-testid="button-tap-tempo"
      >
        TAP
      </button>
      <button
        className={`px-1.5 rounded border ${
          quantize
            ? 'border-lime-400 bg-lime-500/20 text-lime-300'
            : 'border-gray-600 text-gray-500 hover:bg-gray-800'
        }`}
        onClick={() => setQuantize(!quantize)}
        title="Quantize clip triggers to the beat"
        data-testid="button-quantize"
      >
        Q
      </button>
    </div>
  );
}
