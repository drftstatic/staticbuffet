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
      // Show toast immediately
      toast({
        title: `🦇 OZZY SAYS:`,
        description: sound.text,
        duration: 3000,
      });

      // Speak the quote with Ozzy character voice (low pitch, British accent)
      if (ttsService.isSupported()) {
        await ttsService.speak(sound.text, 'ozzy');
      } else {
        throw new Error('Text-to-speech not supported');
      }
    } catch (error) {
      console.error('Text-to-speech failed:', error);
      toast({
        title: `🦇 OZZY SAYS:`,
        description: sound.text + ' (Speech not available - check browser settings)',
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