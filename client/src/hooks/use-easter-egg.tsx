import { useEffect, useState } from 'react';

export function useEasterEgg() {
  const [isEasterEggActive, setIsEasterEggActive] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [lastKeyTime, setLastKeyTime] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime;
      
      // Reset sequence if too much time has passed (2 seconds)
      if (timeDiff > 2000) {
        setKeySequence([]);
      }
      
      setLastKeyTime(currentTime);
      
      if (event.key.toLowerCase() === 'b') {
        setKeySequence(prev => {
          const newSequence = [...prev, 'b'].slice(-2); // Keep only last 2 keys
          
          // Check if we have 'bb'
          if (newSequence.length === 2 && newSequence.every(key => key === 'b')) {
            setIsEasterEggActive(true);
            return []; // Reset sequence
          }
          
          return newSequence;
        });
      } else if (event.key === 'Escape' && isEasterEggActive) {
        setIsEasterEggActive(false);
      } else {
        // Reset sequence on any other key
        setKeySequence([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lastKeyTime, isEasterEggActive]);

  const closeEasterEgg = () => {
    setIsEasterEggActive(false);
    setKeySequence([]);
  };

  return {
    isEasterEggActive,
    closeEasterEgg
  };
}