import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { analyzeVideoFrame, applyAdaptivePalette, resetAdaptiveColors, type VideoColorData } from '@/lib/color-analysis';

export function useAdaptiveColors(videoRef: React.RefObject<HTMLVideoElement>) {
  const intervalRef = useRef<number>();
  const lastAnalysisRef = useRef<number>(0);
  
  const { 
    adaptiveColorsEnabled, 
    adaptiveIntensity, 
    setCurrentVideoPalette 
  } = useStore();

  const analyzeCurrentFrame = useCallback(() => {
    if (!videoRef.current || !adaptiveColorsEnabled) return;
    
    const video = videoRef.current;
    const now = Date.now();
    
    // Only analyze every 2 seconds to avoid performance issues
    if (now - lastAnalysisRef.current < 2000) return;
    lastAnalysisRef.current = now;
    
    // Only analyze if video is playing and has data
    if (video.paused || video.readyState < 2) return;
    
    try {
      const colorData = analyzeVideoFrame(video);
      if (colorData) {
        console.log('🎨 Video color analysis:', {
          dominantColors: colorData.dominantColors.slice(0, 3),
          brightness: Math.round(colorData.brightness * 100) + '%',
          temperature: colorData.temperature,
          palette: colorData.palette
        });
        
        // Apply the adaptive palette
        applyAdaptivePalette(colorData.palette, adaptiveIntensity);
        setCurrentVideoPalette(colorData);
      }
    } catch (error) {
      console.warn('Color analysis error:', error);
    }
  }, [videoRef, adaptiveColorsEnabled, adaptiveIntensity, setCurrentVideoPalette]);

  // Start/stop color analysis based on settings
  useEffect(() => {
    if (adaptiveColorsEnabled && videoRef.current) {
      // Start analysis interval
      intervalRef.current = window.setInterval(analyzeCurrentFrame, 3000);
      
      // Also analyze on video events
      const video = videoRef.current;
      video.addEventListener('play', analyzeCurrentFrame);
      video.addEventListener('timeupdate', analyzeCurrentFrame);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        video.removeEventListener('play', analyzeCurrentFrame);
        video.removeEventListener('timeupdate', analyzeCurrentFrame);
      };
    } else {
      // Reset colors when disabled
      resetAdaptiveColors();
      setCurrentVideoPalette(null);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    }
  }, [adaptiveColorsEnabled, analyzeCurrentFrame, setCurrentVideoPalette]);

  // Update intensity when it changes
  useEffect(() => {
    const currentPalette = useStore.getState().currentVideoPalette;
    if (adaptiveColorsEnabled && currentPalette) {
      applyAdaptivePalette(currentPalette.palette, adaptiveIntensity);
    }
  }, [adaptiveIntensity, adaptiveColorsEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      resetAdaptiveColors();
    };
  }, []);

  return {
    analyzeCurrentFrame,
    isAnalyzing: adaptiveColorsEnabled && !!intervalRef.current
  };
}