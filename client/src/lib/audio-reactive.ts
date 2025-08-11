export class AudioReactiveController {
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private isActive = false;
  private lastTrigger = 0;
  private cooldownPeriod = 500; // 500ms cooldown
  private threshold = 128; // Energy threshold
  private onBeatDetected: (() => void) | null = null;

  async initialize(): Promise<boolean> {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create analyzer
      this.analyzer = this.audioContext.createAnalyser();
      this.analyzer.fftSize = 256;
      this.analyzer.smoothingTimeConstant = 0.8;
      
      // Connect microphone to analyzer
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      this.microphone.connect(this.analyzer);
      
      // Create data array for frequency data
      this.dataArray = new Uint8Array(this.analyzer.frequencyBinCount);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize audio reactive:', error);
      return false;
    }
  }

  start(onBeatDetected: () => void) {
    if (!this.analyzer || !this.dataArray) {
      console.error('Audio reactive not initialized');
      return;
    }

    this.isActive = true;
    this.onBeatDetected = onBeatDetected;
    this.analyze();
  }

  stop() {
    this.isActive = false;
    this.onBeatDetected = null;
  }

  private analyze() {
    if (!this.isActive || !this.analyzer || !this.dataArray) return;

    // Get frequency data
    this.analyzer.getByteFrequencyData(this.dataArray);

    // Calculate RMS energy
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i] * this.dataArray[i];
    }
    const rms = Math.sqrt(sum / this.dataArray.length);

    // Check for beat detection
    const now = Date.now();
    if (rms > this.threshold && now - this.lastTrigger > this.cooldownPeriod) {
      this.lastTrigger = now;
      this.onBeatDetected?.();
    }

    // Continue analyzing
    requestAnimationFrame(() => this.analyze());
  }

  setThreshold(threshold: number) {
    this.threshold = threshold;
  }

  setCooldown(cooldown: number) {
    this.cooldownPeriod = cooldown;
  }

  dispose() {
    this.stop();
    
    if (this.microphone) {
      this.microphone.disconnect();
      this.microphone = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.analyzer = null;
    this.dataArray = null;
  }
}
