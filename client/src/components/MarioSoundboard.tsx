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
import { ttsService } from '@/lib/text-to-speech';

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
      // Show toast immediately
      toast({
        title: `🍄 MARIO SAYS:`,
        description: sound.text,
        duration: 3000,
      });

      // Speak the quote with Mario character voice (high pitch, fast rate)
      if (ttsService.isSupported()) {
        await ttsService.speak(sound.text, 'mario');
      } else {
        throw new Error('Text-to-speech not supported');
      }
    } catch (error) {
      console.error('Text-to-speech failed:', error);
      toast({
        title: `🍄 MARIO SAYS:`,
        description: sound.text + ' (Speech not available - check browser settings)',
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