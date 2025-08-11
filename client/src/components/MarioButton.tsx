import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { MarioSoundboard } from '@/components/MarioSoundboard';

export function MarioButton() {
  const { brandSkin, isMarioMode, setMarioMode } = useStore();
  const [clickCount, setClickCount] = useState(0);
  const [showSoundboard, setShowSoundboard] = useState(false);

  // Only show when Mario theme is active
  if (brandSkin !== 'mario') return null;

  const handleClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    // Easter egg: triple-click to activate SEXY MARIO mode and soundboard
    if (newClickCount >= 3 && !isMarioMode) {
      setMarioMode(true);
      setShowSoundboard(true);
      
      // Reset click count after activation
      setTimeout(() => setClickCount(0), 1000);
    }
  };

  const handleCloseSoundboard = () => {
    setShowSoundboard(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        className={`p-2 font-bold transition-all duration-200 ${
          isMarioMode
            ? 'text-yellow-300 bg-red-600/20 hover:bg-red-500/30 border border-yellow-400/50'
            : clickCount > 0
            ? 'text-yellow-400 hover:bg-red-600/30 animate-pulse'
            : 'text-red-300 hover:bg-red-600/20'
        }`}
        data-testid="button-mario-ma"
      >
        {isMarioMode ? '🍄 SEXY' : '🍄 MA'}
      </Button>

      {showSoundboard && (
        <MarioSoundboard 
          isOpen={showSoundboard} 
          onClose={handleCloseSoundboard} 
        />
      )}
    </>
  );
}