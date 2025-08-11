import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useStore } from '@/lib/store';
import { Smartphone, Tablet, Monitor, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ResponsiveLayoutHintsSimple() {
  const { brandSkin } = useStore();
  const isMobile = useIsMobile();
  const [currentLayout, setCurrentLayout] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [showHints, setShowHints] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Detect layout changes
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      let newLayout: 'mobile' | 'tablet' | 'desktop';
      
      if (width < 768) {
        newLayout = 'mobile';
      } else if (width < 1024) {
        newLayout = 'tablet';
      } else {
        newLayout = 'desktop';
      }

      if (newLayout !== currentLayout) {
        setCurrentLayout(newLayout);
        setIsVisible(true);
        // Auto-hide after 4 seconds
        setTimeout(() => setIsVisible(false), 4000);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [currentLayout]);

  const layoutConfig = {
    mobile: {
      icon: Smartphone,
      title: 'Mobile View',
      description: 'Single column layout'
    },
    tablet: {
      icon: Tablet,
      title: 'Tablet View',
      description: 'Dual column layout'
    },
    desktop: {
      icon: Monitor,
      title: 'Desktop View',
      description: 'Full multi-panel layout'
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
        className="fixed bottom-4 right-4 z-50 bg-white/90 hover:bg-white text-gray-800 border-2 shadow-lg backdrop-blur-sm"
        data-testid="button-show-layout-hints"
      >
        <Monitor size={16} className="mr-2" />
        Layout Info
      </Button>
    );
  }

  // Show layout info when visible or manually opened
  if (showHints || isVisible) {
    return (
      <div 
        className="fixed bottom-4 right-4 z-50 bg-white/95 border-2 border-gray-300 rounded-xl shadow-xl backdrop-blur-md p-6 min-w-[280px] text-gray-800"
        data-testid="responsive-layout-hints"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <IconComponent size={24} className="text-blue-600" />
            <h3 className="font-bold text-lg text-gray-900">
              {currentConfig.title}
            </h3>
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
        <p className="text-base font-medium text-gray-700 mb-4">
          {currentConfig.description}
        </p>

        {/* Screen size info */}
        <div className="text-sm text-gray-600 bg-gray-100/50 rounded-lg p-3">
          <strong>Current screen:</strong> {window.innerWidth}px wide
          <br />
          <strong>Breakpoint:</strong> {
            currentLayout === 'mobile' ? '< 768px' :
            currentLayout === 'tablet' ? '768px - 1024px' :
            '> 1024px'
          }
        </div>

        {/* Layout specific hints */}
        {currentLayout === 'desktop' && (
          <div className="mt-3 text-sm text-blue-700 bg-blue-50/50 rounded-lg p-3">
            💡 Drag panel edges to resize workspace
          </div>
        )}
        
        {currentLayout === 'tablet' && (
          <div className="mt-3 text-sm text-orange-700 bg-orange-50/50 rounded-lg p-3">
            💡 Panels adapt to available space
          </div>
        )}
        
        {currentLayout === 'mobile' && (
          <div className="mt-3 text-sm text-green-700 bg-green-50/50 rounded-lg p-3">
            💡 Touch-optimized controls active
          </div>
        )}

        {/* Auto-hide timer for automatic display */}
        {isVisible && !showHints && (
          <div className="mt-3 text-xs text-gray-500 text-center">
            Auto-hiding in a few seconds...
          </div>
        )}
      </div>
    );
  }

  return null;
}