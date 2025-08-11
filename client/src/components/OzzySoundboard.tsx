import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface OzzySound {
  id: string;
  label: string;
  text: string;
}

const OZZY_SOUNDS: OzzySound[] = [
  { id: 'sharon', label: 'SHARON!', text: 'SHAROOOON! Where are you?!' },
  { id: 'madman', label: 'Madman', text: 'I\'m just a dreamer, I dream my life away!' },
  { id: 'darkness', label: 'Mr. Darkness', text: 'Hello darkness, my old friend...' },
  { id: 'trainwreck', label: 'Crazy Train', text: 'All aboard! HAHAHA! Crazy, but that\'s how it goes!' },
  { id: 'paranoid', label: 'Paranoid', text: 'Finished with my woman cause she couldn\'t help me with my mind!' },
  { id: 'sabbath', label: 'Sabbath', text: 'What is this that stands before me? Figure in black which points at me!' },
  { id: 'warwig', label: 'War Pigs', text: 'Generals gathered in their masses, just like witches at black masses!' },
  { id: 'metal', label: 'Heavy Metal', text: 'I am the god of hellfire, and I bring you FIRE!' }
];

interface OzzySoundboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OzzySoundboard({ isOpen, onClose }: OzzySoundboardProps) {
  const { toast } = useToast();

  const playSound = async (sound: OzzySound) => {
    try {
      // Create audio context if needed
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('Web Audio API not supported');
      }

      const audioContext = new AudioContextClass();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create a heavy metal-style distorted sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const distortion = audioContext.createWaveShaper();

      // Create distortion curve for metal sound
      const makeDistortionCurve = (amount: number) => {
        const samples = 44100;
        const curve = new Float32Array(samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < samples; i++) {
          const x = (i * 2) / samples - 1;
          curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
        }
        return curve;
      };

      distortion.curve = makeDistortionCurve(400);
      distortion.oversample = '4x';

      oscillator.connect(distortion);
      distortion.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Heavy, low frequency for metal sound
      const frequency = 80 + (sound.id.length * 30);
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sawtooth';

      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      toast({
        title: `🦇 OZZY SAYS:`,
        description: sound.text,
        duration: 3000,
      });

      // Clean up
      setTimeout(() => {
        audioContext.close();
      }, 1000);
    } catch (error) {
      console.error('Audio playback failed:', error);
      toast({
        title: `🦇 OZZY SAYS:`,
        description: sound.text + ' (Audio not available - check browser settings)',
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-black via-red-950 to-black border-2 border-red-500 text-red-100">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <DialogTitle className="text-3xl font-bold text-red-400 font-mono">
              🦇 OZZY SOUNDBOARD 🦇
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-red-400 hover:bg-red-900/50"
            >
              <X size={20} />
            </Button>
          </div>
          <div className="text-center mt-2">
            <p className="text-red-300 text-sm font-mono">
              PRINCE OF DARKNESS • BLACK SABBATH • CRAZY TRAIN
            </p>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {OZZY_SOUNDS.map((sound) => (
            <Button
              key={sound.id}
              onClick={() => playSound(sound)}
              className="bg-gradient-to-r from-red-800 to-black hover:from-red-700 hover:to-red-900 text-red-200 font-bold py-4 px-4 rounded-lg border-2 border-red-500/50 transition-all duration-200 transform hover:scale-105 shadow-lg"
              data-testid={`ozzy-sound-${sound.id}`}
            >
              <div className="flex items-center space-x-2">
                <Volume2 size={16} />
                <span className="text-sm font-mono">{sound.label}</span>
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="text-xs text-red-400/70 font-mono">
            METAL MODE ACTIVATED • The Prince of Darkness speaks
          </div>
          <div className="text-xs text-red-500/60 font-mono mt-1">
            "I'm not a prophet or a stone aged man, just a mortal with potential of a superman" - Ozzy
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}