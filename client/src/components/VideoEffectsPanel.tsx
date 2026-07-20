import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/lib/store';
import { 
  Eye,
  RefreshCw,
  Sun,
  Contrast,
  Filter,
  Zap,
  Paintbrush
} from 'lucide-react';

export function VideoEffectsPanel() {
  const { videoEffects, setVideoEffects } = useStore();

  const updateVideoEffect = (key: string, value: number | boolean) => {
    setVideoEffects({ ...videoEffects, [key]: value });
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
      intensity: 0,
      gamma: 100,
      exposure: 0,
      temperature: 0,
      tint: 0,
      vignette: 0,
      sharpen: 0,
      noise: 0,
      trails: 0,
      warp: 0,
    });
  };

  return (
    <div className="space-y-4 p-4 max-h-[600px] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-blue-500" />
          <span className="text-xs font-medium text-gray-600">Visual Pipeline</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetVideoEffects}
          title="Reset Video Effects"
          className="h-7 w-7 p-0 text-gray-500 hover:text-red-500"
        >
          <RefreshCw size={12} />
        </Button>
      </div>
      
      {/* Color Correction Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 mb-3">
          <Paintbrush className="h-3 w-3 text-green-500" />
          <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Color Correction</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Brightness</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.brightness}%</span>
            </div>
            <Slider
              value={[videoEffects.brightness]}
              onValueChange={([value]) => updateVideoEffect('brightness', value)}
              min={0}
              max={200}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Contrast</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.contrast}%</span>
            </div>
            <Slider
              value={[videoEffects.contrast]}
              onValueChange={([value]) => updateVideoEffect('contrast', value)}
              min={0}
              max={200}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Saturation</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.saturation}%</span>
            </div>
            <Slider
              value={[videoEffects.saturation]}
              onValueChange={([value]) => updateVideoEffect('saturation', value)}
              min={0}
              max={200}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Hue Shift</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.hue}°</span>
            </div>
            <Slider
              value={[videoEffects.hue]}
              onValueChange={([value]) => updateVideoEffect('hue', value)}
              min={-180}
              max={180}
              step={1}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Advanced Color Grading Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 mb-3">
          <Sun className="h-3 w-3 text-yellow-500" />
          <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Advanced Grading</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Gamma</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.gamma}%</span>
            </div>
            <Slider
              value={[videoEffects.gamma]}
              onValueChange={([value]) => updateVideoEffect('gamma', value)}
              min={10}
              max={300}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Exposure</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.exposure}</span>
            </div>
            <Slider
              value={[videoEffects.exposure]}
              onValueChange={([value]) => updateVideoEffect('exposure', value)}
              min={-100}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Temperature</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.temperature}K</span>
            </div>
            <Slider
              value={[videoEffects.temperature]}
              onValueChange={([value]) => updateVideoEffect('temperature', value)}
              min={-100}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Tint</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.tint}</span>
            </div>
            <Slider
              value={[videoEffects.tint]}
              onValueChange={([value]) => updateVideoEffect('tint', value)}
              min={-100}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Enhancement Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 mb-3">
          <Contrast className="h-3 w-3 text-red-500" />
          <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Enhancement</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Sharpen</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.sharpen}%</span>
            </div>
            <Slider
              value={[videoEffects.sharpen]}
              onValueChange={([value]) => updateVideoEffect('sharpen', value)}
              min={0}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Noise</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.noise}%</span>
            </div>
            <Slider
              value={[videoEffects.noise]}
              onValueChange={([value]) => updateVideoEffect('noise', value)}
              min={0}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Vignette</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.vignette}%</span>
            </div>
            <Slider
              value={[videoEffects.vignette]}
              onValueChange={([value]) => updateVideoEffect('vignette', value)}
              min={0}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Opacity</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.opacity}%</span>
            </div>
            <Slider
              value={[videoEffects.opacity]}
              onValueChange={([value]) => updateVideoEffect('opacity', value)}
              min={0}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Style & Filters Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="h-3 w-3 text-purple-500" />
          <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Style & Filters</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Blur</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.blur}px</span>
            </div>
            <Slider
              value={[videoEffects.blur]}
              onValueChange={([value]) => updateVideoEffect('blur', value)}
              min={0}
              max={10}
              step={0.1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Grayscale</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.grayscale}%</span>
            </div>
            <Slider
              value={[videoEffects.grayscale]}
              onValueChange={([value]) => updateVideoEffect('grayscale', value)}
              min={0}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Sepia</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.sepia}%</span>
            </div>
            <Slider
              value={[videoEffects.sepia]}
              onValueChange={([value]) => updateVideoEffect('sepia', value)}
              min={0}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Rotation</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.rotate}°</span>
            </div>
            <Slider
              value={[videoEffects.rotate]}
              onValueChange={([value]) => updateVideoEffect('rotate', value)}
              min={-180}
              max={180}
              step={1}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* VJ & Digital Effects Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <Zap className="h-3 w-3 text-orange-500" />
          <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">VJ & Digital Effects</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Glitch</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.glitchIntensity}%</span>
            </div>
            <Slider
              value={[videoEffects.glitchIntensity]}
              onValueChange={([value]) => updateVideoEffect('glitchIntensity', value)}
              min={0}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Chromatic</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.chromaticAberration}px</span>
            </div>
            <Slider
              value={[videoEffects.chromaticAberration]}
              onValueChange={([value]) => updateVideoEffect('chromaticAberration', value)}
              min={0}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Trails</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.trails}%</span>
            </div>
            <Slider
              value={[videoEffects.trails]}
              onValueChange={([value]) => updateVideoEffect('trails', value)}
              min={0}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Warp</Label>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{videoEffects.warp}%</span>
            </div>
            <Slider
              value={[videoEffects.warp]}
              onValueChange={([value]) => updateVideoEffect('warp', value)}
              min={0}
              max={100}
              step={1}
              className="mt-1"
            />
          </div>
        </div>

        {/* Toggle Effects */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <Label className="text-xs font-medium">Scanlines</Label>
            <Switch
              checked={videoEffects.scanlines}
              onCheckedChange={(checked) => updateVideoEffect('scanlines', checked)}
            />
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <Label className="text-xs font-medium">Datamosh</Label>
            <Switch
              checked={videoEffects.datamosh}
              onCheckedChange={(checked) => updateVideoEffect('datamosh', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}