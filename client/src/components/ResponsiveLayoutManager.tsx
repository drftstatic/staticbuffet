import { useEffect } from 'react';
import { useResponsiveLayout, type LayoutMode } from '@/hooks/use-responsive-layout';
import { useStore } from '@/lib/store';

interface ResponsiveLayoutManagerProps {
  children: React.ReactNode;
}

export function ResponsiveLayoutManager({ children }: ResponsiveLayoutManagerProps) {
  const { currentLayout, panelConfig, isTransitioning } = useResponsiveLayout();
  const { setResizableMode } = useStore();

  // Automatically adjust resizable mode based on layout
  useEffect(() => {
    if (currentLayout === 'mobile') {
      setResizableMode(false);
    } else if (currentLayout === 'tablet') {
      setResizableMode(false);
    } else {
      // Desktop - enable full resizable mode
      setResizableMode(true);
    }
  }, [currentLayout, setResizableMode]);

  return (
    <div 
      className={`transition-all duration-500 ${isTransitioning ? 'opacity-75' : 'opacity-100'}`}
      data-layout={currentLayout}
      data-panel-config={panelConfig}
    >
      {children}
    </div>
  );
}