import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useStore } from '@/lib/store';
import { Smartphone, Tablet, Monitor, Grid3X3, Layers, ArrowLeftRight, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ResponsiveLayoutHintsProps {
  onLayoutChange?: (layout: 'mobile' | 'tablet' | 'desktop') => void;
}

export function ResponsiveLayoutHints({ onLayoutChange }: ResponsiveLayoutHintsProps) {
  const { brandSkin } = useStore();
  const isMobile = useIsMobile();
  const [currentLayout, setCurrentLayout] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [showHints, setShowHints] = useState(false);
  const [animationState, setAnimationState] = useState<'idle' | 'transitioning' | 'complete'>('idle');

  // Detect layout changes
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCurrentLayout('mobile');
      } else if (width < 1024) {
        setCurrentLayout('tablet');
      } else {
        setCurrentLayout('desktop');
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  // Trigger animation when layout changes
  useEffect(() => {
    if (currentLayout) {
      setAnimationState('transitioning');
      const timer = setTimeout(() => {
        setAnimationState('complete');
        onLayoutChange?.(currentLayout);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentLayout, onLayoutChange]);

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'testcard':
        return {
          bg: 'bg-blue-900/10 border-blue-400/30',
          text: 'text-blue-300',
          accent: 'text-blue-400',
          badge: 'bg-blue-400/20 text-blue-300 border-blue-400/50'
        };
      case 'waffle':
        return {
          bg: 'bg-amber-100/20 border-amber-400/30',
          text: 'text-amber-800',
          accent: 'text-amber-600',
          badge: 'bg-amber-100/50 text-amber-800 border-amber-400/50'
        };
      case 'ebn':
        return {
          bg: 'bg-lime-900/20 border-lime-400/30',
          text: 'text-lime-300',
          accent: 'text-lime-400',
          badge: 'bg-lime-400/20 text-lime-300 border-lime-400/50'
        };
      case 'ozzy':
        return {
          bg: 'bg-red-900/20 border-red-400/30',
          text: 'text-red-300',
          accent: 'text-red-400',
          badge: 'bg-red-400/20 text-red-300 border-red-400/50'
        };
      case 'hogan':
        return {
          bg: 'bg-yellow-900/20 border-yellow-400/30',
          text: 'text-yellow-300',
          accent: 'text-yellow-400',
          badge: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/50'
        };
      case 'dx':
        return {
          bg: 'bg-pink-900/20 border-pink-400/30',
          text: 'text-pink-300',
          accent: 'text-pink-400',
          badge: 'bg-pink-400/20 text-pink-300 border-pink-400/50'
        };
      case 'maxheadroom':
        return {
          bg: 'bg-green-900/20 border-green-400/30',
          text: 'text-green-300',
          accent: 'text-green-400',
          badge: 'bg-green-400/20 text-green-300 border-green-400/50'
        };
      case 'mario':
        return {
          bg: 'bg-red-900/20 border-yellow-400/30',
          text: 'text-yellow-300',
          accent: 'text-red-400',
          badge: 'bg-red-400/20 text-yellow-300 border-yellow-400/50'
        };
      case 'dakota':
        return {
          bg: 'bg-gray-800/20 border-gray-400/30',
          text: 'text-gray-300',
          accent: 'text-gray-400',
          badge: 'bg-gray-400/20 text-gray-300 border-gray-400/50'
        };
      case 'blondie':
        return {
          bg: 'bg-amber-900/20 border-amber-400/30',
          text: 'text-amber-300',
          accent: 'text-amber-400',
          badge: 'bg-amber-400/20 text-amber-300 border-amber-400/50'
        };
      default:
        return {
          bg: 'bg-blue-900/10 border-blue-400/30',
          text: 'text-blue-300',
          accent: 'text-blue-400',
          badge: 'bg-blue-400/20 text-blue-300 border-blue-400/50'
        };
    }
  };

  const theme = getThemeClasses();

  const layoutConfig = {
    mobile: {
      icon: Smartphone,
      title: 'Mobile Layout',
      description: 'Stacked panels, touch-optimized controls',
      features: ['Single column', 'Touch gestures', 'Simplified controls'],
      animations: 'animate-bounce'
    },
    tablet: {
      icon: Tablet,
      title: 'Tablet Layout',
      description: 'Hybrid view with collapsible panels',
      features: ['Dual column', 'Swipe navigation', 'Adaptive sizing'],
      animations: 'animate-pulse'
    },
    desktop: {
      icon: Monitor,
      title: 'Desktop Layout',
      description: 'Full multi-panel workspace',
      features: ['Resizable panels', 'Keyboard shortcuts', 'Multi-window'],
      animations: 'animate-fade-in'
    }
  };

  const currentConfig = layoutConfig[currentLayout];
  const IconComponent = currentConfig.icon;

  if (!showHints && animationState === 'idle') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowHints(true)}
        className={`fixed bottom-4 right-4 z-50 ${theme.text} hover:${theme.bg}`}
        data-testid="button-show-layout-hints"
      >
        <Grid3X3 size={16} className="mr-2" />
        Layout
      </Button>
    );
  }

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg border shadow-lg backdrop-blur-sm ${theme.bg} ${
        animationState === 'transitioning' ? 'animate-pulse scale-105' : 'animate-fade-in'
      }`}
      data-testid="responsive-layout-hints"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <IconComponent 
            size={20} 
            className={`${theme.accent} ${animationState === 'transitioning' ? currentConfig.animations : ''}`} 
          />
          <h3 className={`font-bold text-sm ${theme.text}`}>
            {currentConfig.title}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHints(false)}
          className={`${theme.text} hover:${theme.bg}`}
          data-testid="button-hide-layout-hints"
        >
          ×
        </Button>
      </div>

      {/* Current Layout Info */}
      <div className="space-y-3">
        <p className={`text-xs ${theme.text} opacity-80`}>
          {currentConfig.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-1">
          {currentConfig.features.map((feature, index) => (
            <Badge 
              key={index}
              variant="outline" 
              className={`text-xs ${theme.badge} ${
                animationState === 'transitioning' ? 'animate-bounce' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {feature}
            </Badge>
          ))}
        </div>

        {/* Layout Preview */}
        <div className="mt-3 p-2 rounded border border-dashed border-gray-400/30">
          <div className="flex items-center space-x-2 mb-2">
            <Layers size={14} className={theme.accent} />
            <span className={`text-xs ${theme.text}`}>Panel Layout</span>
          </div>
          
          <div className="grid gap-1" style={{
            gridTemplateColumns: currentLayout === 'mobile' ? '1fr' : 
                                currentLayout === 'tablet' ? '1fr 1fr' : '1fr 2fr 1fr'
          }}>
            {currentLayout === 'mobile' && (
              <>
                <div className={`h-4 ${theme.bg} rounded border`} />
                <div className={`h-6 ${theme.bg} rounded border`} />
                <div className={`h-4 ${theme.bg} rounded border`} />
              </>
            )}
            {currentLayout === 'tablet' && (
              <>
                <div className={`h-8 ${theme.bg} rounded border`} />
                <div className={`h-8 ${theme.bg} rounded border`} />
              </>
            )}
            {currentLayout === 'desktop' && (
              <>
                <div className={`h-6 ${theme.bg} rounded border`} />
                <div className={`h-6 ${theme.bg} rounded border`} />
                <div className={`h-6 ${theme.bg} rounded border`} />
              </>
            )}
          </div>
        </div>

        {/* Resize Hints */}
        {currentLayout === 'desktop' && (
          <div className="flex items-center space-x-2 text-xs opacity-70">
            <ArrowLeftRight size={12} className={theme.accent} />
            <span className={theme.text}>Drag panel edges to resize</span>
          </div>
        )}

        {currentLayout === 'tablet' && (
          <div className="flex items-center space-x-2 text-xs opacity-70">
            <ArrowUpDown size={12} className={theme.accent} />
            <span className={theme.text}>Swipe to navigate panels</span>
          </div>
        )}

        {/* Animation State Indicator */}
        {animationState === 'transitioning' && (
          <div className="flex items-center space-x-2 mt-2">
            <div className={`w-2 h-2 rounded-full ${theme.accent} animate-pulse`} />
            <span className={`text-xs ${theme.text} opacity-60`}>
              Adapting layout...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}