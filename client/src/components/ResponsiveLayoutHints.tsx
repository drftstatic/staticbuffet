import { useState, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, RotateCcw, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

interface LayoutBreakpoint {
  name: string;
  width: number;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  description: string;
}

const breakpoints: LayoutBreakpoint[] = [
  {
    name: 'Desktop',
    width: 1024,
    icon: Monitor,
    description: 'Full workspace with all panels visible'
  },
  {
    name: 'Tablet',
    width: 768,
    icon: Tablet,
    description: 'Compact layout with collapsible panels'
  },
  {
    name: 'Mobile',
    width: 375,
    icon: Smartphone,
    description: 'Stacked layout optimized for touch'
  }
];

export function ResponsiveLayoutHints() {
  const { brandSkin } = useStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Auto-cycle through breakpoints when animating
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setCurrentBreakpoint((prev) => (prev + 1) % breakpoints.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const resetToDesktop = () => {
    setCurrentBreakpoint(0);
    setIsAnimating(false);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <Button
        onClick={toggleVisibility}
        variant="outline"
        size="sm"
        className="fixed bottom-20 right-4 z-50 bg-background/90 backdrop-blur-sm border-2"
        data-testid="button-show-layout-hints"
      >
        <Monitor className="w-4 h-4 mr-2" />
        Layout Hints
      </Button>
    );
  }

  const currentBreakpointData = breakpoints[currentBreakpoint];
  const IconComponent = currentBreakpointData.icon;

  return (
    <div 
      className="fixed bottom-4 right-4 z-50 bg-background/95 backdrop-blur-sm border-2 rounded-lg p-4 shadow-lg"
      style={{
        borderColor: `var(--${brandSkin}-accent)`,
        maxWidth: '320px'
      }}
      data-testid="layout-hints-panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconComponent className="w-5 h-5" style={{ color: `var(--${brandSkin}-accent)` }} />
          <h3 className="font-bold text-sm">Layout Hints</h3>
        </div>
        <Button
          onClick={toggleVisibility}
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          data-testid="button-hide-layout-hints"
        >
          ×
        </Button>
      </div>

      {/* Breakpoint Visualization */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{currentBreakpointData.name}</span>
          <span className="text-xs text-muted-foreground">{currentBreakpointData.width}px</span>
        </div>
        
        {/* Animated viewport representation */}
        <div 
          className="bg-muted rounded border-2 transition-all duration-1000 ease-in-out relative overflow-hidden"
          style={{
            width: '100%',
            height: '80px',
            borderColor: isAnimating ? `var(--${brandSkin}-accent)` : 'transparent'
          }}
        >
          {/* Simulated interface elements */}
          <div 
            className="absolute inset-1 bg-background rounded transition-all duration-1000"
            style={{
              transform: `scale(${currentBreakpointData.width / 1024})`,
              transformOrigin: 'top left'
            }}
          >
            {/* Header */}
            <div 
              className="h-3 rounded-sm mb-1"
              style={{ backgroundColor: `var(--${brandSkin}-accent)`, opacity: 0.8 }}
            />
            
            {/* Main content areas */}
            <div className="flex gap-1 h-12">
              {/* Search panel */}
              <div 
                className="rounded-sm transition-all duration-1000"
                style={{ 
                  backgroundColor: `var(--${brandSkin}-primary)`,
                  opacity: 0.6,
                  width: currentBreakpoint === 2 ? '100%' : '25%'
                }}
              />
              
              {/* Video player (hidden on mobile) */}
              {currentBreakpoint !== 2 && (
                <div 
                  className="rounded-sm transition-all duration-1000"
                  style={{ 
                    backgroundColor: `var(--${brandSkin}-secondary)`,
                    opacity: 0.6,
                    width: currentBreakpoint === 1 ? '60%' : '50%'
                  }}
                />
              )}
              
              {/* Queue panel (collapsed on tablet, hidden on mobile) */}
              {currentBreakpoint === 0 && (
                <div 
                  className="rounded-sm transition-all duration-1000"
                  style={{ 
                    backgroundColor: `var(--${brandSkin}-accent)`,
                    opacity: 0.6,
                    width: '25%'
                  }}
                />
              )}
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          {currentBreakpointData.description}
        </p>
      </div>

      {/* Breakpoint indicators */}
      <div className="flex justify-center gap-2 mb-4">
        {breakpoints.map((bp, index) => {
          const BpIcon = bp.icon;
          return (
            <button
              key={bp.name}
              onClick={() => {
                setCurrentBreakpoint(index);
                setIsAnimating(false);
              }}
              className={`p-2 rounded transition-colors ${
                index === currentBreakpoint 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
              data-testid={`button-breakpoint-${bp.name.toLowerCase()}`}
            >
              <BpIcon className="w-4 h-4" />
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button
          onClick={toggleAnimation}
          variant="outline"
          size="sm"
          className="flex-1"
          data-testid="button-toggle-animation"
        >
          {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isAnimating ? 'Pause' : 'Animate'}
        </Button>
        
        <Button
          onClick={resetToDesktop}
          variant="outline"
          size="sm"
          data-testid="button-reset-layout"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Additional info */}
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          {isAnimating 
            ? 'Showing responsive adaptations automatically' 
            : 'Click breakpoint icons or animate to see layout changes'
          }
        </p>
      </div>
    </div>
  );
}