import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic,
  Underline,
  Palette,
  Move,
  RotateCw,
  Zap,
  Play,
  Monitor
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScaleTransition } from './AnimatedTransitions';
import { useStore } from '@/lib/store';
import { type TextSettings } from '@/lib/types';
import { getThemeClasses } from '@/lib/theme-utils';

export function TextGenerator() {
  const { toast } = useToast();
  const { textOverlay, setTextOverlay, setTextOverlayVisible, brandSkin } = useStore();
  const themeClasses = getThemeClasses(brandSkin);
  
  // Clean up any potential interference on unmount
  useEffect(() => {
    return () => {
      // Ensure no focus issues remain
      if (document.activeElement && document.activeElement !== document.body) {
        (document.activeElement as HTMLElement).blur();
      }
    };
  }, []);
  
  // Initialize with default settings if no overlay exists
  const textSettings = textOverlay || {
    text: 'Sample Text',
    fontFamily: 'Arial',
    fontSize: 48,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    color: '#ffffff',
    backgroundColor: 'transparent',
    textAlign: 'center',
    positionX: 50,
    positionY: 50,
    rotation: 0,
    opacity: 100,
    strokeWidth: 0,
    strokeColor: '#000000',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowColor: '#000000',
    animation: 'none',
    animationDuration: 2,
  };

  const updateSetting = (key: keyof TextSettings, value: any) => {
    const updatedSettings = { ...textSettings, [key]: value };
    setTextOverlay(updatedSettings);
  };

  const applyPreset = (preset: string) => {
    let updatedSettings;
    switch (preset) {
      case 'title':
        updatedSettings = {
          ...textSettings,
          text: 'MAIN TITLE',
          fontSize: 72,
          fontWeight: 'bold',
          color: '#ffffff',
          strokeWidth: 2,
          strokeColor: '#000000',
          shadowOffsetY: 4,
          shadowBlur: 8,
          shadowColor: '#000000',
          textAlign: 'center',
          positionY: 25,
        };
        break;
      case 'subtitle':
        updatedSettings = {
          ...textSettings,
          text: 'Subtitle text here',
          fontSize: 24,
          fontWeight: 'normal',
          color: '#ffffff',
          backgroundColor: 'rgba(0,0,0,0.7)',
          textAlign: 'center',
          positionY: 85,
        };
        break;
      case 'credits':
        updatedSettings = {
          ...textSettings,
          text: 'Credits roll text',
          fontSize: 32,
          fontWeight: 'normal',
          color: '#ffffff',
          textAlign: 'center',
          positionY: 50,
          animation: 'scroll-up',
        };
        break;
      case 'lower-third':
        updatedSettings = {
          ...textSettings,
          text: 'Name Title',
          fontSize: 28,
          fontWeight: 'bold',
          color: '#ffffff',
          backgroundColor: 'rgba(0,100,200,0.8)',
          textAlign: 'left',
          positionX: 10,
          positionY: 75,
        };
        break;
      default:
        return;
    }
    setTextOverlay(updatedSettings);
  };

  const generateTextCSS = (): React.CSSProperties => {
    return {
      fontFamily: textSettings.fontFamily,
      fontSize: `${textSettings.fontSize}px`,
      fontWeight: textSettings.fontWeight as any,
      fontStyle: textSettings.fontStyle as any,
      textDecoration: textSettings.textDecoration as any,
      color: textSettings.color,
      backgroundColor: textSettings.backgroundColor,
      textAlign: textSettings.textAlign as any,
      position: 'absolute',
      left: `${textSettings.positionX}%`,
      top: `${textSettings.positionY}%`,
      transform: `translate(-50%, -50%) rotate(${textSettings.rotation}deg)`,
      opacity: textSettings.opacity / 100,
      WebkitTextStroke: textSettings.strokeWidth > 0 ? `${textSettings.strokeWidth}px ${textSettings.strokeColor}` : 'none',
      textShadow: textSettings.shadowBlur > 0 ? 
        `${textSettings.shadowOffsetX}px ${textSettings.shadowOffsetY}px ${textSettings.shadowBlur}px ${textSettings.shadowColor}` : 'none',
      padding: textSettings.backgroundColor !== 'transparent' ? '8px 16px' : '0',
      borderRadius: textSettings.backgroundColor !== 'transparent' ? '4px' : '0',
      whiteSpace: 'pre-wrap',
    };
  };


  const handleAddToProgram = () => {
    if (!textSettings.text.trim()) {
      toast({
        title: "No Text Content",
        description: "Please enter some text before adding to program output",
        variant: "destructive",
      });
      return;
    }

    console.log('🎯 TextGenerator: Adding text overlay to program output:', {
      text: textSettings.text,
      settings: textSettings
    });

    // Set the text overlay in the store and make it visible
    setTextOverlay(textSettings);
    setTextOverlayVisible(true);
    
    console.log('✅ TextGenerator: Text overlay state updated');
    
    toast({
      title: "Text Overlay Added",
      description: `"${textSettings.text}" is now live on program output`,
      variant: "default",
    });
  };

  return (
    <div className="space-y-3">
      {/* Live Preview - At Top */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Zap className={`h-3 w-3 ${themeClasses.accent}`} />
          <Label className={`text-xs font-medium ${themeClasses.textSecondary}`}>Live Preview</Label>
        </div>
        <div className={`relative ${themeClasses.bgSecondary} rounded-lg h-24 overflow-hidden border ${themeClasses.borderSecondary}`}>
          <div style={generateTextCSS()}>
            {textSettings.text}
          </div>
        </div>
      </div>

      {/* Text Input */}
      <div className="space-y-2">
        <Label className={`text-xs font-medium ${themeClasses.textSecondary}`}>Text Content</Label>
        <Textarea
          value={textSettings.text}
          onChange={(e) => updateSetting('text', e.target.value)}
          placeholder="Enter your text here..."
          className="min-h-[50px] text-sm"
        />
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-gray-600">Quick Presets</Label>
        <div className="grid grid-cols-4 gap-1">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => applyPreset('title')}
            className="h-7 text-xs px-2"
          >
            Title
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => applyPreset('subtitle')}
            className="h-7 text-xs px-2"
          >
            Subtitle
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => applyPreset('credits')}
            className="h-7 text-xs px-2"
          >
            Credits
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => applyPreset('lower-third')}
            className="h-7 text-xs px-2"
          >
            Lower
          </Button>
        </div>
      </div>

      {/* Typography - Compact */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-600">Font</Label>
          <Select value={textSettings.fontFamily} onValueChange={(value) => updateSetting('fontFamily', value)}>
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Impact">Impact</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-600">Size: {textSettings.fontSize}px</Label>
          <Slider
            value={[textSettings.fontSize]}
            onValueChange={([value]) => updateSetting('fontSize', value)}
            min={12}
            max={80}
            step={2}
            className="h-7"
          />
        </div>
      </div>

      {/* Style & Color - Compact */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-600">Style</Label>
          <div className="flex gap-1">
            <Button
              variant={textSettings.fontWeight === 'bold' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSetting('fontWeight', textSettings.fontWeight === 'bold' ? 'normal' : 'bold')}
              className="h-7 w-7 p-0"
            >
              <Bold size={10} />
            </Button>
            <Button
              variant={textSettings.fontStyle === 'italic' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSetting('fontStyle', textSettings.fontStyle === 'italic' ? 'normal' : 'italic')}
              className="h-7 w-7 p-0"
            >
              <Italic size={10} />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-600">Color</Label>
          <Input
            type="color"
            value={textSettings.color}
            onChange={(e) => updateSetting('color', e.target.value)}
            className="h-7 w-full"
          />
        </div>
      </div>

      {/* Position - Compact */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-600">X: {textSettings.positionX}%</Label>
          <Slider
            value={[textSettings.positionX]}
            onValueChange={([value]) => updateSetting('positionX', value)}
            min={0}
            max={100}
            step={5}
            className="h-7"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-600">Y: {textSettings.positionY}%</Label>
          <Slider
            value={[textSettings.positionY]}
            onValueChange={([value]) => updateSetting('positionY', value)}
            min={0}
            max={100}
            step={5}
            className="h-7"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button 
          onClick={handleAddToProgram}
          className="bg-green-600 hover:bg-green-700 text-white"
          title="Add text overlay to program output"
        >
          <Monitor size={14} className="mr-2" />
          Add to Output
        </Button>
        
        <Button 
          onClick={() => {
            setTextOverlayVisible(false);
            toast({
              title: "Text Overlay Hidden",
              description: "Text overlay removed from program output",
            });
          }}
          variant="outline"
          className="border-red-300 text-red-600 hover:bg-red-50"
          title="Hide text overlay from program output"
        >
          <Monitor size={14} className="mr-2" />
          Clear Output
        </Button>
      </div>
    </div>
  );
}