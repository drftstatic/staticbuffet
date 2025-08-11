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

interface HulksterSound {
  id: string;
  label: string;
  text: string;
}

const HULKSTER_SOUNDS: HulksterSound[] = [
  { id: 'brother', label: 'BROTHER!', text: 'Let me tell you something, BROTHER!' },
  { id: 'whatcha', label: 'Whatcha Gonna Do?', text: 'Whatcha gonna do when these 24-inch pythons come after YOU?' },
  { id: 'train', label: 'Train Hard', text: 'Train hard, say your prayers, eat your vitamins!' },
  { id: 'nwo', label: 'NWO 4 Life', text: 'NWO 4 LIFE, brother!' },
  { id: 'hollywood', label: 'Hollywood', text: 'I am Hollywood Hogan, the third man!' },
  { id: 'pythons', label: 'Pythons', text: 'These 24-inch pythons are running wild!' },
  { id: 'hulkamaniacs', label: 'Hulkamaniacs', text: 'All my little Hulkamaniacs out there!' },
  { id: 'immortal', label: 'Immortal', text: 'I am a real American, brother! Immortal Hulk Hogan!' },
];

interface HulksterSoundboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HulksterSoundboard({ isOpen, onClose }: HulksterSoundboardProps) {
  const { toast } = useToast();

  const playSound = (sound: HulksterSound) => {
    // Since we can't play actual audio files, show the text as a toast
    toast({
      title: `🤘 HULKSTER SAYS:`,
      description: sound.text,
      duration: 3000,
    });

    // In a real implementation, you would play audio here:
    // const audio = new Audio(`/sounds/hulkster/${sound.id}.wav`);
    // audio.play().catch(console.error);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-red-900 via-black to-yellow-900 border-2 border-yellow-400 text-yellow-100">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <DialogTitle className="text-3xl font-bold text-yellow-300 font-mono">
              🤘 HULKSTER SOUNDBOARD 🤘
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-yellow-300 hover:bg-red-800/50"
            >
              <X size={20} />
            </Button>
          </div>
          <div className="text-center mt-2">
            <p className="text-yellow-400 text-sm font-mono">
              HOLLYWOOD HOGAN • NWO 4 LIFE • WHATCHA GONNA DO?
            </p>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {HULKSTER_SOUNDS.map((sound) => (
            <Button
              key={sound.id}
              onClick={() => playSound(sound)}
              className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white font-bold py-4 px-4 rounded-lg border-2 border-yellow-400/50 transition-all duration-200 transform hover:scale-105 shadow-lg"
              data-testid={`hulkster-sound-${sound.id}`}
            >
              <div className="flex items-center space-x-2">
                <Volume2 size={16} />
                <span className="text-sm font-mono">{sound.label}</span>
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="text-xs text-yellow-400/70 font-mono">
            EASTER EGG UNLOCKED • Triple-click HH to activate HULKSTER mode
          </div>
          <div className="text-xs text-yellow-500/60 font-mono mt-1">
            "Train hard, say your prayers, eat your vitamins, and be a true American!" - Hulk Hogan
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}