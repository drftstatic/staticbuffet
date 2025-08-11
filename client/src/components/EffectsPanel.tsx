import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/lib/store';
import { 
  Palette, 
  Volume2, 
  Zap, 
  Eye,
  Waves,
  RotateCw,
  Contrast,
  Sun
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function EffectsPanel() {
  const { videoEffects, setVideoEffects, audioEffects, setAudioEffects } = useStore();

  const updateVideoEffect = (key: string, value: number | boolean) => {
    setVideoEffects({ ...videoEffects, [key]: value });
  };

  const updateAudioEffect = (key: string, value: number | boolean) => {
    setAudioEffects({ ...audioEffects, [key]: value });
  };

  const resetVideoEffects = () => {
    setVideoEffects({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      blur: 0,
      opacity: 100,
      grayscale: 0,
      invert: 0,
      sepia: 0,
      rotate: 0,
      scaleX: 100,
      scaleY: 100,
      glitchIntensity: 0,
      chromaticAberration: 0,
      scanlines: false,
      datamosh: false,
      pixelate: 0,
    });
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

  // Preset effects for quick application
  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'cyberpunk':
        setVideoEffects({
          ...videoEffects,
          brightness: 120,
          contrast: 140,
          saturation: 150,
          hue: 180,
          chromaticAberration: 30,
          scanlines: true,
        });
        break;
      case 'vintage':
        setVideoEffects({
          ...videoEffects,
          brightness: 90,
          contrast: 110,
          saturation: 80,
          sepia: 40,
          blur: 1,
        });
        break;
      case 'glitch':
        setVideoEffects({
          ...videoEffects,
          glitchIntensity: 50,
          chromaticAberration: 60,
          datamosh: true,
          pixelate: 30,
        });
        break;
      case 'noir':
        setVideoEffects({
          ...videoEffects,
          grayscale: 100,
          contrast: 150,
          brightness: 80,
        });
        break;
    }
  };

  return (
    <div className="space-y-4 p-4 max-h-[600px] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Effects Studio
        </h3>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" onClick={() => applyPreset('cyberpunk')}>
          Cyberpunk
        </Button>
        <Button size="sm" variant="outline" onClick={() => applyPreset('vintage')}>
          Vintage
        </Button>
        <Button size="sm" variant="outline" onClick={() => applyPreset('glitch')}>
          Glitch
        </Button>
        <Button size="sm" variant="outline" onClick={() => applyPreset('noir')}>
          Film Noir
        </Button>
      </div>

      <Accordion type="multiple" className="w-full">
        {/* Video Effects */}
        <AccordionItem value="video">
          <AccordionTrigger className="flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Video Effects
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            {/* Basic Color Controls */}
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Brightness</Label>
                <Slider
                  value={[videoEffects.brightness]}
                  onValueChange={([value]) => updateVideoEffect('brightness', value)}
                  min={0}
                  max={200}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{videoEffects.brightness}%</span>
              </div>

              <div>
                <Label className="text-xs">Contrast</Label>
                <Slider
                  value={[videoEffects.contrast]}
                  onValueChange={([value]) => updateVideoEffect('contrast', value)}
                  min={0}
                  max={200}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{videoEffects.contrast}%</span>
              </div>

              <div>
                <Label className="text-xs">Saturation</Label>
                <Slider
                  value={[videoEffects.saturation]}
                  onValueChange={([value]) => updateVideoEffect('saturation', value)}
                  min={0}
                  max={200}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{videoEffects.saturation}%</span>
              </div>

              <div>
                <Label className="text-xs">Hue Shift</Label>
                <Slider
                  value={[videoEffects.hue]}
                  onValueChange={([value]) => updateVideoEffect('hue', value)}
                  min={-180}
                  max={180}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{videoEffects.hue}°</span>
              </div>
            </div>

            <Separator />

            {/* Style Effects */}
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Blur</Label>
                <Slider
                  value={[videoEffects.blur]}
                  onValueChange={([value]) => updateVideoEffect('blur', value)}
                  min={0}
                  max={10}
                  step={0.1}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{videoEffects.blur}px</span>
              </div>

              <div>
                <Label className="text-xs">Grayscale</Label>
                <Slider
                  value={[videoEffects.grayscale]}
                  onValueChange={([value]) => updateVideoEffect('grayscale', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{videoEffects.grayscale}%</span>
              </div>

              <div>
                <Label className="text-xs">Sepia</Label>
                <Slider
                  value={[videoEffects.sepia]}
                  onValueChange={([value]) => updateVideoEffect('sepia', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{videoEffects.sepia}%</span>
              </div>
            </div>

            <Separator />

            {/* VJ Effects */}
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Rotation</Label>
                <Slider
                  value={[videoEffects.rotate]}
                  onValueChange={([value]) => updateVideoEffect('rotate', value)}
                  min={-180}
                  max={180}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{videoEffects.rotate}°</span>
              </div>

              <div>
                <Label className="text-xs">Glitch Intensity</Label>
                <Slider
                  value={[videoEffects.glitchIntensity]}
                  onValueChange={([value]) => updateVideoEffect('glitchIntensity', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{videoEffects.glitchIntensity}%</span>
              </div>

              <div>
                <Label className="text-xs">Chromatic Aberration</Label>
                <Slider
                  value={[videoEffects.chromaticAberration]}
                  onValueChange={([value]) => updateVideoEffect('chromaticAberration', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{videoEffects.chromaticAberration}px</span>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Scanlines</Label>
                <Switch
                  checked={videoEffects.scanlines}
                  onCheckedChange={(checked) => updateVideoEffect('scanlines', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Datamosh</Label>
                <Switch
                  checked={videoEffects.datamosh}
                  onCheckedChange={(checked) => updateVideoEffect('datamosh', checked)}
                />
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={resetVideoEffects} className="w-full">
              Reset Video Effects
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Audio Effects */}
        <AccordionItem value="audio">
          <AccordionTrigger className="flex items-center">
            <Volume2 className="h-4 w-4 mr-2" />
            Audio Effects
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Master Gain</Label>
                <Slider
                  value={[audioEffects.gain]}
                  onValueChange={([value]) => updateAudioEffect('gain', value)}
                  min={0}
                  max={200}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{audioEffects.gain}%</span>
              </div>

              <div>
                <Label className="text-xs">Bass</Label>
                <Slider
                  value={[audioEffects.bass]}
                  onValueChange={([value]) => updateAudioEffect('bass', value)}
                  min={-20}
                  max={20}
                  step={0.5}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{audioEffects.bass}dB</span>
              </div>

              <div>
                <Label className="text-xs">Mid</Label>
                <Slider
                  value={[audioEffects.mid]}
                  onValueChange={([value]) => updateAudioEffect('mid', value)}
                  min={-20}
                  max={20}
                  step={0.5}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{audioEffects.mid}dB</span>
              </div>

              <div>
                <Label className="text-xs">Treble</Label>
                <Slider
                  value={[audioEffects.treble]}
                  onValueChange={([value]) => updateAudioEffect('treble', value)}
                  min={-20}
                  max={20}
                  step={0.5}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{audioEffects.treble}dB</span>
              </div>

              <Separator />

              <div>
                <Label className="text-xs">Distortion</Label>
                <Slider
                  value={[audioEffects.distortion]}
                  onValueChange={([value]) => updateAudioEffect('distortion', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{audioEffects.distortion}%</span>
              </div>

              <div>
                <Label className="text-xs">Reverb</Label>
                <Slider
                  value={[audioEffects.reverb]}
                  onValueChange={([value]) => updateAudioEffect('reverb', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{audioEffects.reverb}%</span>
              </div>

              <div>
                <Label className="text-xs">Delay</Label>
                <Slider
                  value={[audioEffects.delay]}
                  onValueChange={([value]) => updateAudioEffect('delay', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{audioEffects.delay}%</span>
              </div>

              <div>
                <Label className="text-xs">Bitcrush</Label>
                <Slider
                  value={[audioEffects.bitcrush]}
                  onValueChange={([value]) => updateAudioEffect('bitcrush', value)}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-1"
                />
                <span className="text-xs text-gray-500">{audioEffects.bitcrush}%</span>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={resetAudioEffects} className="w-full">
              Reset Audio Effects
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}