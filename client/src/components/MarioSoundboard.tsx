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

interface MarioSound {
  id: string;
  label: string;
  text: string;
}

const MARIO_SOUNDS: MarioSound[] = [
  { id: 'sexy-mario', label: 'Sexy Mario', text: 'Hey, it\'s-a me, your VERY attractive plumber! 💪' },
  { id: 'pipes', label: 'Fix Pipes', text: 'I fix-a your pipes... if you know what I mean! *wink*' },
  { id: 'mushroom', label: 'Magic Mushroom', text: 'This magic mushroom makes me grow bigger! Mama mia!' },
  { id: 'princess-flirt', label: 'Hey Princess', text: 'Princess Peach, you want to see my castle? It\'s-a very big!' },
  { id: 'mustache', label: 'Mustache', text: 'You like-a my mustache? It tickles!' },
  { id: 'overalls', label: 'Overalls', text: 'These overalls... they come off easily! *eyebrow wiggle*' },
  { id: 'plumber-joke', label: 'Plumber Joke', text: 'I\'m-a here to lay some pipe! Get it? PIPE! Wahoo!' },
  { id: 'mamma-mia', label: 'Mamma Mia', text: 'MAMMA MIA! That\'s one spicy situation!' }
];

interface MarioSoundboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MarioSoundboard({ isOpen, onClose }: MarioSoundboardProps) {
  const { toast } = useToast();

  const playSound = async (sound: MarioSound) => {
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

      // Create a playful Mario-style sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Bouncy, high-pitched frequency for Mario sound
      const frequency = 400 + (sound.id.length * 80);
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(frequency * 1.5, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + 0.2);
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);

      toast({
        title: `🍄 MARIO SAYS:`,
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
        title: `🍄 MARIO SAYS:`,
        description: sound.text + ' (Audio not available - check browser settings)',
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-red-600 via-blue-600 to-yellow-500 border-2 border-yellow-400 text-white">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <DialogTitle className="text-3xl font-bold text-yellow-200 font-mono">
              🍄 SEXY MARIO SOUNDBOARD 🍄
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-yellow-200 hover:bg-red-700/50"
            >
              <X size={20} />
            </Button>
          </div>
          <div className="text-center mt-2">
            <p className="text-yellow-100 text-sm font-mono">
              VERY ATTRACTIVE PLUMBER • PIPE LAYING PROFESSIONAL • EYEBROW WIGGLES
            </p>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {MARIO_SOUNDS.map((sound) => (
            <Button
              key={sound.id}
              onClick={() => playSound(sound)}
              className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-yellow-100 font-bold py-4 px-4 rounded-lg border-2 border-yellow-400/50 transition-all duration-200 transform hover:scale-105 shadow-lg"
              data-testid={`mario-sound-${sound.id}`}
            >
              <div className="flex items-center space-x-2">
                <Volume2 size={16} />
                <span className="text-sm font-mono">{sound.label}</span>
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="text-xs text-yellow-200/70 font-mono">
            SEXY MODE ACTIVATED • Mushroom Kingdom's most attractive
          </div>
          <div className="text-xs text-yellow-300/60 font-mono mt-1">
            "Mama mia, that's-a one spicy video buffet!" - Sexy Mario
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}