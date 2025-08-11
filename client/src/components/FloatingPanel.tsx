import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Move, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PanelPosition, FloatingPanelStates, BrandSkin } from '@/lib/types';
import { getThemeClasses } from '@/lib/theme-utils';
import { FloatingPanelTransition, ScaleTransition } from './AnimatedTransitions';

interface FloatingPanelProps {
  id: keyof FloatingPanelStates;
  title: string;
  children: ReactNode;
  brandSkin: BrandSkin;
}

export function FloatingPanel({ id, title, children, brandSkin }: FloatingPanelProps) {
  const { 
    floatingPanelStates, 
    updatePanelPosition, 
    togglePanelLock, 
    bringPanelToFront 
  } = useStore();
  
  const panelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const position = floatingPanelStates[id];
  const themeClasses = getThemeClasses(brandSkin);

  // Handle mouse down on header for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (position.isLocked) return;
    
    e.preventDefault();
    bringPanelToFront(id);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Handle mouse down on resize handle
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (position.isLocked) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: position.width,
      height: position.height,
    });
  };

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - position.width, e.clientX - dragStart.x));
        const newY = Math.max(0, Math.min(window.innerHeight - position.height, e.clientY - dragStart.y));
        
        updatePanelPosition(id, { x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        
        const newWidth = Math.max(300, Math.min(window.innerWidth - position.x, resizeStart.width + deltaX));
        const newHeight = Math.max(200, Math.min(window.innerHeight - position.y, resizeStart.height + deltaY));
        
        updatePanelPosition(id, { width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, id, position, updatePanelPosition]);

  return (
    <FloatingPanelTransition isDragging={isDragging}>
      <div
        ref={panelRef}
        className={`fixed border rounded-lg shadow-2xl backdrop-blur-sm transition-shadow duration-200 ${
          position.isLocked 
            ? `${themeClasses.panelBg} border-green-500/50 shadow-green-500/20` 
            : `${themeClasses.panelBg} ${themeClasses.border} hover:shadow-2xl`
        } ${isDragging ? 'cursor-grabbing select-none' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          width: position.width,
          height: position.height,
          zIndex: position.zIndex,
        }}
        onClick={() => bringPanelToFront(id)}
        data-testid={`floating-panel-${id}`}
      >
      {/* Panel Header */}
      <div
        className={`flex items-center justify-between px-3 py-2 border-b cursor-move rounded-t-lg ${
          position.isLocked ? 'cursor-default' : 'cursor-grab'
        } ${themeClasses.border} ${themeClasses.headerBg}`}
        onMouseDown={handleMouseDown}
        data-testid={`panel-header-${id}`}
      >
        <div className="flex items-center space-x-2">
          <Move size={14} className={position.isLocked ? 'opacity-50' : themeClasses.accent} />
          <h3 className={`font-semibold text-sm ${themeClasses.text}`}>{title}</h3>
        </div>
        
        <div className="flex items-center space-x-1">
          <ScaleTransition hoverScale={1.1} tapScale={0.9}>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                togglePanelLock(id);
              }}
              className={`h-6 w-6 p-0 ${themeClasses.accent}`}
              data-testid={`button-lock-${id}`}
            >
              {position.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
            </Button>
          </ScaleTransition>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto p-3" style={{ height: position.height - 60 }}>
        {children}
      </div>

      {/* Resize Handle */}
      {!position.isLocked && (
        <div
          className={`absolute bottom-0 right-0 w-4 h-4 cursor-se-resize ${themeClasses.accent} opacity-50 hover:opacity-100`}
          onMouseDown={handleResizeMouseDown}
          style={{
            background: 'linear-gradient(-45deg, transparent 30%, currentColor 30%, currentColor 35%, transparent 35%, transparent 65%, currentColor 65%, currentColor 70%, transparent 70%)',
          }}
          data-testid={`resize-handle-${id}`}
        />
      )}
    </div>
    </FloatingPanelTransition>
  );
}