import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';

export function EffectPresetNotification() {
  const [notification, setNotification] = useState<string | null>(null);
  const { videoEffects } = useStore();

  // Show notification when effects change due to preset
  useEffect(() => {
    // Simple heuristic to detect preset application
    const isPresetLike = (effects: any) => {
      return (
        (effects.hue === 180 && effects.scanlines && effects.chromaticAberration === 30) || // Cyberpunk
        (effects.sepia === 40 && effects.blur === 1 && effects.saturation === 80) || // Vintage
        (effects.glitchIntensity === 50 && effects.datamosh && effects.pixelate === 30) || // Glitch
        (effects.grayscale === 100 && effects.contrast === 150) // Noir
      );
    };

    if (isPresetLike(videoEffects)) {
      let presetName = '';
      if (videoEffects.hue === 180 && videoEffects.scanlines) presetName = 'Cyberpunk';
      else if (videoEffects.sepia === 40 && videoEffects.blur === 1) presetName = 'Vintage';
      else if (videoEffects.glitchIntensity === 50 && videoEffects.datamosh) presetName = 'Glitch';
      else if (videoEffects.grayscale === 100) presetName = 'Film Noir';

      if (presetName) {
        setNotification(presetName);
        setTimeout(() => setNotification(null), 2000);
      }
    }
  }, [videoEffects]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-right-2 duration-300">
      <div className="bg-black/80 text-white px-4 py-2 rounded-lg border border-lime-500/30 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">{notification} Applied</span>
        </div>
      </div>
    </div>
  );
}