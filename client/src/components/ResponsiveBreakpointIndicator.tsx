import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useResponsiveLayout } from '@/hooks/use-responsive-layout';
import { useStore } from '@/lib/store';
import { Smartphone, Tablet, Monitor, Settings, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function ResponsiveBreakpointIndicator() {
  const { brandSkin } = useStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { 
    currentLayout, 
    setManualLayout, 
    triggerLayoutAnimation,
    canResize,
    breakpoints
  } = useResponsiveLayout();
  const [currentBreakpoint, setCurrentBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [showIndicator, setShowIndicator] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);

  // Sync with responsive layout hook
  useEffect(() => {
    if (currentLayout !== currentBreakpoint) {
      setCurrentBreakpoint(currentLayout);
      setShowIndicator(true);
      
      // Hide indicator after 3 seconds
      setTimeout(() => setShowIndicator(false), 3000);
    }
  }, [currentLayout, currentBreakpoint]);

  // Manual layout switching functions
  const switchToLayout = (layout: 'mobile' | 'tablet' | 'desktop') => {
    setManualLayout(layout);
    setIsManualMode(true);
    
    toast({
      title: `Switched to ${layout} layout`,
      description: `Interface adapted for ${layout} view`,
      duration: 2000,
    });

    // Auto-revert after 8 seconds
    setTimeout(() => {
      setIsManualMode(false);
      const actualWidth = window.innerWidth;
      const autoLayout = actualWidth < 768 ? 'mobile' : actualWidth < 1024 ? 'tablet' : 'desktop';
      setManualLayout(autoLayout);
    }, 8000);
  };

  const resetToAuto = () => {
    const width = window.innerWidth;
    const autoLayout = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
    setManualLayout(autoLayout);
    setIsManualMode(false);
    
    toast({
      title: "Layout reset to automatic",
      description: "Now responding to actual screen size",
      duration: 2000,
    });
  };

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'testcard':
        return 'bg-blue-900/90 border-blue-400/50 text-blue-300';
      case 'waffle':
        return 'bg-amber-100/90 border-amber-400/50 text-amber-800';
      case 'ebn':
        return 'bg-lime-900/90 border-lime-400/50 text-lime-300';
      case 'ozzy':
        return 'bg-red-900/90 border-red-400/50 text-red-300';
      case 'hogan':
        return 'bg-yellow-900/90 border-yellow-400/50 text-yellow-300';
      case 'dx':
        return 'bg-pink-900/90 border-pink-400/50 text-pink-300';
      case 'maxheadroom':
        return 'bg-green-900/90 border-green-400/50 text-green-300';
      case 'mario':
        return 'bg-red-900/90 border-yellow-400/50 text-yellow-300';
      case 'dakota':
        return 'bg-gray-800/90 border-gray-400/50 text-gray-300';
      case 'blondie':
        return 'bg-amber-900/90 border-amber-400/50 text-amber-300';
      default:
        return 'bg-blue-900/90 border-blue-400/50 text-blue-300';
    }
  };

  const breakpointConfig = {
    mobile: {
      icon: Smartphone,
      label: 'Mobile',
      width: '< 768px'
    },
    tablet: {
      icon: Tablet,
      label: 'Tablet',
      width: '768px - 1024px'
    },
    desktop: {
      icon: Monitor,
      label: 'Desktop',
      width: '> 1024px'
    }
  };

  const config = breakpointConfig[currentBreakpoint];
  const IconComponent = config.icon;

  // Enhanced indicator display logic
  if (!showIndicator && !isManualMode) return null;

  return (
    <div 
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg border shadow-xl backdrop-blur-sm animate-fade-in ${getThemeClasses()} min-w-[320px]`}
      data-testid="responsive-breakpoint-indicator"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <IconComponent size={16} />
          <span className="font-medium text-sm">{config.label} Layout</span>
          {isManualMode && (
            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
              Manual
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs opacity-70">
            {window.innerWidth}px
          </span>
          {isManualMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToAuto}
              className="h-6 px-2 text-xs hover:bg-white/20"
              data-testid="button-reset-breakpoint"
            >
              <Settings size={12} className="mr-1" />
              Auto
            </Button>
          )}
        </div>
      </div>
      
      {/* Quick Layout Switcher */}
      <div className="flex items-center justify-center space-x-1 pt-2 border-t border-white/20">
        {(Object.keys(breakpointConfig) as Array<keyof typeof breakpointConfig>).map((layout) => {
          const layoutConfig = breakpointConfig[layout];
          const LayoutIcon = layoutConfig.icon;
          const isActive = currentBreakpoint === layout;
          return (
            <Button
              key={layout}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              onClick={() => switchToLayout(layout)}
              disabled={isActive}
              className="h-7 px-2 text-xs flex items-center hover:bg-white/20"
              data-testid={`button-quick-${layout}`}
            >
              <LayoutIcon size={12} />
              <span className="ml-1 capitalize">{layout}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}