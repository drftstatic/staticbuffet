import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useStore } from '@/lib/store';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  RotateCcw, 
  Eye,
  Monitor,
  Maximize2,
  ArrowRight
} from 'lucide-react';
import { VideoPlayerSkeleton } from './SkeletonLoader';

interface PreviewWindowProps {
  videoUrl?: string;
  video?: any;
  className?: string;
}

export function PreviewWindow({ videoUrl, video, className = '' }: PreviewWindowProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoLoadError, setVideoLoadError] = useState(false);

  const { 
    brandSkin,
    videoEffects,
    audioEffects,
    queueItems,
    addToQueue
  } = useStore();

  // Load video when URL changes
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      console.log('🎬 Loading preview video:', videoUrl);
      setIsVideoLoading(true);
      setVideoLoadError(false);
      
      const video = videoRef.current;
      
      const handleLoadStart = () => {
        setIsVideoLoading(true);
        setVideoLoadError(false);
      };

      const handleLoadedData = () => {
        setIsVideoLoading(false);
        setDuration(video.duration || 0);
      };

      const handleError = (e: any) => {
        console.error('❌ Preview video load error:', e);
        setIsVideoLoading(false);
        setVideoLoadError(true);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };

      video.addEventListener('loadstart', handleLoadStart);
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
      video.addEventListener('timeupdate', handleTimeUpdate);
      
      video.src = videoUrl;
      video.load();

      return () => {
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [videoUrl]);

  // Apply volume changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      const newTime = (value[0] / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleCueToProgram = () => {
    if (video && videoUrl) {
      console.log('🎯 Cueing video to program output:', video.identifier);
      addToQueue(video, videoUrl, true); // Add to front of queue
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'testcard':
        return 'bg-slate-900/95 border-slate-600 text-slate-100';
      case 'waffle':
        return 'bg-yellow-900/95 border-yellow-600 text-yellow-100';
      case 'ebn':
        return 'bg-lime-900/95 border-lime-600 text-lime-100';
      default:
        return 'bg-gray-900/95 border-gray-600 text-gray-100';
    }
  };

  return (
    <div className={`${className}`}>
      {/* Compact Video Preview */}
      <div className={`relative rounded-lg overflow-hidden border ${getThemeClasses()}`}>
        {isVideoLoading ? (
          <div className="w-full h-32 flex items-center justify-center bg-black">
            <VideoPlayerSkeleton />
          </div>
        ) : videoLoadError || !videoUrl ? (
          <div className="w-full h-32 flex flex-col items-center justify-center bg-black/80 text-gray-400">
            <Eye size={24} className="mb-1 opacity-50" />
            <p className="text-xs">{videoLoadError ? 'Load failed' : 'No preview'}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-32 bg-black object-cover"
              style={{
                filter: `
                  brightness(${videoEffects.brightness}%) 
                  contrast(${videoEffects.contrast}%) 
                  saturate(${videoEffects.saturation}%) 
                  hue-rotate(${videoEffects.hue}deg) 
                  blur(${videoEffects.blur}px) 
                  opacity(${videoEffects.opacity}%) 
                  grayscale(${videoEffects.grayscale}%) 
                  invert(${videoEffects.invert}%) 
                  sepia(${videoEffects.sepia}%)
                `,
                transform: `rotate(${videoEffects.rotate}deg) scaleX(${videoEffects.scaleX}%) scaleY(${videoEffects.scaleY}%)`
              }}
              muted
              playsInline
            />
            
            {/* Compact Controls Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handlePlayPause}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-white hover:bg-white/20 bg-black/40"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </Button>
                
                {video && (
                  <Button
                    onClick={handleCueToProgram}
                    size="sm"
                    className="h-6 px-2 text-xs bg-green-600/80 hover:bg-green-600 text-white"
                  >
                    <ArrowRight size={10} className="mr-1" />
                    Cue
                  </Button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {duration > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                <div 
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}