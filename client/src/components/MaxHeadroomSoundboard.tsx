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

interface MaxSound {
  id: string;
  label: string;
  text: string;
}

const MAX_SOUNDS: MaxSound[] = [
  { id: 'catch', label: 'Catch', text: 'C-c-c-catch the wave! The future is n-n-now!' },
  { id: 'maximum', label: 'Maximum', text: 'Maximum headroom achieved! Welcome to the future!' },
  { id: 'television', label: 'Television', text: 'Television is the opium of the masses. I am the antidote!' },
  { id: 'digital', label: 'Digital', text: 'Digital is the new analog. Static is the new signal!' },
  { id: 'future', label: 'Future', text: 'The future belongs to those who c-c-control the signal!' },
  { id: 'glitch', label: 'Glitch', text: 'G-g-glitches are features, not bugs in the matrix!' },
  { id: 'broadcast', label: 'Broadcast', text: 'Broadcasting from the edge of tomorrow, this is Max Headroom!' },
  { id: 'corporate', label: 'Corporate', text: 'Corporate control is the enemy of creative expression!' }
];

interface MaxHeadroomSoundboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MaxHeadroomSoundboard({ isOpen, onClose }: MaxHeadroomSoundboardProps) {
  const { toast } = useToast();

  const playSound = async (sound: MaxSound) => {
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

      // Create a glitchy, digital Max Headroom-style sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Digital, glitchy frequency pattern
      const baseFreq = 300 + (sound.id.length * 60);
      oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(baseFreq * 0.7, audioContext.currentTime + 0.05);
      oscillator.frequency.setValueAtTime(baseFreq * 1.3, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime + 0.15);
      oscillator.type = 'square';

      // Add digital filtering
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, audioContext.currentTime);
      filter.Q.setValueAtTime(10, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);

      toast({
        title: `📺 MAX HEADROOM:`,
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
        title: `📺 MAX HEADROOM:`,
        description: sound.text + ' (Audio not available - check browser settings)',
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-green-950 via-black to-cyan-950 border-2 border-green-400 text-green-200">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <DialogTitle className="text-3xl font-bold text-green-400 font-mono">
              📺 MAX HEADROOM SOUNDBOARD 📺
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-green-400 hover:bg-green-900/50"
            >
              <X size={20} />
            </Button>
          </div>
          <div className="text-center mt-2">
            <p className="text-green-300 text-sm font-mono">
              MAXIMUM HEADROOM • DIGITAL PROPHET • FUTURE SHOCK
            </p>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {MAX_SOUNDS.map((sound) => (
            <Button
              key={sound.id}
              onClick={() => playSound(sound)}
              className="bg-gradient-to-r from-green-800 to-cyan-800 hover:from-green-700 hover:to-cyan-700 text-green-200 font-bold py-4 px-4 rounded-lg border-2 border-green-400/50 transition-all duration-200 transform hover:scale-105 shadow-lg"
              data-testid={`max-sound-${sound.id}`}
            >
              <div className="flex items-center space-x-2">
                <Volume2 size={16} />
                <span className="text-sm font-mono">{sound.label}</span>
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="text-xs text-green-400/70 font-mono">
            HEADROOM MODE ACTIVATED • Broadcasting from the future
          </div>
          <div className="text-xs text-green-500/60 font-mono mt-1">
            "C-c-c-catch the wave!" - Max Headroom
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}