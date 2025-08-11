import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

export function Player() {
  const { 
    queueItems, 
    currentQueueIndex, 
    isPlaying, 
    setPlaying, 
    nextTrack, 
    previousTrack,
    setCurrentQueueIndex 
  } = useStore();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentItem = queueItems[currentQueueIndex];

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current && currentItem) {
      videoRef.current.src = currentItem.videoUrl;
      videoRef.current.load();
    }
  }, [currentItem]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      
      // Check for trim out point
      if (currentItem) {
        const trimOutSeconds = parseTimeToSeconds(currentItem.trimOut);
        if (time >= trimOutSeconds) {
          if (currentItem.loop) {
            const trimInSeconds = parseTimeToSeconds(currentItem.trimIn);
            videoRef.current.currentTime = trimInSeconds;
          } else {
            nextTrack();
          }
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && currentItem) {
      setDuration(videoRef.current.duration);
      const trimInSeconds = parseTimeToSeconds(currentItem.trimIn);
      videoRef.current.currentTime = trimInSeconds;
    }
  };

  const handlePlayPause = () => {
    setPlaying(!isPlaying);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const parseTimeToSeconds = (time: string): number => {
    const parts = time.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  if (queueItems.length === 0) {
    return null;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="mt-6 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-100 font-inter">
          Now Playing
        </span>
        <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Hidden Video Element */}
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
        className="hidden"
        data-testid="video-player"
      />

      {/* Current Track Info */}
      {currentItem && (
        <div className="mb-2">
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {currentItem.title}
          </p>
        </div>
      )}
      
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
          <div 
            className="bg-red-600 dark:bg-lime-500 h-1 rounded-full transition-all duration-100" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          size="sm"
          variant="ghost"
          onClick={previousTrack}
          disabled={queueItems.length <= 1}
          data-testid="button-previous"
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-lime-500"
        >
          <SkipBack size={16} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handlePlayPause}
          data-testid="button-play-pause"
          className="p-3 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-lime-500"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={nextTrack}
          disabled={queueItems.length <= 1}
          data-testid="button-next"
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-lime-500"
        >
          <SkipForward size={16} />
        </Button>
      </div>

      {/* Queue Navigation */}
      {queueItems.length > 1 && (
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {currentQueueIndex + 1} of {queueItems.length}
          </span>
        </div>
      )}
    </div>
  );
}
