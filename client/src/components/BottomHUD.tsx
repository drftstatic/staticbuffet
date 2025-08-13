import { useStore } from '@/lib/store';
import { Monitor, Clock, Maximize2, Wifi, WifiOff, Smartphone, Router } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getThemeClasses } from '@/lib/theme-utils';

export function BottomHUD() {
  const { brandSkin } = useStore();
  const [fps, setFps] = useState(30);
  const [resolution, setResolution] = useState('1920x1080');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [connectionType, setConnectionType] = useState('unknown');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const themeClasses = getThemeClasses(brandSkin);

  // Real FPS monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }, []);

  // Real resolution monitoring
  useEffect(() => {
    const updateResolution = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setResolution(`${width}x${height}`);
    };

    // Initial resolution
    updateResolution();

    // Update on window resize
    window.addEventListener('resize', updateResolution);
    return () => window.removeEventListener('resize', updateResolution);
  }, []);

  // Real connection monitoring
  useEffect(() => {
    const updateConnection = () => {
      setIsOnline(navigator.onLine);
      
      // Get connection info if available
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;
      
      if (connection) {
        setConnectionType(connection.effectiveType || connection.type || 'unknown');
      }
    };

    // Initial connection check
    updateConnection();

    // Listen for online/offline events
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);
    
    // Listen for connection changes if supported
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateConnection);
    }

    return () => {
      window.removeEventListener('online', updateConnection);
      window.removeEventListener('offline', updateConnection);
      if (connection) {
        connection.removeEventListener('change', updateConnection);
      }
    };
  }, []);

  // Real-time clock
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  // Get connection icon based on type and status
  const getConnectionIcon = () => {
    if (!isOnline) return WifiOff;
    
    switch (connectionType) {
      case 'slow-2g':
      case '2g':
      case '3g':
        return Smartphone;
      case '4g':
      case '5g':
        return Smartphone;
      case 'wifi':
        return Wifi;
      default:
        return isOnline ? Wifi : WifiOff;
    }
  };

  const ConnectionIcon = getConnectionIcon();

  // Get theme-specific darker background for contrast
  const getPerformanceBarBg = () => {
    switch (brandSkin) {
      case 'ebn':
        return 'bg-gray-900';
      case 'waffle':
        return 'bg-yellow-900';
      case 'ozzy':
        return 'bg-red-900';
      case 'hogan':
        return 'bg-gray-900';
      case 'dx':
        return 'bg-gray-900';
      case 'mario':
        return 'bg-red-900';
      case 'dakota':
        return 'bg-gray-900';
      case 'blondie':
        return 'bg-amber-900';
      case 'testcard':
        return 'bg-slate-900';
      default:
        return 'bg-gray-900';
    }
  };

  return (
    <div 
      className={`fixed bottom-6 left-0 right-0 ${getPerformanceBarBg()} ${themeClasses.border} border-t z-40 h-8`}
      data-testid="bottom-hud"
    >
      {/* Scanlines overlay for EBN theme only */}
      {brandSkin === 'ebn' && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="w-full h-full opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(132, 204, 22, 0.03) 2px,
                rgba(132, 204, 22, 0.03) 4px
              )`
            }}
          />
        </div>
      )}

      {/* Performance indicators */}
      <div className={`flex items-center justify-between px-4 py-1 ${themeClasses.textSecondary} text-xs`}>
        <div className="flex items-center space-x-4">
          {/* FPS */}
          <div className="flex items-center space-x-1">
            <Monitor size={10} className={themeClasses.accent} />
            <span className="font-mono">{fps} FPS</span>
          </div>
          
          {/* Divider */}
          <div className={`h-3 w-px ${themeClasses.border}`} />
          
          {/* Resolution */}
          <div className="flex items-center space-x-1">
            <Maximize2 size={10} className={themeClasses.accent} />
            <span className="font-mono">{resolution}</span>
          </div>
        </div>
        
        {/* System Clock and Connection */}
        <div className="flex items-center space-x-3">
          {/* System Clock */}
          <div className="flex items-center space-x-1">
            <Clock size={10} className={themeClasses.accent} />
            <span className="font-mono text-xs">
              {formatTime(currentTime)}
            </span>
          </div>
          
          {/* Divider */}
          <div className={`h-3 w-px ${themeClasses.border}`} />
          
          {/* Connection */}
          <div className="flex items-center">
            <ConnectionIcon size={10} className={isOnline ? themeClasses.accent : 'text-red-500'} />
          </div>
        </div>
      </div>
    </div>
  );
}
