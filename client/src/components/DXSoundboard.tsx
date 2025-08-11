import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2 } from 'lucide-react';
import { useStore } from '@/lib/store';

interface DXSound {
  id: string;
  label: string;
  text: string;
}

const DX_SOUNDS: DXSound[] = [
  { id: 'ready', label: 'Are You Ready?', text: 'Are you ready?' },
  { id: 'suckit', label: 'Suck It!', text: 'Suck it!' },
  { id: 'twowords', label: 'Two Words', text: 'We got two words for ya!' },
  { id: 'dx', label: 'D-Generation X!', text: 'D-Generation X!' },
  { id: 'breakdown', label: 'Break It Down', text: 'Break it down!' },
  { id: 'aintdown', label: 'Ain\'t Down', text: 'If you ain\'t down with that, we got two words for ya!' },
  { id: 'crotchchop', label: 'Crotch Chop', text: 'Crotch chop!' },
  { id: 'rumble', label: 'Ready to Rumble', text: 'Are you ready to rumble?' }
];

export function DXSoundboard() {
  const { isDXMode, setDXMode, brandSkin } = useStore();

  const playSound = (sound: DXSound) => {
    console.log('🔊 DX Quote:', sound.text);
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
            {DX_SOUNDS.map((sound) => (
              <Button
                key={sound.id}
                onClick={() => playSound(sound)}
                className="bg-blue-600 hover:bg-blue-500 text-white h-auto py-3 px-2 text-xs font-bold flex items-center gap-2"
                data-testid={`button-dx-quote-${sound.id}`}
              >
                <Volume2 size={12} />
                <span className="leading-tight">{sound.label}</span>
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