// Program output plumbing: the compositor canvas is rendered ONCE, and both
// the projector window and the set recorder consume the same
// captureStream — no second player, no postMessage sync, no drift.

interface ProgramOutputRegistry {
  canvas: HTMLCanvasElement | null;
  audioDest: MediaStreamAudioDestinationNode | null;
}

export const programOutput: ProgramOutputRegistry = {
  canvas: null,
  audioDest: null,
};

/** One mixed stream of the program: compositor video + WebAudio program audio. */
export function getProgramStream(fps = 60): MediaStream | null {
  if (!programOutput.canvas) return null;
  const stream = programOutput.canvas.captureStream(fps);
  if (programOutput.audioDest) {
    for (const track of programOutput.audioDest.stream.getAudioTracks()) {
      stream.addTrack(track);
    }
  }
  return stream;
}

let outputWin: Window | null = null;

/** Open (or focus) the projector window, fed by the live program stream. */
export function openOutputWindow(): boolean {
  const stream = getProgramStream();
  if (!stream) return false;

  if (outputWin && !outputWin.closed) {
    const v = outputWin.document.querySelector('video');
    if (v) (v as HTMLVideoElement).srcObject = stream;
    outputWin.focus();
    return true;
  }

  outputWin = window.open('', 'staticbuffet-output', 'width=960,height=540');
  if (!outputWin) return false;

  outputWin.document.write(`<!doctype html>
<title>STATIC BUFFET — OUTPUT</title>
<style>
  html, body { margin: 0; height: 100%; background: #000; overflow: hidden; cursor: none; }
  video { width: 100%; height: 100%; object-fit: contain; }
  #hint { position: fixed; bottom: 12px; left: 0; right: 0; text-align: center;
          font: 12px monospace; color: #9f9; opacity: 0.7; transition: opacity 1s; }
</style>
<video autoplay playsinline muted></video>
<div id="hint">double-click for fullscreen</div>`);
  outputWin.document.close();

  const video = outputWin.document.querySelector('video') as HTMLVideoElement;
  video.srcObject = stream;
  outputWin.document.addEventListener('dblclick', () => {
    const doc = outputWin!.document;
    if (doc.fullscreenElement) doc.exitFullscreen();
    else doc.documentElement.requestFullscreen().catch(() => {});
  });
  setTimeout(() => {
    const hint = outputWin?.document.getElementById('hint');
    if (hint) hint.style.opacity = '0';
  }, 4000);
  return true;
}

export function isOutputWindowOpen(): boolean {
  return !!outputWin && !outputWin.closed;
}

export function closeOutputWindow() {
  outputWin?.close();
  outputWin = null;
}

/** Records the program stream (not the screen) to a downloadable WebM. */
export class SetRecorder {
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];

  get recording(): boolean {
    return this.recorder?.state === 'recording';
  }

  start(): boolean {
    const stream = getProgramStream();
    if (!stream) return false;
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : 'video/webm';
    this.chunks = [];
    this.recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
    this.recorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
    this.recorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `static-buffet-set-${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    this.recorder.start(1000);
    return true;
  }

  stop() {
    this.recorder?.stop();
    this.recorder = null;
  }
}

export const setRecorder = new SetRecorder();
