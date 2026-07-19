import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { 
  Play, 
  Pause, 
  ArrowRight
} from 'lucide-react';

interface PreviewWindowProps {
  videoUrl?: string;
  video?: any;
  className?: string;
}

export function PreviewWindow({ videoUrl, video, className = '' }: PreviewWindowProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoLoadError, setVideoLoadError] = useState(false);

  const { 
    brandSkin,
    videoEffects,
    addToQueue
  } = useStore();

  // Check if this is static content (images, not videos)
  const isStaticImage = videoUrl?.endsWith('.svg') || videoUrl?.endsWith('.png') || videoUrl?.endsWith('.jpg') || videoUrl?.endsWith('.jpeg') || videoUrl?.endsWith('.gif');
  
  // Load video when URL changes (only for actual video content)
  useEffect(() => {
    if (videoRef.current && videoUrl && !isStaticImage) {
      console.log('🎬 PreviewWindow: Loading preview video:', {
        url: videoUrl.substring(0, 100) + '...',
        hasVideo: !!video,
        videoIdentifier: video?.identifier
      });
      setIsVideoLoading(true);
      setVideoLoadError(false);
      
      const videoEl = videoRef.current;
      
      const handleLoadStart = () => {
        setIsVideoLoading(true);
        setVideoLoadError(false);
      };

      const handleLoadedData = () => {
        setIsVideoLoading(false);
        setDuration(videoEl.duration || 0);
      };

      const handleError = (e: any) => {
        console.error('❌ PreviewWindow: Video load error:', {
          error: e,
          videoUrl: videoUrl?.substring(0, 100) + '...',
          errorCode: videoEl.error?.code,
          errorMessage: videoEl.error?.message,
          networkState: videoEl.networkState,
          readyState: videoEl.readyState
        });
        setIsVideoLoading(false);
        setVideoLoadError(true);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(videoEl.currentTime);
      };

      videoEl.addEventListener('loadstart', handleLoadStart);
      videoEl.addEventListener('loadeddata', handleLoadedData);
      videoEl.addEventListener('error', handleError);
      videoEl.addEventListener('timeupdate', handleTimeUpdate);
      
      videoEl.src = videoUrl;
      videoEl.load();

      return () => {
        videoEl.removeEventListener('loadstart', handleLoadStart);
        videoEl.removeEventListener('loadeddata', handleLoadedData);
        videoEl.removeEventListener('error', handleError);
        videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      };
    } else if (isStaticImage) {
      // For static content, immediately set as loaded
      setIsVideoLoading(false);
      setVideoLoadError(false);
      setDuration(0); // Static images have no duration
    }
  }, [videoUrl, isStaticImage]);

  // Apply volume changes (only for video content)
  useEffect(() => {
    if (videoRef.current && !isStaticImage) {
      videoRef.current.volume = 0.5; // Set default volume for preview
    }
  }, [isStaticImage]);

  const handlePlayPause = () => {
    // Static images can't be played/paused
    if (isStaticImage) return;
    
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


  const handleCueToProgram = () => {
    if (video && videoUrl) {
      console.log('🎯 Cueing video to program output:', video.identifier);
      addToQueue(video, videoUrl, true); // Add to front of queue
    }
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
      <div className={`relative rounded-lg overflow-hidden border ${getThemeClasses()}`}>
        {isVideoLoading ? (
          <div className="w-full h-32 flex items-center justify-center bg-black">
            <div className="text-white/60 text-xs">
              Loading preview...
              {video && <div className="text-xs mt-1 opacity-60">{video.title?.substring(0, 30)}...</div>}
            </div>
          </div>
        ) : videoLoadError || !videoUrl ? (
          <div className="w-full h-32 flex items-center justify-center bg-black/80 text-gray-400">
            <div className="text-center">
              <p className="text-xs">{videoLoadError ? 'Load failed' : 'No preview'}</p>
              {videoLoadError && videoUrl && (
                <p className="text-xs opacity-60 mt-1">Check console for details</p>
              )}
              {!videoUrl && video && (
                <p className="text-xs opacity-60 mt-1">{video.title?.substring(0, 30)}...</p>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Handle static images */}
            {isStaticImage ? (
              <div className="w-full h-32 bg-black flex items-center justify-center">
                <img 
                  src={videoUrl} 
                  alt="Static Preview" 
                  className="w-full h-full object-contain"
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
                />
              </div>
            ) : (
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
                  transform: `rotate(${videoEffects.rotate}deg) scaleX(${videoEffects.scaleX / 100}) scaleY(${videoEffects.scaleY / 100})`
                }}
                muted
                playsInline
                preload="metadata"
                crossOrigin="anonymous"
              />
            )}
            
            {/* Compact Controls Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center space-x-2">
                {/* Only show play/pause for video content */}
                {!isStaticImage && (
                  <Button
                    onClick={handlePlayPause}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20 bg-black/40"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </Button>
                )}
                
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

            {/* Progress Bar - only for video content with duration */}
            {duration > 0 && !isStaticImage && (
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