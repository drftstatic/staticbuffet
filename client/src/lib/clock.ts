// App-wide beat clock instance. Audio analysers feed it; the compositor,
// quantized triggering, and the BeatMeter UI read from it.
import { BeatClock } from '@/engine/beat-clock';

export const beatClock = new BeatClock();
