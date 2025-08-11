import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { MaxHeadroomSoundboard } from '@/components/MaxHeadroomSoundboard';
import { useToast } from '@/hooks/use-toast';

export function MaxButton() {
  const { brandSkin, isAsciiMode, setAsciiMode } = useStore();
  const { toast } = useToast();
  const [clickCount, setClickCount] = useState(0);
  const [showSoundboard, setShowSoundboard] = useState(false);

  // Only show when Max Headroom theme is active
  if (brandSkin !== 'maxheadroom') return null;

  const handleClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    // Easter egg: triple-click to activate ASCII mode and open soundboard
    if (newClickCount >= 3) {
      setAsciiMode(true);
      setShowSoundboard(true);
      
      toast({
        title: "📺 ASCII MODE ACTIVATED",
        description: "Max Headroom retro computing experience enabled!",
        duration: 4000,
      });
      
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
        className={`p-2 font-bold transition-all duration-200 font-mono ${
          isAsciiMode
            ? 'text-green-300 hover:bg-green-900/50 animate-pulse border border-green-500'
            : clickCount > 0
            ? 'text-green-300 hover:bg-green-900/50 animate-pulse'
            : 'text-green-400 hover:bg-green-900/30'
        }`}
        data-testid="button-max-mx"
      >
        {isAsciiMode ? '📺 ASCII' : '📺 MX'}
      </Button>

      {showSoundboard && (
        <MaxHeadroomSoundboard 
          isOpen={showSoundboard} 
          onClose={handleCloseSoundboard} 
        />
      )}
    </>
  );
}