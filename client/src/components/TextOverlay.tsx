import React from 'react';
import { type TextSettings } from '@/lib/types';

interface TextOverlayProps {
  textSettings: TextSettings | null;
  isVisible: boolean;
}

export function TextOverlay({ textSettings, isVisible }: TextOverlayProps) {
  if (!isVisible || !textSettings || !textSettings.text.trim()) {
    return null;
  }

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
      pointerEvents: 'none',
      zIndex: 10,
      userSelect: 'none',
      maxWidth: '80%',
      wordWrap: 'break-word',
    };
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    >
      <div style={generateTextCSS()}>
        {textSettings.text}
      </div>
    </div>
  );
}