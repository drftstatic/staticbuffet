import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { WaffleHouseSoundboard } from '@/components/WaffleHouseSoundboard';

export function WaffleButton() {
  const { brandSkin } = useStore();
  const [clickCount, setClickCount] = useState(0);
  const [showSoundboard, setShowSoundboard] = useState(false);

  // Only show when Waffle theme is active
  if (brandSkin !== 'waffle') return null;

  const handleClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    // Easter egg: triple-click to open soundboard
    if (newClickCount >= 3) {
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
          clickCount > 0
            ? 'text-amber-600 hover:bg-amber-100/50 animate-pulse'
            : 'text-amber-700 hover:bg-amber-100/30'
        }`}
        data-testid="button-waffle-wh"
      >
        🧇 WH
      </Button>

      {showSoundboard && (
        <WaffleHouseSoundboard 
          isOpen={showSoundboard} 
          onClose={handleCloseSoundboard} 
        />
      )}
    </>
  );
}