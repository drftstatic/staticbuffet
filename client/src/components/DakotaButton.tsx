import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { Truck } from 'lucide-react';

export function DakotaButton() {
  const { brandSkin, setBrandSkin, isDakotaVanillaMode, setDakotaVanillaMode } = useStore();
  const [clickCount, setClickCount] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (brandSkin !== 'dakota') {
      setBrandSkin('dakota');
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
    if (inputValue.toLowerCase() === '96') {
      setDakotaVanillaMode(!isDakotaVanillaMode);
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
        variant={brandSkin === 'dakota' ? 'default' : 'outline'}
        size="sm"
        className={`transition-all duration-300 ${
          brandSkin === 'dakota' 
            ? 'bg-black hover:bg-gray-900 text-white border-gray-600' 
            : 'border-gray-600 hover:bg-black hover:text-white'
        } ${isDakotaVanillaMode ? 'dakota-vanilla-filter' : ''}`}
        data-testid="button-dakota-theme"
      >
        <Truck className="w-4 h-4 mr-2" />
        Dakota
      </Button>

      {showPrompt && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-black border border-gray-600 rounded-md shadow-lg z-50">
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="text-xs text-gray-300 whitespace-nowrap">
              Enter code to unlock Vanilla Filter:
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-2 py-1 text-xs bg-gray-900 border border-gray-600 rounded text-white"
              placeholder="Enter code..."
              autoFocus
              data-testid="input-dakota-code"
            />
            <div className="flex space-x-1">
              <button
                type="submit"
                className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-white rounded"
                data-testid="button-dakota-submit"
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
                className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded"
                data-testid="button-dakota-cancel"
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