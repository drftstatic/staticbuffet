// Text-to-Speech utilities for soundboards
export interface VoiceConfig {
  rate: number;
  pitch: number;
  volume: number;
  voiceName?: string;
  lang: string;
}

export const CHARACTER_VOICES: Record<string, VoiceConfig> = {
  waffle: {
    rate: 0.9,
    pitch: 1.1,
    volume: 0.8,
    lang: 'en-US'
  },
  ozzy: {
    rate: 0.8,
    pitch: 0.7,
    volume: 0.9,
    lang: 'en-GB'
  },
  mario: {
    rate: 1.2,
    pitch: 1.5,
    volume: 0.8,
    lang: 'en-US'
  },
  maxheadroom: {
    rate: 1.1,
    pitch: 0.9,
    volume: 0.9,
    lang: 'en-US'
  },
  dx: {
    rate: 1.0,
    pitch: 0.8,
    volume: 1.0,
    lang: 'en-US'
  }
};

export class TextToSpeechService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;

  constructor() {
    this.synth = window.speechSynthesis;
    this.initializeVoices();
  }

  private async initializeVoices(): Promise<void> {
    return new Promise((resolve) => {
      const loadVoices = () => {
        this.voices = this.synth.getVoices();
        this.isInitialized = true;
        resolve();
      };

      if (this.synth.getVoices().length > 0) {
        loadVoices();
      } else {
        this.synth.addEventListener('voiceschanged', loadVoices, { once: true });
        // Fallback timeout
        setTimeout(loadVoices, 1000);
      }
    });
  }

  private findBestVoice(config: VoiceConfig): SpeechSynthesisVoice | null {
    if (!this.isInitialized) return null;

    // Try to find a voice that matches the language and characteristics
    const languageVoices = this.voices.filter(voice => 
      voice.lang.startsWith(config.lang.split('-')[0])
    );

    if (languageVoices.length === 0) {
      return this.voices[0] || null;
    }

    // Prefer specific voice names if available
    if (config.voiceName) {
      const namedVoice = languageVoices.find(voice => 
        voice.name.toLowerCase().includes(config.voiceName!.toLowerCase())
      );
      if (namedVoice) return namedVoice;
    }

    // For character-specific preferences
    const maleVoices = languageVoices.filter(voice => 
      voice.name.toLowerCase().includes('male') || 
      voice.name.toLowerCase().includes('man') ||
      voice.name.toLowerCase().includes('david') ||
      voice.name.toLowerCase().includes('alex')
    );

    const femaleVoices = languageVoices.filter(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('victoria') ||
      voice.name.toLowerCase().includes('samantha')
    );

    // Character-specific voice selection
    if (config === CHARACTER_VOICES.ozzy && maleVoices.length > 0) {
      return maleVoices[0];
    }
    
    if (config === CHARACTER_VOICES.mario && maleVoices.length > 0) {
      return maleVoices[0];
    }

    if (config === CHARACTER_VOICES.dx && maleVoices.length > 0) {
      return maleVoices[0];
    }

    // Default to first available voice for the language
    return languageVoices[0];
  }

  async speak(text: string, character: keyof typeof CHARACTER_VOICES): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeVoices();
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    const config = CHARACTER_VOICES[character];
    if (!config) {
      throw new Error(`Unknown character: ${character}`);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.findBestVoice(config);
    
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = config.rate;
    utterance.pitch = config.pitch;
    utterance.volume = config.volume;
    utterance.lang = config.lang;

    return new Promise((resolve, reject) => {
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
      
      this.synth.speak(utterance);
    });
  }

  stop(): void {
    this.synth.cancel();
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

// Global instance
export const ttsService = new TextToSpeechService();