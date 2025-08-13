/**
 * Color Analysis Utility for Adaptive Video Themes
 * Extracts dominant colors from video frames and generates adaptive color schemes
 */

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
}

export interface VideoColorData {
  dominantColors: string[];
  brightness: number;
  saturation: number;
  temperature: 'warm' | 'cool' | 'neutral';
  palette: ColorPalette;
}

/**
 * Analyzes a video frame to extract color information
 */
export function analyzeVideoFrame(video: HTMLVideoElement): VideoColorData | null {
  if (!video || video.readyState < 2) return null;

  try {
    // Create canvas to capture video frame
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size (reduced for performance)
    canvas.width = 160;
    canvas.height = 120;

    // Draw current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Analyze colors
    const colorMap = new Map<string, number>();
    let totalBrightness = 0;
    let totalSaturation = 0;
    let warmPixels = 0;
    let coolPixels = 0;

    // Sample every 4th pixel for performance
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a < 128) continue; // Skip transparent pixels

      // Calculate brightness (0-255)
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
      totalBrightness += brightness;

      // Calculate saturation
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      totalSaturation += saturation;

      // Determine temperature
      if (r > b + 20) warmPixels++;
      else if (b > r + 20) coolPixels++;

      // Quantize color for clustering (reduce to 16 levels per channel)
      const quantizedR = Math.floor(r / 16) * 16;
      const quantizedG = Math.floor(g / 16) * 16;
      const quantizedB = Math.floor(b / 16) * 16;
      const colorKey = `${quantizedR},${quantizedG},${quantizedB}`;

      colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
    }

    const pixelCount = data.length / 16;
    const avgBrightness = totalBrightness / pixelCount;
    const avgSaturation = totalSaturation / pixelCount;

    // Determine temperature
    const temperature = warmPixels > coolPixels + pixelCount * 0.1 ? 'warm' :
                       coolPixels > warmPixels + pixelCount * 0.1 ? 'cool' : 'neutral';

    // Get dominant colors (top 5)
    const sortedColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([color]) => {
        const [r, g, b] = color.split(',').map(Number);
        return `rgb(${r}, ${g}, ${b})`;
      });

    // Generate adaptive color palette
    const palette = generateAdaptivePalette(sortedColors, avgBrightness, avgSaturation, temperature);

    return {
      dominantColors: sortedColors,
      brightness: avgBrightness / 255,
      saturation: avgSaturation,
      temperature,
      palette
    };

  } catch (error) {
    console.warn('Color analysis failed:', error);
    return null;
  }
}

/**
 * Generates an adaptive color palette based on extracted colors
 */
function generateAdaptivePalette(
  dominantColors: string[], 
  brightness: number, 
  saturation: number, 
  temperature: 'warm' | 'cool' | 'neutral'
): ColorPalette {
  
  // Extract RGB values from dominant color
  const primaryRgb = extractRgb(dominantColors[0] || 'rgb(128, 128, 128)');
  const secondaryRgb = extractRgb(dominantColors[1] || dominantColors[0] || 'rgb(96, 96, 96)');

  // Generate HSL for easier manipulation
  const primaryHsl = rgbToHsl(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  const secondaryHsl = rgbToHsl(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);

  // Determine if we need light or dark theme
  const isDark = brightness < 0.4;
  
  // Generate palette
  const palette: ColorPalette = {
    primary: hslToHex(primaryHsl.h, Math.max(0.4, primaryHsl.s), isDark ? Math.max(0.5, primaryHsl.l) : Math.min(0.4, primaryHsl.l)),
    secondary: hslToHex(secondaryHsl.h, Math.max(0.3, secondaryHsl.s), isDark ? Math.max(0.4, secondaryHsl.l) : Math.min(0.5, secondaryHsl.l)),
    accent: hslToHex((primaryHsl.h + 30) % 360, Math.max(0.6, saturation), isDark ? 0.6 : 0.3),
    background: isDark ? '#0a0a0a' : '#fafafa',
    text: isDark ? '#f0f0f0' : '#1a1a1a',
    muted: isDark ? '#404040' : '#888888'
  };

  return palette;
}

/**
 * Helper functions for color conversion
 */
function extractRgb(rgbString: string): {r: number, g: number, b: number} {
  const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return {r: 128, g: 128, b: 128};
  return {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3])
  };
}

function rgbToHsl(r: number, g: number, b: number): {h: number, s: number, l: number} {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {h: h * 360, s, l};
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Smoothly transitions between color palettes
 */
export function interpolateColors(from: string, to: string, progress: number): string {
  const fromRgb = extractRgb(from.startsWith('#') ? hexToRgb(from) : from);
  const toRgb = extractRgb(to.startsWith('#') ? hexToRgb(to) : to);

  const r = Math.round(fromRgb.r + (toRgb.r - fromRgb.r) * progress);
  const g = Math.round(fromRgb.g + (toRgb.g - fromRgb.g) * progress);
  const b = Math.round(fromRgb.b + (toRgb.b - fromRgb.b) * progress);

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 'rgb(128, 128, 128)';
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Applies the adaptive color palette to CSS custom properties
 */
export function applyAdaptivePalette(palette: ColorPalette, intensity: number = 0.7): void {
  const root = document.documentElement;
  
  // Apply with intensity factor (0-1)
  root.style.setProperty('--adaptive-primary', palette.primary);
  root.style.setProperty('--adaptive-secondary', palette.secondary);
  root.style.setProperty('--adaptive-accent', palette.accent);
  root.style.setProperty('--adaptive-background', palette.background);
  root.style.setProperty('--adaptive-text', palette.text);
  root.style.setProperty('--adaptive-muted', palette.muted);
  root.style.setProperty('--adaptive-intensity', intensity.toString());
  
  // Add adaptive-colors class to enable CSS styling
  document.body.classList.add('adaptive-colors');
}

/**
 * Resets adaptive colors to default theme
 */
export function resetAdaptiveColors(): void {
  const root = document.documentElement;
  root.style.removeProperty('--adaptive-primary');
  root.style.removeProperty('--adaptive-secondary');
  root.style.removeProperty('--adaptive-accent');
  root.style.removeProperty('--adaptive-background');
  root.style.removeProperty('--adaptive-text');
  root.style.removeProperty('--adaptive-muted');
  root.style.removeProperty('--adaptive-intensity');
  
  // Remove adaptive-colors class to disable CSS styling
  document.body.classList.remove('adaptive-colors');
}