import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useStore } from '@/lib/store';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

export function ResponsiveBreakpointIndicator() {
  const { brandSkin } = useStore();
  const isMobile = useIsMobile();
  const [currentBreakpoint, setCurrentBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      let newBreakpoint: 'mobile' | 'tablet' | 'desktop';
      
      if (width < 768) {
        newBreakpoint = 'mobile';
      } else if (width < 1024) {
        newBreakpoint = 'tablet';
      } else {
        newBreakpoint = 'desktop';
      }

      if (newBreakpoint !== currentBreakpoint) {
        setCurrentBreakpoint(newBreakpoint);
        setShowIndicator(true);
        
        // Hide indicator after 3 seconds
        setTimeout(() => setShowIndicator(false), 3000);
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, [currentBreakpoint]);

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

  if (!showIndicator) return null;

  return (
    <div 
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg border shadow-lg backdrop-blur-sm animate-fade-in ${getThemeClasses()}`}
      data-testid="responsive-breakpoint-indicator"
    >
      <div className="flex items-center space-x-2">
        <IconComponent size={16} />
        <span className="font-medium text-sm">{config.label}</span>
        <span className="text-xs opacity-70">({config.width})</span>
      </div>
    </div>
  );
}