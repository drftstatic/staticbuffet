import { useStore } from '@/lib/store';
import { BeatMeter } from './BeatMeter';
import { Activity, HardDrive, Film, Settings, Tv, Layers, Monitor, Volume2 } from 'lucide-react';
import { getThemeClasses } from '@/lib/theme-utils';
import { useState, useEffect } from 'react';
export function StatusBar() {
    const { brandSkin, queueItems, searchResults, videoEffects, isPlaying } = useStore();
    const [fps, setFps] = useState(30);
    const [resolution, setResolution] = useState('1080p');
    const [audioLevel, setAudioLevel] = useState(0.6);
    // Simulate live data updates
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate FPS fluctuation (25-60 fps)
            setFps(Math.floor(25 + Math.random() * 35));
            // Simulate audio levels (VU meter bounce)
            setAudioLevel(0.2 + Math.random() * 0.6);
        }, 100);
        return () => clearInterval(interval);
    }, []);
    const themeClasses = getThemeClasses(brandSkin);
    // Get current FX status
    const fxActive = videoEffects.glitchIntensity > 0 ||
        videoEffects.chromaticAberration > 0 ||
        videoEffects.blur > 0 ||
        videoEffects.sepia > 0;
    return (<div className={`fixed bottom-0 left-0 right-0 h-6 ${themeClasses.bgSecondary} ${themeClasses.border} border-t z-50 flex items-center justify-between px-3 text-xs ${themeClasses.textSecondary}`} data-testid="status-bar">
      {/* Left Section - Content Stats */}
      <div className="flex items-center space-x-4">
        <BeatMeter />
        <div className="flex items-center space-x-1">
          <Film size={10}/>
          <span>{searchResults.length} results</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <HardDrive size={10}/>
          <span>{queueItems.length} queued</span>
        </div>
        
        {fxActive && (<div className="flex items-center space-x-1">
            <Settings size={10} className="text-purple-500"/>
            <span>FX ON</span>
          </div>)}
        
        {isPlaying && (<div className="flex items-center space-x-1">
            <Activity size={10} className="text-green-500 animate-pulse"/>
            <span>PLAYING</span>
          </div>)}
      </div>

      {/* Center Section - Theme Quotes */}
      <div className="flex items-center justify-center flex-1">
        <div className="flex items-center space-x-1">
          <Tv size={10} className={themeClasses.accent}/>
          <span className="font-mono text-xs">
            {'Commercial Entertainment Product'}
          </span>
          <Tv size={10} className={themeClasses.accent}/>
        </div>
      </div>

      {/* Right Section - Workspace Info */}
      <div className="flex items-center space-x-1">
        <Layers size={10}/>
      </div>
    </div>);
}
