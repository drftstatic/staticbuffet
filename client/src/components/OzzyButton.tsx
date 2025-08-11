import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { OzzySoundboard } from '@/components/OzzySoundboard';

export function OzzyButton() {
  const { brandSkin } = useStore();
  const [clickCount, setClickCount] = useState(0);
  const [showSoundboard, setShowSoundboard] = useState(false);

  // Only show when Ozzy theme is active
  if (brandSkin !== 'ozzy') return null;

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
            ? 'text-red-400 hover:bg-red-900/30 animate-pulse'
            : 'text-red-300 hover:bg-red-900/20'
        }`}
        data-testid="button-ozzy-oz"
      >
        🦇 OZ
      </Button>

      {showSoundboard && (
        <OzzySoundboard 
          isOpen={showSoundboard} 
          onClose={handleCloseSoundboard} 
        />
      )}
    </>
  );
}