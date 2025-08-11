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

interface WaffleSound {
  id: string;
  label: string;
  text: string;
}

const WAFFLE_SOUNDS: WaffleSound[] = [
  { id: 'welcome', label: 'Welcome!', text: 'Welcome to Waffle House, hon! What can I get ya?' },
  { id: 'hashbrowns', label: 'Hash Browns', text: 'How you want them hash browns? Scattered, smothered, covered?' },
  { id: 'alltheway', label: 'All The Way', text: 'All the way! That\'s scattered, smothered, covered, chunked, diced, peppered, capped, topped, and country!' },
  { id: 'coffee', label: 'Coffee', text: 'Coffee\'s fresh, sugar! Just made a new pot.' },
  { id: 'grill', label: 'On The Grill', text: 'Two over easy, hash browns scattered, bacon crispy - coming right up!' },
  { id: 'pecanwaffle', label: 'Pecan Waffle', text: 'Pecan waffle with extra syrup? You got good taste, sweetie!' },
  { id: 'night', label: '24/7', text: 'We never close, honey! Waffle House is always here for ya.' },
  { id: 'family', label: 'Family', text: 'You\'re family now, sugar. This is your Waffle House!' }
];

interface WaffleHouseSoundboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaffleHouseSoundboard({ isOpen, onClose }: WaffleHouseSoundboardProps) {
  const { toast } = useToast();

  const playSound = async (sound: WaffleSound) => {
    try {
      // Show toast immediately
      toast({
        title: `🧇 WAFFLE HOUSE SAYS:`,
        description: sound.text,
        duration: 3000,
      });

      // Speak the quote with Waffle House character voice
      if (ttsService.isSupported()) {
        await ttsService.speak(sound.text, 'waffle');
      } else {
        throw new Error('Text-to-speech not supported');
      }
    } catch (error) {
      console.error('Text-to-speech failed:', error);
      toast({
        title: `🧇 WAFFLE HOUSE SAYS:`,
        description: sound.text + ' (Speech not available - check browser settings)',
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-100 border-2 border-amber-400 text-amber-900">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <DialogTitle className="text-3xl font-bold text-amber-800 font-mono">
              🧇 WAFFLE HOUSE SOUNDBOARD 🧇
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-amber-800 hover:bg-amber-200/50"
            >
              <X size={20} />
            </Button>
          </div>
          <div className="text-center mt-2">
            <p className="text-amber-700 text-sm font-mono">
              SCATTERED • SMOTHERED • COVERED • ALL THE WAY
            </p>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {WAFFLE_SOUNDS.map((sound) => (
            <Button
              key={sound.id}
              onClick={() => playSound(sound)}
              className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-900 font-bold py-4 px-4 rounded-lg border-2 border-amber-600/50 transition-all duration-200 transform hover:scale-105 shadow-lg"
              data-testid={`waffle-sound-${sound.id}`}
            >
              <div className="flex items-center space-x-2">
                <Volume2 size={16} />
                <span className="text-sm font-mono">{sound.label}</span>
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="text-xs text-amber-700/70 font-mono">
            DINER MODE ACTIVATED • Southern comfort food since 1955
          </div>
          <div className="text-xs text-amber-600/60 font-mono mt-1">
            "Good Food Fast" - The Waffle House Way
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}