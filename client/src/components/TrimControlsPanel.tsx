import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Square, RotateCcw } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

export function TrimControlsPanel() {
  const { 
    queueItems, 
    currentQueueIndex, 
    updateQueueItem 
  } = useStore();
  
  const { toast } = useToast();
  const [trimInTime, setTrimInTime] = useState(0);
  const [trimOutTime, setTrimOutTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentVideo = queueItems[currentQueueIndex];

  // Helper functions for time conversion
  const timeToSeconds = (timeStr: string): number => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1]; // MM:SS
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
    }
    return 0;
  };

  const secondsToTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Update trim times when video changes
  useEffect(() => {
    if (currentVideo) {
      setTrimInTime(timeToSeconds(currentVideo.trimIn));
      setTrimOutTime(timeToSeconds(currentVideo.trimOut));
    }
  }, [currentVideo?.id]);

  // Get current time and duration from the video element
  useEffect(() => {
    const updateVideoInfo = () => {
      const video = document.querySelector('video') as HTMLVideoElement;
      if (video) {
        setCurrentTime(video.currentTime || 0);
        setDuration(video.duration || 0);
      }
    };

    const interval = setInterval(updateVideoInfo, 100);
    return () => clearInterval(interval);
  }, []);

  // Trim control functions
  const setTrimIn = () => {
    const newTrimIn = Math.min(currentTime, trimOutTime - 1);
    setTrimInTime(newTrimIn);
    if (currentVideo) {
      updateQueueItem(currentVideo.id, { trimIn: secondsToTime(newTrimIn) });
      toast({
        title: "Trim In Set",
        description: `In point set to ${secondsToTime(newTrimIn)}`,
      });
    }
  };

  const setTrimOut = () => {
    const newTrimOut = Math.max(currentTime, trimInTime + 1);
    setTrimOutTime(newTrimOut);
    if (currentVideo) {
      updateQueueItem(currentVideo.id, { trimOut: secondsToTime(newTrimOut) });
      toast({
        title: "Trim Out Set",
        description: `Out point set to ${secondsToTime(newTrimOut)}`,
      });
    }
  };

  const resetTrim = () => {
    setTrimInTime(0);
    setTrimOutTime(duration);
    if (currentVideo) {
      updateQueueItem(currentVideo.id, { 
        trimIn: '00:00', 
        trimOut: secondsToTime(duration) 
      });
      toast({
        title: "Trim Reset",
        description: "In/Out points reset to full duration",
      });
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentVideo) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p>No video loaded</p>
          <p className="text-sm">Select a video to use trim controls</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 space-y-3">
      {/* Progress Bar with Trim Markers */}
      <div className="relative">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          className="w-full"
          disabled
        />
        {/* In/Out Point Markers */}
        {duration > 0 && (
          <>
            <div 
              className="absolute top-0 w-1 h-6 bg-green-500 pointer-events-none"
              style={{ left: `${(trimInTime / duration) * 100}%` }}
              title={`In: ${secondsToTime(trimInTime)}`}
            />
            <div 
              className="absolute top-0 w-1 h-6 bg-red-500 pointer-events-none"
              style={{ left: `${(trimOutTime / duration) * 100}%` }}
              title={`Out: ${secondsToTime(trimOutTime)}`}
            />
          </>
        )}
      </div>
      
      {/* Time Display */}
      <div className="flex justify-between text-xs text-gray-600">
        <span className="text-green-600">{secondsToTime(trimInTime)}</span>
        <span className="text-gray-500">{formatTime(currentTime)}</span>
        <span className="text-red-600">{secondsToTime(trimOutTime)}</span>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={setTrimIn}
          className="bg-green-600 hover:bg-green-700 text-white"
          title="Set In Point (I)"
        >
          <Square className="h-4 w-4 mr-1" />
          Set In
        </Button>
        
        <Button
          onClick={setTrimOut}
          className="bg-red-600 hover:bg-red-700 text-white"
          title="Set Out Point (O)"
        >
          <Square className="h-4 w-4 mr-1" />
          Set Out
        </Button>
      </div>
      
      <Button
        onClick={resetTrim}
        variant="outline"
        className="w-full"
        title="Reset (Ctrl+R)"
      >
        <RotateCcw className="h-4 w-4 mr-1" />
        Reset
      </Button>

      {/* Trimmed Duration */}
      <div className="text-center text-sm font-medium">
        {secondsToTime(Math.max(0, trimOutTime - trimInTime))}
      </div>
    </div>
  );
}