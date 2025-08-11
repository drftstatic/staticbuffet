import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { Music } from 'lucide-react';

export function BlondieButton() {
  const { brandSkin, setBrandSkin, isBlondieGeometryMode, setBlondieGeometryMode } = useStore();
  const [clickCount, setClickCount] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (brandSkin !== 'blondie') {
      setBrandSkin('blondie');
      return;
    }

    setClickCount(prev => prev + 1);

    // Clear existing timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    // Set new timeout
    clickTimeoutRef.current = setTimeout(() => {
      if (clickCount + 1 >= 3) {
        setShowPrompt(true);
      }
      setClickCount(0);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.toLowerCase() === 'etc') {
      setBlondieGeometryMode(!isBlondieGeometryMode);
      setShowPrompt(false);
      setInputValue('');
      setClickCount(0);
    } else {
      setInputValue('');
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        variant={brandSkin === 'blondie' ? 'default' : 'outline'}
        size="sm"
        className={`transition-all duration-300 ${
          brandSkin === 'blondie' 
            ? 'bg-amber-800 hover:bg-amber-900 text-amber-100 border-amber-600' 
            : 'border-amber-600 hover:bg-amber-800 hover:text-amber-100'
        } ${isBlondieGeometryMode ? 'blondie-geometry' : ''}`}
        data-testid="button-blondie-theme"
      >
        <Music className="w-4 h-4 mr-2" />
        Blondie
      </Button>

      {showPrompt && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-amber-900 border border-amber-600 rounded-md shadow-lg z-50">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="text-xs text-amber-100 whitespace-nowrap">
              Enter code to unlock Geometry Changes:
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-2 py-1 text-xs bg-amber-950 border border-amber-600 rounded text-amber-100"
              placeholder="Enter code..."
              autoFocus
              data-testid="input-blondie-code"
            />
            <div className="flex space-x-1">
              <button
                type="submit"
                className="px-2 py-1 text-xs bg-amber-800 hover:bg-amber-700 text-amber-100 rounded"
                data-testid="button-blondie-submit"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPrompt(false);
                  setInputValue('');
                  setClickCount(0);
                }}
                className="px-2 py-1 text-xs bg-amber-700 hover:bg-amber-600 text-amber-100 rounded"
                data-testid="button-blondie-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}