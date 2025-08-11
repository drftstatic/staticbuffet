import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { HulksterSoundboard } from '@/components/HulksterSoundboard';

export function HulksterButton() {
  const { brandSkin, isHulksterMode, setHulksterMode } = useStore();
  const [clickCount, setClickCount] = useState(0);
  const [showSoundboard, setShowSoundboard] = useState(false);

  // Only show when Hogan theme is active
  if (brandSkin !== 'hogan') return null;

  const handleClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    // Easter egg: triple-click to unlock HULKSTER mode
    if (newClickCount >= 3 && !isHulksterMode) {
      setHulksterMode(true);
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
          isHulksterMode
            ? 'text-yellow-300 bg-red-600/20 hover:bg-red-500/30 border border-yellow-400/50'
            : clickCount > 0
            ? 'text-yellow-400 hover:bg-red-800/30 animate-pulse'
            : 'text-yellow-300 hover:bg-gray-800/50'
        }`}
        data-testid="button-hulkster-hh"
      >
        {isHulksterMode ? '🤘 HH' : 'HH'}
      </Button>

      {showSoundboard && (
        <HulksterSoundboard 
          isOpen={showSoundboard} 
          onClose={handleCloseSoundboard} 
        />
      )}
    </>
  );
}