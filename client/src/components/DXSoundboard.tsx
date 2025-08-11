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

  const playSound = async (sound: DXSound) => {
    try {
      // Create audio context if needed
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('Web Audio API not supported');
      }

      const audioContext = new AudioContextClass();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create an attitude-era wrestling entrance sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Aggressive, mid-range frequency for attitude era sound
      const frequency = 250 + (sound.id.length * 70);
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sawtooth';

      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.6);

      console.log('🔊 DX Quote:', sound.text);
    } catch (error) {
      console.error('Audio playback failed:', error);
      console.log('🔊 DX Quote (no audio):', sound.text);
    }
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