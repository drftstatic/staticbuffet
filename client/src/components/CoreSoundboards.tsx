import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Volume2 } from 'lucide-react';
import { useStore } from '@/lib/store';
// Simple TTS implementation
const speakText = (text: string, voiceConfig: any) => {
  return new Promise<void>((resolve) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceConfig.rate || 1.0;
      utterance.pitch = voiceConfig.pitch || 1.0;
      utterance.onend = () => resolve();
      speechSynthesis.speak(utterance);
    } else {
      resolve();
    }
  });
};
import { useToast } from '@/hooks/use-toast';

// Consolidated soundboard data
const soundboards = {
  waffle: {
    name: 'Waffle House',
    sounds: [
      { id: 'eggs', text: "I'll take my eggs scattered, smothered, and covered!", voice: { pitch: 1.2, rate: 0.9 } },
      { id: 'hash', text: "Hash browns all the way!", voice: { pitch: 1.1, rate: 1.0 } },
      { id: 'coffee', text: "Keep that coffee coming!", voice: { pitch: 0.9, rate: 1.1 } },
      { id: 'shift', text: "Third shift crew checking in", voice: { pitch: 1.0, rate: 0.8 } }
    ]
  },
  ozzy: {
    name: 'Heavy Metal',
    sounds: [
      { id: 'train', text: "All aboard! Crazy train!", voice: { pitch: 0.7, rate: 1.2 } },
      { id: 'darkness', text: "Hello darkness my old friend", voice: { pitch: 0.6, rate: 0.8 } },
      { id: 'metal', text: "Metal up your life!", voice: { pitch: 0.8, rate: 1.1 } },
      { id: 'rock', text: "Let's rock and roll!", voice: { pitch: 0.7, rate: 1.0 } }
    ]
  },
  mario: {
    name: 'Mario World',
    sounds: [
      { id: 'mario', text: "It's-a me, Mario!", voice: { pitch: 1.4, rate: 1.1 } },
      { id: 'jump', text: "Wahoo! Here we go!", voice: { pitch: 1.5, rate: 1.2 } },
      { id: 'power', text: "Power up! Let's-a-go!", voice: { pitch: 1.3, rate: 1.0 } },
      { id: 'coin', text: "Mamma mia! Thank you so much!", voice: { pitch: 1.4, rate: 0.9 } }
    ]
  },
  max: {
    name: 'Max Headroom',
    sounds: [
      { id: 'stutter', text: "Th-th-that's all folks!", voice: { pitch: 1.2, rate: 1.3 } },
      { id: 'digital', text: "Welcome to the digital frontier!", voice: { pitch: 1.1, rate: 1.2 } },
      { id: 'glitch', text: "System glitch detected!", voice: { pitch: 1.0, rate: 1.4 } },
      { id: 'future', text: "The future is now!", voice: { pitch: 1.3, rate: 1.1 } }
    ]
  }
};

export function CoreSoundboards() {
  const { brandSkin } = useStore();
  const { toast } = useToast();
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());

  const playSound = async (soundboard: string, sound: any) => {
    const soundId = `${soundboard}-${sound.id}`;
    
    if (activeSounds.has(soundId)) return;
    
    setActiveSounds(prev => new Set([...Array.from(prev), soundId]));
    
    try {
      await speakText(sound.text, sound.voice);
      
      toast({
        title: `${soundboards[soundboard as keyof typeof soundboards].name}`,
        description: sound.text,
        duration: 2000,
      });
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setTimeout(() => {
        setActiveSounds(prev => {
          const newSet = new Set(Array.from(prev));
          newSet.delete(soundId);
          return newSet;
        });
      }, 3000);
    }
  };

  // Only show soundboard for current theme
  const getCurrentSoundboard = () => {
    switch (brandSkin) {
      case 'waffle': return soundboards.waffle;
      case 'ozzy': return soundboards.ozzy;
      case 'mario': return soundboards.mario;
      case 'maxheadroom': return soundboards.max;
      default: return null;
    }
  };

  const currentSoundboard = getCurrentSoundboard();
  
  if (!currentSoundboard) return null;

  return (
    <div className="fixed bottom-20 right-4 z-30 max-w-xs">
      <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            <Volume2 size={12} className="mr-1" />
            {currentSoundboard.name}
          </Badge>
          <span className="text-xs opacity-60">Triple-click theme</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {currentSoundboard.sounds.map((sound) => {
            const soundId = `${brandSkin}-${sound.id}`;
            const isActive = activeSounds.has(soundId);
            
            return (
              <Button
                key={sound.id}
                variant="ghost"
                size="sm"
                onClick={() => playSound(brandSkin, sound)}
                disabled={isActive}
                className="h-8 text-xs p-2 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                data-testid={`button-sound-${sound.id}`}
              >
                {isActive ? '🔊' : sound.text.slice(0, 12)}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}