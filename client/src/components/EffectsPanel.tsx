import React, { useState } from 'react';
import { AdaptiveColorControls } from '@/components/AdaptiveColorControls';
import { LoopControls } from '@/components/LoopControls';
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
  const { videoEffects, setVideoEffects, audioEffects, setAudioEffects, brandSkin } = useStore();

  // Global keyboard shortcuts for presets
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Digit1':
          e.preventDefault();
          applyPreset('cyberpunk');
          break;
        case 'Digit2':
          e.preventDefault();
          applyPreset('vintage');
          break;
        case 'Digit3':
          e.preventDefault();
          applyPreset('glitch');
          break;
        case 'Digit4':
          e.preventDefault();
          applyPreset('noir');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      case 'acidTrip':
        setVideoEffects({
          ...videoEffects,
          intensity: 100,
          colorShift: 100,
          kaleidoscope: true,
          plasma: true,
          strobe: true,
          chromatic: true,
          brightness: 150,
          contrast: 200,
          saturation: 300,
          hue: 180,
          chromaticAberration: 100,
          glitchIntensity: 80,
        });
        break;
    }
  };

  return (
    <div className="space-y-6 p-6 max-h-[600px] overflow-y-auto">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${
          brandSkin === 'waffle' 
            ? 'bg-yellow-100 text-amber-700' 
            : 'bg-lime-900/30 text-lime-400'
        }`}>
          <Zap className="h-5 w-5" />
        </div>
        <h3 className="font-bold text-amber-900 text-[15px]">
          Effects Studio
        </h3>
      </div>
      {/* Quick Presets */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" onClick={() => applyPreset('cyberpunk')} title="Keyboard: 1">
            <span className="mr-1 text-xs opacity-70">1</span> Cyberpunk
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyPreset('vintage')} title="Keyboard: 2">
            <span className="mr-1 text-xs opacity-70">2</span> Vintage
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyPreset('glitch')} title="Keyboard: 3">
            <span className="mr-1 text-xs opacity-70">3</span> Glitch
          </Button>
          <Button size="sm" variant="outline" onClick={() => applyPreset('noir')} title="Keyboard: 4">
            <span className="mr-1 text-xs opacity-70">4</span> Film Noir
          </Button>
        </div>
        
        {/* Special Acid Trip Button (unlocked by Easter egg) */}
        {(videoEffects.kaleidoscope || videoEffects.plasma || videoEffects.strobe) && (
          <Button
            size="sm"
            onClick={() => applyPreset('acidTrip')}
            className="w-full text-xs bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold animate-pulse border-2 border-yellow-400"
            title="Easter Egg Unlocked!"
          >
            🌀 ACID TRIP MODE 🌀
          </Button>
        )}
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
        
        {/* Loop Controls */}
        <AccordionItem value="loop-controls">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center space-x-2">
              <RotateCw className="w-4 h-4" />
              <span>Loop Controls</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <LoopControls />
          </AccordionContent>
        </AccordionItem>

        {/* Adaptive Color Scheme */}
        <AccordionItem value="adaptive-colors">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Adaptive Colors</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <AdaptiveColorControls />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}