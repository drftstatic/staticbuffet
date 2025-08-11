import { useEffect, useState } from 'react';
import { useResponsiveLayout } from '@/hooks/use-responsive-layout';
import { useStore } from '@/lib/store';

interface LayoutAnimationWrapperProps {
  children: React.ReactNode;
  panelType?: 'search' | 'preview' | 'queue' | 'effects';
}

export function LayoutAnimationWrapper({ children, panelType }: LayoutAnimationWrapperProps) {
  const { currentLayout, isTransitioning } = useResponsiveLayout();
  const { brandSkin } = useStore();
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger re-animation when layout changes
  useEffect(() => {
    if (isTransitioning) {
      setAnimationKey(prev => prev + 1);
    }
  }, [isTransitioning, currentLayout]);

  const getAnimationClass = () => {
    if (!isTransitioning) return '';
    
    switch (currentLayout) {
      case 'mobile':
        return 'animate-fade-in';
      case 'tablet':
        return 'animate-slide-in-left';
      case 'desktop':
      default:
        return 'animate-scale-in';
    }
  };

  const getLayoutSpecificClass = () => {
    const base = 'transition-all duration-300';
    
    switch (currentLayout) {
      case 'mobile':
        return `${base} w-full mb-2`;
      case 'tablet':
        return `${base} ${panelType === 'search' ? 'w-1/3' : panelType === 'preview' ? 'flex-1' : 'w-1/4'}`;
      case 'desktop':
      default:
        return base;
    }
  };

  return (
    <div 
      key={animationKey}
      className={`${getLayoutSpecificClass()} ${getAnimationClass()}`}
      data-layout={currentLayout}
      data-panel={panelType}
    >
      {children}
    </div>
  );
}