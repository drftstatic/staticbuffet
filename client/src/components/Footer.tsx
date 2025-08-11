import { useEffect, useState, useRef } from 'react';
import { useStore } from '@/lib/store';

export function Footer() {
  const { brandSkin, queueItems, isPlaying } = useStore();
  const [fps, setFps] = useState(60);
  const [memoryInfo, setMemoryInfo] = useState<any>(null);
  const fpsCounterRef = useRef<{ frameCount: number; lastTime: number }>({
    frameCount: 0,
    lastTime: performance.now()
  });

  // FPS counter with more stable implementation
  useEffect(() => {
    let animationFrame: number;
    
    const updateFPS = () => {
      const now = performance.now();
      const delta = now - fpsCounterRef.current.lastTime;
      
      if (delta >= 1000) {
        setFps(Math.round((fpsCounterRef.current.frameCount * 1000) / delta));
        fpsCounterRef.current.frameCount = 0;
        fpsCounterRef.current.lastTime = now;
      } else {
        fpsCounterRef.current.frameCount++;
      }
      
      animationFrame = requestAnimationFrame(updateFPS);
    };
    
    animationFrame = requestAnimationFrame(updateFPS);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  // Memory info (if available)
  useEffect(() => {
    if ('memory' in performance) {
      setMemoryInfo((performance as any).memory);
    }
    
    const interval = setInterval(() => {
      if ('memory' in performance) {
        setMemoryInfo((performance as any).memory);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const buildInfo = {
    version: '0.1.0',
    build: '2025.01.11.001',
    engine: 'Static Buffet VJ Engine',
    audio: 'Web Audio API',
    video: 'HTML5 + CSS Filters'
  };

  return (
    <footer className={`border-t-2 px-4 py-2 font-mono text-xs ${
      brandSkin === 'waffle' 
        ? 'bg-yellow-50/80 border-yellow-400/50 text-amber-800' 
        : 'bg-purple-950/80 border-yellow-400/50 text-yellow-300'
    }`}>
      <div className="flex items-center justify-between">
        {/* Left side - Build info */}
        <div className="flex items-center space-x-4">
          <span className="font-bold">STATIC BUFFET v{buildInfo.version}</span>
          <span>BUILD {buildInfo.build}</span>
          <span>ENGINE: {buildInfo.engine}</span>
        </div>

        {/* Center - Performance metrics */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span>FPS:</span>
            <span className={`font-bold ${fps < 30 ? 'text-red-500' : fps < 50 ? 'text-yellow-500' : 'text-green-500'}`}>
              {fps}
            </span>
          </div>
          
          {memoryInfo && (
            <div className="flex items-center space-x-1">
              <span>RAM:</span>
              <span className="font-bold">
                {formatBytes(memoryInfo.usedJSHeapSize)}
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <span>QUEUE:</span>
            <span className="font-bold">{queueItems.length}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <span>STATUS:</span>
            <span className={`font-bold ${isPlaying ? 'text-green-500' : 'text-gray-500'}`}>
              {isPlaying ? 'PLAYING' : 'STOPPED'}
            </span>
          </div>
        </div>

        {/* Right side - Tech info */}
        <div className="flex items-center space-x-4">
          <span>AUDIO: {buildInfo.audio}</span>
          <span>VIDEO: {buildInfo.video}</span>
          <span className="text-xs opacity-70">
            Trash Team × Nulltone.TV
          </span>
        </div>
      </div>
    </footer>
  );
}