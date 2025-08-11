import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2 } from 'lucide-react';
import { useStore } from '@/lib/store';

const DX_QUOTES = [
  "Are you ready?",
  "Suck it!",
  "We got two words for ya!",
  "D-Generation X!",
  "Break it down!",
  "If you ain't down with that, we got two words for ya!",
  "Crotch chop!",
  "Are you ready to rumble?"
];

export function DXSoundboard() {
  const { isDXMode, setDXMode, brandSkin } = useStore();

  const playQuote = (quote: string) => {
    console.log('🔊 DX Quote:', quote);
    // Note: Audio playback would require actual sound files
    // For now, we'll just log the quote
  };

  const closeSoundboard = () => {
    setDXMode(false);
  };

  if (!isDXMode || brandSkin !== 'dx') return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-pink-500/50 max-w-md w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-pink-400">D-GENERATION X SOUNDBOARD</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSoundboard}
              className="text-pink-400 hover:bg-pink-900/30"
            >
              ×
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {DX_QUOTES.map((quote, index) => (
              <Button
                key={index}
                onClick={() => playQuote(quote)}
                className="bg-blue-600 hover:bg-blue-500 text-white h-auto py-3 px-2 text-xs font-bold flex items-center gap-2"
                data-testid={`button-dx-quote-${index}`}
              >
                <Volume2 size={12} />
                <span className="leading-tight">{quote}</span>
              </Button>
            ))}
          </div>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            Triple H & Shawn Michaels attitude era classics
          </p>
        </CardContent>
      </Card>
    </div>
  );
}