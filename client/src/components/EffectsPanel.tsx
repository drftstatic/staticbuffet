import React, { useState } from 'react';
import { AdaptiveColorControls } from '@/components/AdaptiveColorControls';
import { TextGenerator } from '@/components/TextGenerator';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { 
  Palette, 
  Volume2, 
  Zap, 
  Eye,
  Waves,
  RotateCw,
  Contrast,
  Sun,
  FileText,
  Settings,
  Sliders,
  Film,
  Headphones,
  RefreshCw,
  Sparkles,
  Tv,
  Camera,
  Filter,
  Paintbrush,
  Type
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScaleTransition } from './AnimatedTransitions';

export function EffectsPanel() {
  const { videoEffects, setVideoEffects, resetVideoEffects, resetAudioEffects, brandSkin, searchResults, setQueueItems } = useStore();
  const { toast } = useToast();
  const [showTextGenerator, setShowTextGenerator] = useState(false);

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
    <div className="space-y-4 p-4 max-h-[600px] overflow-y-auto">
      {/* Header with Master Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 text-blue-500" />
        </div>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowTextGenerator(!showTextGenerator)}
            title="Toggle Text Generator"
            className={`h-7 px-2 text-xs transition-colors ${
              showTextGenerator 
                ? 'text-blue-600 bg-blue-50 border border-blue-200' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Type size={12} className="mr-1" />
            Text
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetVideoEffects}
            title="Reset Video Effects"
            className="h-7 w-7 p-0 text-gray-500 hover:text-red-500"
          >
            <RefreshCw size={12} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetAudioEffects}
            title="Reset Audio Effects"
            className="h-7 w-7 p-0 text-gray-500 hover:text-red-500"
          >
            <Headphones size={12} />
          </Button>
        </div>
      </div>
      
      {/* Text Generator Panel */}
      {showTextGenerator && (
        <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3">
          <TextGenerator />
        </div>
      )}
      
      {/* Professional Effect Presets */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="h-3 w-3 text-purple-500" />
          <Label className="text-xs font-medium text-gray-600">Quick Presets (1-8)</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <ScaleTransition hoverScale={1.02} tapScale={0.98}>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => applyPreset('cyberpunk')} 
              className="h-8 text-xs flex items-center gap-2 bg-cyan-50 hover:bg-cyan-100 border-cyan-200 text-cyan-800"
            >
              <Tv size={12} />
              Cyberpunk
            </Button>
          </ScaleTransition>
          
          <ScaleTransition hoverScale={1.02} tapScale={0.98}>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => applyPreset('vintage')} 
              className="h-8 text-xs flex items-center gap-2 bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800"
            >
              <Camera size={12} />
              Vintage
            </Button>
          </ScaleTransition>
          
          <ScaleTransition hoverScale={1.02} tapScale={0.98}>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => applyPreset('glitch')} 
              className="h-8 text-xs flex items-center gap-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-800"
            >
              <Zap size={12} />
              Glitch
            </Button>
          </ScaleTransition>
          
          <ScaleTransition hoverScale={1.02} tapScale={0.98}>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => applyPreset('noir')} 
              className="h-8 text-xs flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-800"
            >
              <Film size={12} />
              Film Noir
            </Button>
          </ScaleTransition>
          
          <ScaleTransition hoverScale={1.02} tapScale={0.98}>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => applyPreset('vortex')} 
              className="h-8 text-xs flex items-center gap-2 bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800"
            >
              <RotateCw size={12} />
              Vortex
            </Button>
          </ScaleTransition>
          
          <ScaleTransition hoverScale={1.02} tapScale={0.98}>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => applyPreset('portal')} 
              className="h-8 text-xs flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-800"
            >
              <Filter size={12} />
              Portal
            </Button>
          </ScaleTransition>
          
          <ScaleTransition hoverScale={1.02} tapScale={0.98}>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => applyPreset('fractal')} 
              className="h-8 text-xs flex items-center gap-2 bg-green-50 hover:bg-green-100 border-green-200 text-green-800"
            >
              <Sparkles size={12} />
              Fractal
            </Button>
          </ScaleTransition>
          
          <ScaleTransition hoverScale={1.02} tapScale={0.98}>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => applyPreset('timewarp')} 
              className="h-8 text-xs flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-800"
            >
              <Waves size={12} />
              TimeWarp
            </Button>
          </ScaleTransition>
        </div>
      </div>
      {/* Note: Audio and Video effects are now available as separate panels */}
      <div className="text-xs text-gray-500 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-3">
        <p className="mb-2">🎨 <strong>Video Effects</strong> and 🎵 <strong>Audio Effects</strong> are now available as separate panels!</p>
        <p>Use the toolbar buttons to open dedicated Video FX and Audio FX panels for more detailed control.</p>
      </div>
    </div>
  );
}