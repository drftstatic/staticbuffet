import { useState } from 'react';
import { RotateCw, FlipHorizontal, FlipVertical, Maximize, Eye, EyeOff, RefreshCw, Grid3X3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/lib/store';
import { getThemeClasses } from '@/lib/theme-utils';

export function GeometryPanel() {
  const { brandSkin, videoEffects, setVideoEffects } = useStore();
  const themeClasses = getThemeClasses(brandSkin);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateEffect = (key: string, value: number | boolean) => {
    setVideoEffects({
      ...videoEffects,
      [key]: value
    });
  };

  const resetGeometry = () => {
    setVideoEffects({
      ...videoEffects,
      rotate: 0,
      scaleX: 100,
      scaleY: 100,
      skewX: 0,
      skewY: 0,
      translateX: 0,
      translateY: 0,
      flipHorizontal: false,
      flipVertical: false,
      invert: 0
    });
  };

  return (
    <div className="space-y-4 p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Grid3X3 className={`h-4 w-4 ${themeClasses.accent}`} />
          <span className={`text-sm font-medium ${themeClasses.text}`}>Geometry</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-6 w-6 p-0"
            title="Toggle advanced controls"
          >
            {showAdvanced ? <EyeOff size={14} /> : <Eye size={14} />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={resetGeometry}
            className="h-6 w-6 p-0"
            title="Reset all geometry"
          >
            <RefreshCw size={14} />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateEffect('flipHorizontal', !videoEffects.flipHorizontal)}
          className={`${videoEffects.flipHorizontal ? themeClasses.accentBg + ' text-white' : ''}`}
        >
          <FlipHorizontal size={14} className="mr-1" />
          Flip H
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => updateEffect('flipVertical', !videoEffects.flipVertical)}
          className={`${videoEffects.flipVertical ? themeClasses.accentBg + ' text-white' : ''}`}
        >
          <FlipVertical size={14} className="mr-1" />
          Flip V
        </Button>
      </div>

      {/* Rotation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`text-xs ${themeClasses.textSecondary}`}>Rotation</label>
          <span className={`text-xs font-mono ${themeClasses.text}`}>{videoEffects.rotate}°</span>
        </div>
        <Slider
          value={[videoEffects.rotate]}
          onValueChange={([value]) => updateEffect('rotate', value)}
          min={-180}
          max={180}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between gap-1">
          <Button size="sm" variant="ghost" onClick={() => updateEffect('rotate', -90)}>-90°</Button>
          <Button size="sm" variant="ghost" onClick={() => updateEffect('rotate', 0)}>0°</Button>
          <Button size="sm" variant="ghost" onClick={() => updateEffect('rotate', 90)}>90°</Button>
          <Button size="sm" variant="ghost" onClick={() => updateEffect('rotate', 180)}>180°</Button>
        </div>
      </div>

      {/* Scale */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={`text-xs ${themeClasses.textSecondary}`}>Scale X</label>
            <span className={`text-xs font-mono ${themeClasses.text}`}>{videoEffects.scaleX}%</span>
          </div>
          <Slider
            value={[videoEffects.scaleX]}
            onValueChange={([value]) => updateEffect('scaleX', value)}
            min={10}
            max={200}
            step={5}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={`text-xs ${themeClasses.textSecondary}`}>Scale Y</label>
            <span className={`text-xs font-mono ${themeClasses.text}`}>{videoEffects.scaleY}%</span>
          </div>
          <Slider
            value={[videoEffects.scaleY]}
            onValueChange={([value]) => updateEffect('scaleY', value)}
            min={10}
            max={200}
            step={5}
            className="w-full"
          />
        </div>
      </div>

      {/* Invert */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`text-xs ${themeClasses.textSecondary}`}>Invert</label>
          <span className={`text-xs font-mono ${themeClasses.text}`}>{Math.round(videoEffects.invert * 100)}%</span>
        </div>
        <Slider
          value={[videoEffects.invert * 100]}
          onValueChange={([value]) => updateEffect('invert', value / 100)}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Advanced Controls */}
      {showAdvanced && (
        <div className="space-y-3 pt-3 border-t border-gray-300 dark:border-gray-600">
          <h4 className={`text-xs font-semibold ${themeClasses.text} opacity-75`}>ADVANCED</h4>
          
          {/* Skew */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`text-xs ${themeClasses.textSecondary}`}>Skew X</label>
                <span className={`text-xs font-mono ${themeClasses.text}`}>{videoEffects.skewX || 0}°</span>
              </div>
              <Slider
                value={[videoEffects.skewX || 0]}
                onValueChange={([value]) => updateEffect('skewX', value)}
                min={-45}
                max={45}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`text-xs ${themeClasses.textSecondary}`}>Skew Y</label>
                <span className={`text-xs font-mono ${themeClasses.text}`}>{videoEffects.skewY || 0}°</span>
              </div>
              <Slider
                value={[videoEffects.skewY || 0]}
                onValueChange={([value]) => updateEffect('skewY', value)}
                min={-45}
                max={45}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Translate */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`text-xs ${themeClasses.textSecondary}`}>Translate X</label>
                <span className={`text-xs font-mono ${themeClasses.text}`}>{videoEffects.translateX || 0}px</span>
              </div>
              <Slider
                value={[videoEffects.translateX || 0]}
                onValueChange={([value]) => updateEffect('translateX', value)}
                min={-200}
                max={200}
                step={5}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`text-xs ${themeClasses.textSecondary}`}>Translate Y</label>
                <span className={`text-xs font-mono ${themeClasses.text}`}>{videoEffects.translateY || 0}px</span>
              </div>
              <Slider
                value={[videoEffects.translateY || 0]}
                onValueChange={([value]) => updateEffect('translateY', value)}
                min={-200}
                max={200}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}