import React from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

interface EasterEggProps {
  isActive: boolean;
  onClose: () => void;
}

export function EasterEgg({ isActive, onClose }: EasterEggProps) {
  const { setVideoEffects, videoEffects, addToQueue, queueItems } = useStore();

  const activateAcidTrip = async () => {
    // Add the Marilyn Manson video to the front of the queue
    const easterEggVideo = {
      identifier: 'TheVistaGroup-MarilynMansonGetYourGunnonBeavisandButthead',
      title: 'Marilyn Manson - Get Your Gunn (Easter Egg)',
      creator: 'Marilyn Manson',
      duration: '4:20',
      licenseurl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    };
    
    const videoUrl = 'https://archive.org/download/TheVistaGroup-MarilynMansonGetYourGunnonBeavisandButthead/Marilyn%20Manson%20-%20Get%20Your%20Gunn%20on%20Beavis%20and%20Butthead%20VHS%20%E2%80%A2%2060%20FPS%201996.mp4';
    
    // Add to front of queue (will be at index 0)
    addToQueue(easterEggVideo, videoUrl, true);
    
    // Enable intense video effects for acid trip mode
    setVideoEffects({
      ...videoEffects,
      intensity: 100,
      brightness: 150,
      contrast: 200,
      saturation: 300,
      hue: 180,
      chromaticAberration: 100,
      glitchIntensity: 80,
    });
    
    // Auto-close the easter egg after activating
    setTimeout(onClose, 1000);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-gradient-to-br from-purple-900 via-pink-800 to-red-900 p-8 rounded-lg border-2 border-yellow-400 text-center max-w-md mx-4 shadow-2xl">
        <div className="text-4xl mb-4 animate-pulse">🌀</div>
        <h2 className="text-2xl font-bold text-yellow-300 mb-4 font-mono">
          EASTER EGG UNLOCKED
        </h2>
        <p className="text-white mb-6 text-sm">
          You've discovered the secret Acid Trip effect!<br/>
          This will add the Marilyn Manson clip to your queue<br/>
          and activate maximum visual chaos mode.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={activateAcidTrip}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg"
            data-testid="button-activate-acid-trip"
          >
            🚀 ACTIVATE ACID TRIP MODE 🚀
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black"
            data-testid="button-close-easter-egg"
          >
            Maybe Later
          </Button>
        </div>
        
        <p className="text-xs text-gray-300 mt-4 opacity-75">
          Press 'bb' again anytime to return here
        </p>
      </div>
    </div>
  );
}