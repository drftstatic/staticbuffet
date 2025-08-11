import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Palette, Eye, Wand2 } from 'lucide-react';
import { useStore } from '@/lib/store';

export function AdaptiveColorControls() {
  const { 
    adaptiveColorsEnabled, 
    adaptiveIntensity, 
    currentVideoPalette,
    setAdaptiveColorsEnabled,
    setAdaptiveIntensity 
  } = useStore();

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center space-x-2">
        <Palette className="w-4 h-4 text-muted-foreground" />
        <Label className="text-sm font-medium">Adaptive Color Scheme</Label>
        {currentVideoPalette && (
          <Badge variant="secondary" className="text-xs">
            {currentVideoPalette.temperature}
          </Badge>
        )}
      </div>
      
      <div className="space-y-3">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="w-3 h-3 text-muted-foreground" />
            <Label htmlFor="adaptive-colors" className="text-xs">
              Auto Color Analysis
            </Label>
          </div>
          <Switch
            id="adaptive-colors"
            checked={adaptiveColorsEnabled}
            onCheckedChange={setAdaptiveColorsEnabled}
            data-testid="switch-adaptive-colors"
          />
        </div>

        {/* Intensity Control */}
        {adaptiveColorsEnabled && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wand2 className="w-3 h-3 text-muted-foreground" />
                <Label className="text-xs">Intensity</Label>
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round(adaptiveIntensity * 100)}%
              </span>
            </div>
            <Slider
              value={[adaptiveIntensity]}
              onValueChange={(value) => setAdaptiveIntensity(value[0])}
              max={1}
              min={0.1}
              step={0.1}
              className="w-full"
              data-testid="slider-adaptive-intensity"
            />
          </div>
        )}

        {/* Color Palette Preview */}
        {adaptiveColorsEnabled && currentVideoPalette && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Current Palette</Label>
            <div className="flex space-x-1">
              {Object.entries(currentVideoPalette.palette).slice(0, 6).map(([key, color]) => (
                <div
                  key={key}
                  className="w-4 h-4 rounded border border-border"
                  style={{ backgroundColor: color as string }}
                  title={`${key}: ${color}`}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Brightness: {Math.round(currentVideoPalette.brightness * 100)}%</div>
              <div>Temperature: {currentVideoPalette.temperature}</div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="text-xs text-muted-foreground">
          {adaptiveColorsEnabled 
            ? "Interface colors adapt to video content every 3 seconds"
            : "Static theme colors active"
          }
        </div>
      </div>
    </div>
  );
}