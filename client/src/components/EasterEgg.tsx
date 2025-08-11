import React from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

interface EasterEggProps {
  isActive: boolean;
  onClose: () => void;
}

export function EasterEgg({ isActive, onClose }: EasterEggProps) {
  const { setVideoEffects, videoEffects } = useStore();

  const activateAcidTrip = () => {
    // Enable intense video effects for acid trip mode
    setVideoEffects({
      ...videoEffects,
      intensity: 100,
      colorShift: 100,
      kaleidoscope: true,
      plasma: true,
      strobe: true,
      chromatic: true
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
          This will activate maximum visual chaos mode.
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