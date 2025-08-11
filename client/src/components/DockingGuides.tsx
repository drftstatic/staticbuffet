import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';

interface DockingGuidesProps {
  isDragging: boolean;
  dragPosition: { x: number; y: number } | null;
}

export function DockingGuides({ isDragging, dragPosition }: DockingGuidesProps) {
  const { brandSkin } = useStore();
  const [snapZones, setSnapZones] = useState<Array<{ x: number; y: number; width: number; height: number; type: string }>>([]);

  useEffect(() => {
    if (isDragging) {
      // Calculate snap zones based on current viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const headerHeight = 120; // Approximate header height
      
      const zones = [
        // Left third
        { x: 0, y: headerHeight, width: viewportWidth * 0.33, height: viewportHeight - headerHeight, type: 'left' },
        // Center third
        { x: viewportWidth * 0.33, y: headerHeight, width: viewportWidth * 0.34, height: viewportHeight - headerHeight, type: 'center' },
        // Right third
        { x: viewportWidth * 0.67, y: headerHeight, width: viewportWidth * 0.33, height: viewportHeight - headerHeight, type: 'right' },
        // Top half of center
        { x: viewportWidth * 0.25, y: headerHeight, width: viewportWidth * 0.5, height: (viewportHeight - headerHeight) * 0.5, type: 'top-center' },
        // Bottom half of center
        { x: viewportWidth * 0.25, y: headerHeight + (viewportHeight - headerHeight) * 0.5, width: viewportWidth * 0.5, height: (viewportHeight - headerHeight) * 0.5, type: 'bottom-center' },
      ];
      
      setSnapZones(zones);
    } else {
      setSnapZones([]);
    }
  }, [isDragging]);

  const getActiveZone = () => {
    if (!dragPosition || !isDragging) return null;
    
    return snapZones.find(zone => 
      dragPosition.x >= zone.x && 
      dragPosition.x <= zone.x + zone.width &&
      dragPosition.y >= zone.y && 
      dragPosition.y <= zone.y + zone.height
    );
  };

  const activeZone = getActiveZone();

  const guideColor = brandSkin === 'testcard' ? 'border-blue-400' :
    brandSkin === 'waffle' ? 'border-amber-400' :
    brandSkin === 'ebn' ? 'border-lime-400' :
    brandSkin === 'ozzy' ? 'border-red-400' :
    brandSkin === 'mario' ? 'border-red-400' :
    'border-yellow-400';

  const activeFillColor = brandSkin === 'testcard' ? 'bg-blue-400/20' :
    brandSkin === 'waffle' ? 'bg-amber-400/20' :
    brandSkin === 'ebn' ? 'bg-lime-400/20' :
    brandSkin === 'ozzy' ? 'bg-red-400/20' :
    brandSkin === 'mario' ? 'bg-red-400/20' :
    'bg-yellow-400/20';

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {snapZones.map((zone, index) => (
        <div
          key={index}
          className={`
            absolute transition-all duration-200 border-2 border-dashed
            ${zone === activeZone 
              ? `${guideColor} ${activeFillColor}` 
              : `${guideColor}/30`
            }
            ${zone === activeZone ? 'opacity-100' : 'opacity-50'}
          `}
          style={{
            left: zone.x,
            top: zone.y,
            width: zone.width,
            height: zone.height,
          }}
        >
          {/* Corner indicators */}
          <div className={`absolute top-2 left-2 w-4 h-4 border-2 ${guideColor}`} />
          <div className={`absolute top-2 right-2 w-4 h-4 border-2 ${guideColor}`} />
          <div className={`absolute bottom-2 left-2 w-4 h-4 border-2 ${guideColor}`} />
          <div className={`absolute bottom-2 right-2 w-4 h-4 border-2 ${guideColor}`} />
          
          {/* Center indicator */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border-2 ${guideColor} rounded-full ${activeFillColor}`}>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${guideColor.replace('border-', 'bg-')}`} />
          </div>
          
          {/* Zone type label */}
          <div className={`
            absolute top-4 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-mono uppercase tracking-wide
            ${brandSkin === 'testcard' ? 'text-blue-300' :
              brandSkin === 'waffle' ? 'text-amber-300' :
              brandSkin === 'ebn' ? 'text-lime-300' :
              brandSkin === 'ozzy' ? 'text-red-300' :
              brandSkin === 'mario' ? 'text-red-300' :
              'text-yellow-300'}
            ${zone === activeZone ? 'opacity-100' : 'opacity-60'}
          `}>
            {zone.type.toUpperCase()}
          </div>
        </div>
      ))}
      
      {/* Crosshair cursor indicator */}
      {dragPosition && (
        <div 
          className="absolute pointer-events-none z-60"
          style={{ 
            left: dragPosition.x - 10, 
            top: dragPosition.y - 10 
          }}
        >
          <div className={`w-5 h-5 border-2 ${guideColor} rounded-full ${activeFillColor} animate-pulse`}>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-0.5 ${guideColor.replace('border-', 'bg-')}`} />
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-2 ${guideColor.replace('border-', 'bg-')}`} />
          </div>
        </div>
      )}
    </div>
  );
}