import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';
import { 
  Headphones,
  RefreshCw,
  Sliders,
  Waves
} from 'lucide-react';

export function AudioEffectsPanel() {
  const { audioEffects, setAudioEffects } = useStore();

  const updateAudioEffect = (key: string, value: number | boolean) => {
    setAudioEffects({ ...audioEffects, [key]: value });
  };

  const resetAudioEffects = () => {
    setAudioEffects({
      gain: 100,
      bass: 0,
      mid: 0,
      treble: 0,
      distortion: 0,
      reverb: 0,
      delay: 0,
      chorus: 0,
      bitcrush: 0,
      lowpass: 20000,
      highpass: 20,
    });
  };

  return (
    <div className="space-y-4 p-4 max-h-[600px] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Headphones className="h-4 w-4 text-green-500" />
          <span className="text-xs font-medium text-gray-600">Audio Processing</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetAudioEffects}
          title="Reset Audio Effects"
          className="h-7 w-7 p-0 text-gray-500 hover:text-red-500"
        >
          <RefreshCw size={12} />
        </Button>
      </div>
      
      {/* EQ Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 mb-3">
          <Sliders className="h-3 w-3 text-blue-500" />
          <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Equalizer</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Master Gain</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{audioEffects.gain}%</span>
            </div>
            <Slider
              value={[audioEffects.gain]}
              onValueChange={([value]) => updateAudioEffect('gain', value)}
              min={0}
              max={200}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Bass</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{audioEffects.bass}dB</span>
            </div>
            <Slider
              value={[audioEffects.bass]}
              onValueChange={([value]) => updateAudioEffect('bass', value)}
              min={-20}
              max={20}
              step={0.5}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Mid</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{audioEffects.mid}dB</span>
            </div>
            <Slider
              value={[audioEffects.mid]}
              onValueChange={([value]) => updateAudioEffect('mid', value)}
              min={-20}
              max={20}
              step={0.5}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Treble</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{audioEffects.treble}dB</span>
            </div>
            <Slider
              value={[audioEffects.treble]}
              onValueChange={([value]) => updateAudioEffect('treble', value)}
              min={-20}
              max={20}
              step={0.5}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Audio Effects Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 mb-3">
          <Waves className="h-3 w-3 text-indigo-500" />
          <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Audio FX</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Distortion</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{audioEffects.distortion}%</span>
            </div>
            <Slider
              value={[audioEffects.distortion]}
              onValueChange={([value]) => updateAudioEffect('distortion', value)}
              min={0}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Reverb</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{audioEffects.reverb}%</span>
            </div>
            <Slider
              value={[audioEffects.reverb]}
              onValueChange={([value]) => updateAudioEffect('reverb', value)}
              min={0}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Delay</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{audioEffects.delay}%</span>
            </div>
            <Slider
              value={[audioEffects.delay]}
              onValueChange={([value]) => updateAudioEffect('delay', value)}
              min={0}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Bitcrush</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{audioEffects.bitcrush}%</span>
            </div>
            <Slider
              value={[audioEffects.bitcrush]}
              onValueChange={([value]) => updateAudioEffect('bitcrush', value)}
              min={0}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}