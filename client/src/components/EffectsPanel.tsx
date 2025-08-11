import React, { useState } from 'react';
import { AdaptiveColorControls } from '@/components/AdaptiveColorControls';
import { LiveVideoMode } from '@/components/LiveVideoMode';
import { LoopControls } from '@/components/LoopControls';
import { EDLRecorder } from '@/components/EDLRecorder';
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
  Sun,
  FileText
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScaleTransition } from './AnimatedTransitions';

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
        case 'Digit5':
          e.preventDefault();
          applyPreset('vortex');
          break;
        case 'Digit6':
          e.preventDefault();
          applyPreset('portal');
          break;
        case 'Digit7':
          e.preventDefault();
          applyPreset('fractal');
          break;
        case 'Digit8':
          e.preventDefault();
          applyPreset('timewarp');
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
      case 'vortex':
        setVideoEffects({
          ...videoEffects,
          rotate: 180,
          scaleX: 120,
          scaleY: 80,
          blur: 2,
          brightness: 130,
          contrast: 160,
          saturation: 200,
          hue: 120,
          chromaticAberration: 40,
          pixelate: 15,
        });
        break;
      case 'portal':
        setVideoEffects({
          ...videoEffects,
          brightness: 80,
          contrast: 200,
          saturation: 50,
          hue: -60,
          invert: 30,
          sepia: 20,
          chromaticAberration: 80,
          glitchIntensity: 60,
          scaleX: 150,
          scaleY: 150,
        });
        break;
      case 'fractal':
        setVideoEffects({
          ...videoEffects,
          brightness: 140,
          contrast: 180,
          saturation: 250,
          hue: 240,
          blur: 1,
          scaleX: 110,
          scaleY: 110,
          rotate: 45,
          chromaticAberration: 25,
          pixelate: 8,
        });
        break;
      case 'timewarp':
        setVideoEffects({
          ...videoEffects,
          brightness: 110,
          contrast: 130,
          saturation: 120,
          hue: 30,
          blur: 3,
          sepia: 40,
          scaleX: 95,
          scaleY: 105,
          rotate: -15,
          glitchIntensity: 35,
        });
        break;
    }
  };

  return (
    <div className="space-y-3 p-3 max-h-[600px] overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="h-4 w-4" />
          <h3 className="font-medium text-sm">Effects (1-8)</h3>
        </div>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => {
            // Simple emergency mix - generate quick queue
            console.log('Emergency Mix triggered!');
          }}
          className="h-6 px-2 text-xs flex items-center space-x-1 bg-red-600/10 hover:bg-red-600/20 border-red-500/20"
          title="Generate Emergency Mix"
          data-testid="button-emergency-mix"
        >
          <span>⚡</span>
          <span>MIX</span>
        </Button>
      </div>
      
      {/* Ultra-Compact Quick Presets */}
      <div className="space-y-1">
        <div className="grid grid-cols-4 gap-1">
          <ScaleTransition hoverScale={1.1} tapScale={0.9}><Button size="sm" variant="outline" onClick={() => applyPreset('cyberpunk')} title="Cyberpunk" className="h-6 text-xs p-1">1</Button></ScaleTransition>
          <ScaleTransition hoverScale={1.1} tapScale={0.9}><Button size="sm" variant="outline" onClick={() => applyPreset('vintage')} title="Vintage" className="h-6 text-xs p-1">2</Button></ScaleTransition>
          <ScaleTransition hoverScale={1.1} tapScale={0.9}><Button size="sm" variant="outline" onClick={() => applyPreset('glitch')} title="Glitch" className="h-6 text-xs p-1">3</Button></ScaleTransition>
          <ScaleTransition hoverScale={1.1} tapScale={0.9}><Button size="sm" variant="outline" onClick={() => applyPreset('noir')} title="Film Noir" className="h-6 text-xs p-1">4</Button></ScaleTransition>
        </div>
        
        <div className="grid grid-cols-4 gap-1">
          <ScaleTransition hoverScale={1.1} tapScale={0.9}><Button size="sm" variant="outline" onClick={() => applyPreset('vortex')} title="Video Vortex" className="h-6 text-xs p-1">5</Button></ScaleTransition>
          <ScaleTransition hoverScale={1.1} tapScale={0.9}><Button size="sm" variant="outline" onClick={() => applyPreset('portal')} title="Demonic Portal" className="h-6 text-xs p-1">6</Button></ScaleTransition>
          <ScaleTransition hoverScale={1.1} tapScale={0.9}><Button size="sm" variant="outline" onClick={() => applyPreset('fractal')} title="Fractal Storm" className="h-6 text-xs p-1">7</Button></ScaleTransition>
          <ScaleTransition hoverScale={1.1} tapScale={0.9}><Button size="sm" variant="outline" onClick={() => applyPreset('timewarp')} title="Time Warp" className="h-6 text-xs p-1">8</Button></ScaleTransition>
        </div>
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

        {/* Live Video Mode */}
        <AccordionItem value="live-video">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center space-x-2">
              📹 <span>Live Video Mode</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <LiveVideoMode />
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

        {/* EDL Recording */}
        <AccordionItem value="edl-recording">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Record Set (EDL)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <EDLRecorder />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}