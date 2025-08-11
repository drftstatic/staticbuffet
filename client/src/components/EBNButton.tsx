import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { EBNSoundboard } from '@/components/EBNSoundboard';

export function EBNButton() {
  const { brandSkin } = useStore();
  const [clickCount, setClickCount] = useState(0);
  const [showSoundboard, setShowSoundboard] = useState(false);

  // Only show when EBN theme is active
  if (brandSkin !== 'ebn') return null;

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
            ? 'text-lime-300 hover:bg-purple-900/50 animate-pulse'
            : 'text-lime-400 hover:bg-purple-900/30'
        }`}
        data-testid="button-ebn-eb"
      >
        📺 EB
      </Button>

      {showSoundboard && (
        <EBNSoundboard 
          isOpen={showSoundboard} 
          onClose={handleCloseSoundboard} 
        />
      )}
    </>
  );
}