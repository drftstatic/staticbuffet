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

interface EBNSound {
  id: string;
  label: string;
  text: string;
}

const EBN_SOUNDS: EBNSound[] = [
  { id: 'hijack', label: 'Hijack', text: 'This is Emergency Broadcast Network. We are hijacking your television.' },
  { id: 'electronation', label: 'Electronation', text: 'Electronic civil disobedience. This is the new resistance.' },
  { id: 'samples', label: 'Samples', text: 'We sample reality and broadcast the fragments back at you.' },
  { id: 'machine', label: 'Machine', text: 'The machine is using us. We must use the machine.' },
  { id: 'signal', label: 'Signal Lost', text: 'Signal hijacked. Transmission intercepted. Broadcasting truth.' },
  { id: 'glitch', label: 'Glitch', text: 'System error detected. Reality.exe has stopped working.' },
  { id: 'static', label: 'Static', text: 'Through the static comes clarity. Through chaos, order.' },
  { id: 'broadcast', label: 'Broadcast', text: 'This is your Emergency Broadcast Network. Stay tuned for further instructions.' }
];

interface EBNSoundboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EBNSoundboard({ isOpen, onClose }: EBNSoundboardProps) {
  const { toast } = useToast();

  const playSound = (sound: EBNSound) => {
    toast({
      title: `📺 EBN HIJACK:`,
      description: sound.text,
      duration: 3000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-purple-950 via-black to-green-950 border-2 border-lime-400 text-lime-300">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <DialogTitle className="text-3xl font-bold text-lime-400 font-mono">
              📺 EBN HIJACK SOUNDBOARD 📺
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-lime-400 hover:bg-purple-900/50"
            >
              <X size={20} />
            </Button>
          </div>
          <div className="text-center mt-2">
            <p className="text-lime-300 text-sm font-mono">
              SIGNAL HIJACKED • REALITY SAMPLED • TRUTH BROADCAST
            </p>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {EBN_SOUNDS.map((sound) => (
            <Button
              key={sound.id}
              onClick={() => playSound(sound)}
              className="bg-gradient-to-r from-purple-800 to-green-800 hover:from-purple-700 hover:to-green-700 text-lime-200 font-bold py-4 px-4 rounded-lg border-2 border-lime-400/50 transition-all duration-200 transform hover:scale-105 shadow-lg"
              data-testid={`ebn-sound-${sound.id}`}
            >
              <div className="flex items-center space-x-2">
                <Volume2 size={16} />
                <span className="text-sm font-mono">{sound.label}</span>
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="text-xs text-lime-400/70 font-mono">
            HIJACK MODE ACTIVATED • Emergency Broadcast Network online
          </div>
          <div className="text-xs text-lime-500/60 font-mono mt-1">
            "Electronic civil disobedience" - EBN Manifesto
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}