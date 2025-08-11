import { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from './use-mobile';

export type LayoutMode = 'mobile' | 'tablet' | 'desktop';
export type PanelConfiguration = 'stacked' | 'sidebar' | 'multi-column';

interface LayoutBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

interface ResponsiveLayoutHook {
  currentLayout: LayoutMode;
  panelConfig: PanelConfiguration;
  isTransitioning: boolean;
  canResize: boolean;
  breakpoints: LayoutBreakpoints;
  triggerLayoutAnimation: () => void;
  setManualLayout: (layout: LayoutMode) => void;
}

const DEFAULT_BREAKPOINTS: LayoutBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200
};

export function useResponsiveLayout(): ResponsiveLayoutHook {
  const isMobile = useIsMobile();
  const [currentLayout, setCurrentLayout] = useState<LayoutMode>('desktop');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [manualOverride, setManualOverride] = useState<LayoutMode | null>(null);

  // Determine layout based on screen size
  const detectLayout = useCallback((): LayoutMode => {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < DEFAULT_BREAKPOINTS.mobile) return 'mobile';
    if (width < DEFAULT_BREAKPOINTS.tablet) return 'tablet';
    return 'desktop';
  }, []);

  // Get panel configuration based on layout
  const getPanelConfiguration = (layout: LayoutMode): PanelConfiguration => {
    switch (layout) {
      case 'mobile':
        return 'stacked';
      case 'tablet':
        return 'sidebar';
      case 'desktop':
      default:
        return 'multi-column';
    }
  };

  // Trigger layout transition animation
  const triggerLayoutAnimation = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 600);
  }, []);

  // Handle layout changes
  useEffect(() => {
    const handleResize = () => {
      const newLayout = detectLayout();
      if (newLayout !== currentLayout && !manualOverride) {
        setCurrentLayout(newLayout);
        triggerLayoutAnimation();
      }
    };

    // Initial layout detection
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentLayout, detectLayout, triggerLayoutAnimation, manualOverride]);

  // Clear manual override on significant screen size changes
  useEffect(() => {
    if (manualOverride) {
      const timer = setTimeout(() => {
        setManualOverride(null);
      }, 5000); // Clear override after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [manualOverride]);

  const setManualLayout = useCallback((layout: LayoutMode) => {
    setManualOverride(layout);
    setCurrentLayout(layout);
    triggerLayoutAnimation();
  }, [triggerLayoutAnimation]);

  return {
    currentLayout: manualOverride || currentLayout,
    panelConfig: getPanelConfiguration(manualOverride || currentLayout),
    isTransitioning,
    canResize: currentLayout === 'desktop',
    breakpoints: DEFAULT_BREAKPOINTS,
    triggerLayoutAnimation,
    setManualLayout
  };
}

// Animation variants for different layout transitions
export const layoutAnimations = {
  mobile: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  },
  tablet: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.4 }
  },
  desktop: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: { duration: 0.5 }
  }
};

// Helper hook for layout-specific styles
export function useLayoutStyles() {
  const { currentLayout, panelConfig } = useResponsiveLayout();

  const getContainerClasses = () => {
    switch (panelConfig) {
      case 'stacked':
        return 'flex flex-col space-y-2';
      case 'sidebar':
        return 'flex flex-row space-x-2 lg:space-x-4';
      case 'multi-column':
      default:
        return 'grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-4';
    }
  };

  const getPanelClasses = (panelType: 'search' | 'preview' | 'queue') => {
    const base = 'transition-all duration-300';
    
    switch (panelConfig) {
      case 'stacked':
        return `${base} w-full ${panelType === 'preview' ? 'order-1' : panelType === 'search' ? 'order-2' : 'order-3'}`;
      case 'sidebar':
        return `${base} ${panelType === 'search' ? 'w-1/3' : panelType === 'preview' ? 'flex-1' : 'w-1/4'}`;
      case 'multi-column':
      default:
        return `${base} ${panelType === 'preview' ? 'col-span-1 lg:col-span-1' : ''}`;
    }
  };

  return {
    currentLayout,
    panelConfig,
    getContainerClasses,
    getPanelClasses
  };
}