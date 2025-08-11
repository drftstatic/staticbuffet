import { useState, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, RotateCcw, Play, Pause, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { useIsMobile } from '@/hooks/use-mobile';

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
    description: 'Full VJ workspace - Search, Preview, Queue, Effects all visible'
  },
  {
    name: 'Tablet',
    width: 768,
    icon: Tablet,
    description: 'Streamlined layout - Search + Preview with collapsible queue'
  },
  {
    name: 'Mobile',
    width: 375,
    icon: Smartphone,
    description: 'Touch-first stacked panels with swipe navigation'
  }
];

export function ResponsiveLayoutHints() {
  const { brandSkin } = useStore();
  const isMobile = useIsMobile();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showRealTime, setShowRealTime] = useState(false);

  // Auto-cycle through breakpoints when animating
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setCurrentBreakpoint((prev) => (prev + 1) % breakpoints.length);
    }, 2500); // Slightly slower for better visibility

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Add a pulsing effect during animation
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    if (isAnimating) {
      setIsPulsing(true);
      const pulse = setInterval(() => {
        setIsPulsing(prev => !prev);
      }, 1000);
      return () => clearInterval(pulse);
    } else {
      setIsPulsing(false);
    }
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

  // Real-time breakpoint detection for demonstration
  const getCurrentBreakpointIndex = () => {
    if (typeof window === 'undefined') return 0;
    const width = window.innerWidth;
    if (width < 768) return 2; // Mobile
    if (width < 1024) return 1; // Tablet
    return 0; // Desktop
  };

  if (!isVisible) {
    return (
      <Button
        onClick={toggleVisibility}
        variant="outline"
        size="sm"
        className="fixed bottom-20 left-4 z-50 bg-background/90 backdrop-blur-sm border-2 animate-pulse"
        style={{ borderColor: `var(--${brandSkin}-accent)` }}
        data-testid="button-show-layout-hints"
      >
        <Monitor className="w-4 h-4 mr-2" style={{ color: `var(--${brandSkin}-accent)` }} />
        Layout Hints
      </Button>
    );
  }

  const currentBreakpointData = breakpoints[currentBreakpoint];
  const IconComponent = currentBreakpointData.icon;

  return (
    <div 
      className="fixed bottom-4 left-4 z-50 bg-background/95 backdrop-blur-sm border-2 rounded-lg p-4 shadow-lg"
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
          className={`bg-muted rounded border-2 transition-all duration-1000 ease-in-out relative overflow-hidden ${
            isAnimating && isPulsing ? 'shadow-lg' : ''
          }`}
          style={{
            width: '100%',
            height: '80px',
            borderColor: isAnimating ? `var(--${brandSkin}-accent)` : 'transparent',
            boxShadow: isAnimating && isPulsing ? `0 0 20px var(--${brandSkin}-accent)30` : 'none'
          }}
        >
          {/* Simulated VJ interface elements */}
          <div 
            className="absolute inset-1 bg-background rounded transition-all duration-1000 ease-out"
            style={{
              transform: `scale(${Math.min(currentBreakpointData.width / 1024, 1)})`,
              transformOrigin: 'top left'
            }}
          >
            {/* Header with search controls */}
            <div className="flex items-center justify-between h-2 mb-1">
              <div 
                className="h-full rounded-sm flex-1"
                style={{ backgroundColor: `var(--${brandSkin}-accent)`, opacity: 0.9 }}
              />
              <div className="flex gap-1 ml-1">
                <div className="w-1 h-2 rounded-sm bg-yellow-400/70" />
                <div className="w-1 h-2 rounded-sm bg-red-400/70" />
              </div>
            </div>
            
            {/* Main workspace panels */}
            <div className="flex gap-1 h-10">
              {/* Search & Results panel */}
              <div 
                className="rounded-sm transition-all duration-1000 ease-out relative"
                style={{ 
                  backgroundColor: `var(--${brandSkin}-primary)`,
                  opacity: 0.7,
                  width: currentBreakpoint === 2 ? '100%' : '30%'
                }}
              >
                {/* Video thumbnails simulation */}
                <div className="absolute top-1 left-1 right-1 flex gap-0.5">
                  <div className="w-2 h-1 bg-white/50 rounded-sm" />
                  <div className="w-2 h-1 bg-white/50 rounded-sm" />
                  {currentBreakpoint !== 2 && <div className="w-2 h-1 bg-white/50 rounded-sm" />}
                </div>
              </div>
              
              {/* Video Player (hidden on mobile) */}
              {currentBreakpoint !== 2 && (
                <div 
                  className="rounded-sm transition-all duration-1000 ease-out relative"
                  style={{ 
                    backgroundColor: `var(--${brandSkin}-secondary)`,
                    opacity: 0.7,
                    width: currentBreakpoint === 1 ? '50%' : '40%'
                  }}
                >
                  {/* Play button simulation */}
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: `var(--${brandSkin}-accent)`, opacity: 0.8 }}
                  />
                  {/* Timeline */}
                  <div className="absolute bottom-1 left-1 right-1 h-0.5 bg-white/30 rounded" />
                </div>
              )}
              
              {/* Queue/Timeline panel (desktop only) */}
              {currentBreakpoint === 0 && (
                <div 
                  className="rounded-sm transition-all duration-1000 ease-out relative"
                  style={{ 
                    backgroundColor: `var(--${brandSkin}-accent)`,
                    opacity: 0.7,
                    width: '30%'
                  }}
                >
                  {/* Queue items simulation */}
                  <div className="absolute top-1 left-1 right-1 space-y-0.5">
                    <div className="h-0.5 bg-white/60 rounded" />
                    <div className="h-0.5 bg-white/40 rounded" />
                    <div className="h-0.5 bg-white/30 rounded" />
                  </div>
                </div>
              )}
            </div>
            
            {/* Effects panel (bottom row - mobile gets stacked) */}
            {currentBreakpoint === 2 ? (
              <div 
                className="mt-1 h-2 rounded-sm transition-all duration-1000"
                style={{ 
                  backgroundColor: `var(--${brandSkin}-secondary)`,
                  opacity: 0.5
                }}
              />
            ) : (
              <div className="mt-1 flex gap-1 h-2">
                <div 
                  className="rounded-sm flex-1 transition-all duration-1000"
                  style={{ 
                    backgroundColor: `var(--${brandSkin}-secondary)`,
                    opacity: 0.5
                  }}
                />
                {currentBreakpoint === 0 && (
                  <div 
                    className="rounded-sm w-8 transition-all duration-1000"
                    style={{ 
                      backgroundColor: `var(--${brandSkin}-primary)`,
                      opacity: 0.4
                    }}
                  />
                )}
              </div>
            )}
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

      {/* Enhanced Controls */}
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
          onClick={() => setShowRealTime(!showRealTime)}
          variant="outline"
          size="sm"
          title={showRealTime ? 'Hide real-time detection' : 'Show real-time detection'}
          data-testid="button-toggle-realtime"
        >
          {showRealTime ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

      {/* Additional info with enhanced status */}
      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <p className="text-muted-foreground">
            {isAnimating 
              ? `Auto-cycling every 2.5s (${currentBreakpoint + 1}/${breakpoints.length})` 
              : 'Manual control - Click icons or animate'
            }
          </p>
          {isAnimating && (
            <div className="flex space-x-1">
              {breakpoints.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentBreakpoint 
                      ? 'opacity-100 scale-125' 
                      : 'opacity-40 scale-100'
                  }`}
                  style={{ 
                    backgroundColor: index === currentBreakpoint 
                      ? `var(--${brandSkin}-accent)` 
                      : `var(--${brandSkin}-primary)`
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Real-time indicator or Pro tip */}
        {showRealTime ? (
          <div className="mt-2 p-2 rounded border" 
               style={{ 
                 borderColor: `var(--${brandSkin}-accent)`,
                 backgroundColor: `var(--${brandSkin}-primary)10`
               }}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Current Screen:</span>
              <div className="flex items-center gap-2">
                <div className="text-xs font-mono">
                  {typeof window !== 'undefined' ? window.innerWidth : 1024}px
                </div>
                <div className="flex items-center gap-1">
                  {(() => {
                    const realBreakpoint = getCurrentBreakpointIndex();
                    const RealIcon = breakpoints[realBreakpoint].icon;
                    return (
                      <>
                        <RealIcon className="w-3 h-3" style={{ color: `var(--${brandSkin}-accent)` }} />
                        <span style={{ color: `var(--${brandSkin}-accent)` }}>
                          {breakpoints[realBreakpoint].name}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground/70 mt-1 italic">
            💡 VJ interface automatically adapts to your screen size
          </p>
        )}
      </div>
    </div>
  );
}