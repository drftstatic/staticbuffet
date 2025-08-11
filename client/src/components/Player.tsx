import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useStore } from '@/lib/store';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export function Player() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { 
    queueItems, 
    currentQueueIndex, 
    setCurrentQueueIndex,
    nextTrack,
    previousTrack,
    isAudioReactive
  } = useStore();

  const currentVideo = queueItems[currentQueueIndex];

  useEffect(() => {
    if (videoRef.current && currentVideo) {
      videoRef.current.src = currentVideo.videoUrl;
      videoRef.current.load();
    }
  }, [currentVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', nextTrack);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', nextTrack);
    };
  }, [nextTrack]);

  // Audio-reactive visualization
  useEffect(() => {
    if (!isAudioReactive || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    let animationFrame: number;

    const drawVisualization = () => {
      if (!ctx || !video) return;

      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Add audio-reactive overlay (simplified - would need Web Audio API for real implementation)
      ctx.fillStyle = `rgba(0, 255, 0, ${Math.random() * 0.3})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrame = requestAnimationFrame(drawVisualization);
    };

    if (isPlaying) {
      drawVisualization();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isAudioReactive, isPlaying]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentVideo) {
    return (
      <div className="bg-black rounded-lg p-8 text-center text-gray-400">
        <p>No video in queue</p>
        <p className="text-sm mt-2">Add videos from search results to start mixing</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video Display */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          style={{ display: isAudioReactive ? 'none' : 'block' }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="w-full h-full object-contain"
          style={{ display: isAudioReactive ? 'block' : 'none' }}
        />
        
        {/* Video Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-semibold">{currentVideo.title}</h3>
          <p className="text-gray-300 text-sm">{currentVideo.creator}</p>
        </div>
      </div>

      {/* Progress Slider */}
      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousTrack}
            disabled={currentQueueIndex === 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button onClick={togglePlay} size="sm">
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextTrack}
            disabled={currentQueueIndex >= queueItems.length - 1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4" />
          <Slider
            value={volume}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-20"
          />
        </div>
      </div>

      {/* Track Info */}
      <div className="text-center text-sm text-gray-500">
        Track {currentQueueIndex + 1} of {queueItems.length}
      </div>
    </div>
  );
}