import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

export function DXButton() {
  const { brandSkin, isDXMode, setDXMode } = useStore();
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(() => {
    if (clickTimer) {
      clearTimeout(clickTimer);
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 3) {
      // Triple-click detected, activate DX mode
      setDXMode(true);
      setClickCount(0);
      setClickTimer(null);
    } else {
      // Set timer to reset click count after 1 second
      const timer = setTimeout(() => {
        setClickCount(0);
        setClickTimer(null);
      }, 1000);
      setClickTimer(timer);
    }
  }, [clickCount, clickTimer, setDXMode]);

  // Only show DX button when DX theme is active
  if (brandSkin !== 'dx') return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="p-2 text-pink-400 hover:bg-blue-900/50 transition-colors font-bold"
      data-testid="button-dx-easter-egg"
      title="Triple-click to activate DX Mode!"
    >
      DX
    </Button>
  );
}