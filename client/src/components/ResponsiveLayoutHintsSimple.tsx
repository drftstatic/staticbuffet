import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useStore } from '@/lib/store';
import { useResponsiveLayout } from '@/hooks/use-responsive-layout';
import { Smartphone, Tablet, Monitor, X, RotateCcw, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export function ResponsiveLayoutHintsSimple() {
  const { brandSkin } = useStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { 
    currentLayout: actualLayout, 
    setManualLayout, 
    triggerLayoutAnimation,
    canResize,
    breakpoints
  } = useResponsiveLayout();
  const [currentLayout, setCurrentLayout] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [showHints, setShowHints] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Sync with actual layout changes
  useEffect(() => {
    if (actualLayout !== currentLayout) {
      setCurrentLayout(actualLayout);
      setIsVisible(true);
      // Auto-hide after 4 seconds
      setTimeout(() => setIsVisible(false), 4000);
    }
  }, [actualLayout, currentLayout]);

  // Manual layout switching functionality
  const switchToLayout = (layout: 'mobile' | 'tablet' | 'desktop') => {
    setManualLayout(layout);
    setCurrentLayout(layout);
    setPreviewMode(true);
    
    toast({
      title: `Switched to ${layout} layout`,
      description: `Interface adapted for ${layout} view`,
      duration: 2000,
    });

    // Auto-revert after 10 seconds
    setTimeout(() => {
      setPreviewMode(false);
      const actualWidth = window.innerWidth;
      const autoLayout = actualWidth < 768 ? 'mobile' : actualWidth < 1024 ? 'tablet' : 'desktop';
      setManualLayout(autoLayout);
    }, 10000);
  };

  // Reset to automatic detection
  const resetToAuto = () => {
    const width = window.innerWidth;
    const autoLayout = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
    setManualLayout(autoLayout);
    setCurrentLayout(autoLayout);
    setPreviewMode(false);
    
    toast({
      title: "Layout reset to automatic",
      description: "Responding to actual screen size",
      duration: 2000,
    });
  };

  const layoutConfig = {
    mobile: {
      icon: Smartphone,
      title: 'Mobile View',
      description: 'Single column, touch-optimized',
      features: ['Touch controls', 'Stacked panels', 'Full-width layout'],
      breakpoint: '< 768px'
    },
    tablet: {
      icon: Tablet,
      title: 'Tablet View', 
      description: 'Adaptive dual-column layout',
      features: ['Side navigation', 'Responsive panels', 'Medium density'],
      breakpoint: '768px - 1024px'
    },
    desktop: {
      icon: Monitor,
      title: 'Desktop View',
      description: 'Full workspace with resizable panels',
      features: ['Drag to resize', 'Multi-column', 'High density'],
      breakpoint: '> 1024px'
    }
  };

  const currentConfig = layoutConfig[currentLayout];
  const IconComponent = currentConfig.icon;

  // Show button when not visible
  if (!showHints && !isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowHints(true)}
        className="fixed bottom-4 right-4 z-50 bg-white/90 hover:bg-white text-gray-800 border-2 shadow-lg backdrop-blur-sm flex items-center"
        data-testid="button-show-layout-hints"
      >
        <Monitor size={16} className="mr-2" />
        <span>Layout: {currentLayout}</span>
      </Button>
    );
  }

  // Show layout info when visible or manually opened
  if (showHints || isVisible) {
    return (
      <div 
        className="fixed bottom-4 right-4 z-50 bg-white/95 border-2 border-gray-300 rounded-xl shadow-xl backdrop-blur-md p-6 min-w-[320px] max-w-[400px] text-gray-800"
        data-testid="responsive-layout-hints"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <IconComponent size={24} className="text-blue-600" />
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {currentConfig.title}
              </h3>
              {previewMode && (
                <Badge variant="secondary" className="text-xs">
                  Preview Mode
                </Badge>
              )}
            </div>
          </div>
          {showHints && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHints(false)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              data-testid="button-hide-layout-hints"
            >
              <X size={16} />
            </Button>
          )}
        </div>

        {/* Description */}
        <p className="text-sm font-medium text-gray-700 mb-3">
          {currentConfig.description}
        </p>

        {/* Features */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-gray-600 mb-2">FEATURES:</div>
          <div className="flex flex-wrap gap-1">
            {currentConfig.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Interactive Layout Switcher */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-gray-600 mb-2">TRY OTHER LAYOUTS:</div>
          <div className="grid grid-cols-3 gap-2">
            {(['mobile', 'tablet', 'desktop'] as const).map((layout) => {
              const config = layoutConfig[layout];
              const Icon = config.icon;
              const isActive = currentLayout === layout;
              
              return (
                <Button
                  key={layout}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchToLayout(layout)}
                  className="flex flex-col items-center p-2 h-auto"
                  disabled={isActive}
                  data-testid={`button-switch-${layout}`}
                >
                  <Icon size={16} className="mb-1" />
                  <span className="text-xs capitalize">{layout}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Preview Mode Controls */}
        {previewMode && (
          <div className="mb-4 p-3 bg-blue-50/50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-700">
                <Eye size={14} className="inline mr-1" />
                Previewing {currentLayout} layout
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetToAuto}
                className="text-xs"
                data-testid="button-reset-layout"
              >
                <RotateCcw size={12} className="mr-1" />
                Reset
              </Button>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Auto-resets in 10 seconds
            </div>
          </div>
        )}

        {/* Screen size info */}
        <div className="text-sm text-gray-600 bg-gray-100/50 rounded-lg p-3 mb-3">
          <div className="flex justify-between items-center">
            <span><strong>Screen:</strong> {window.innerWidth}px</span>
            <span><strong>Breakpoint:</strong> {currentConfig.breakpoint}</span>
          </div>
        </div>

        {/* Layout specific hints */}
        {currentLayout === 'desktop' && (
          <div className="mb-3 text-sm text-blue-700 bg-blue-50/50 rounded-lg p-3">
            <Settings size={14} className="inline mr-1" />
            Drag panel edges to resize workspace
          </div>
        )}
        
        {currentLayout === 'tablet' && (
          <div className="mb-3 text-sm text-orange-700 bg-orange-50/50 rounded-lg p-3">
            <Tablet size={14} className="inline mr-1" />
            Panels adapt to available space
          </div>
        )}
        
        {currentLayout === 'mobile' && (
          <div className="mb-3 text-sm text-green-700 bg-green-50/50 rounded-lg p-3">
            <Smartphone size={14} className="inline mr-1" />
            Touch-optimized controls active
          </div>
        )}

        {/* Auto-hide timer for automatic display */}
        {isVisible && !showHints && (
          <div className="text-xs text-gray-500 text-center">
            Auto-hiding in a few seconds...
          </div>
        )}
      </div>
    );
  }

  return null;
}