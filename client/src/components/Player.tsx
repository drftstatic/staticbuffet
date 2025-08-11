import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useStore } from '@/lib/store';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Minimize } from 'lucide-react';

export function Player() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { 
    queueItems, 
    currentQueueIndex, 
    setCurrentQueueIndex,
    nextTrack,
    previousTrack,
    isAudioReactive,
    videoEffects,
    audioEffects,
    setVideoEffects
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

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentVideo) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            exitFullscreen();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekRelative(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekRelative(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          adjustVolume(10);
          break;
        case 'ArrowDown':
          e.preventDefault();
          adjustVolume(-10);
          break;
        case 'Digit1':
          e.preventDefault();
          applyPreset('cyberpunk');
          break;
        case 'Digit2':
          e.preventDefault();
          applyPreset('vintage');
          break;
        case 'Digit3':
          e.preventDefault();
          applyPreset('glitch');
          break;
        case 'Digit4':
          e.preventDefault();
          applyPreset('noir');
          break;
      }
    };

    if (isFullscreen || currentVideo) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentVideo, isPlaying]);

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

  // Generate CSS filter string from video effects
  const generateFilterString = () => {
    const filters = [
      `brightness(${videoEffects.brightness}%)`,
      `contrast(${videoEffects.contrast}%)`,
      `saturate(${videoEffects.saturation}%)`,
      `hue-rotate(${videoEffects.hue}deg)`,
      `blur(${videoEffects.blur}px)`,
      `opacity(${videoEffects.opacity}%)`,
      `grayscale(${videoEffects.grayscale}%)`,
      `invert(${videoEffects.invert}%)`,
      `sepia(${videoEffects.sepia}%)`
    ];
    return filters.join(' ');
  };

  // Generate transform string from video effects
  const generateTransformString = () => {
    const transforms = [
      `rotate(${videoEffects.rotate}deg)`,
      `scaleX(${videoEffects.scaleX / 100})`,
      `scaleY(${videoEffects.scaleY / 100})`
    ];
    return transforms.join(' ');
  };

  const toggleFullscreen = async () => {
    if (!playerContainerRef.current) return;

    try {
      if (!isFullscreen) {
        await playerContainerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Exit fullscreen error:', error);
    }
  };

  const seekRelative = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const adjustVolume = (delta: number) => {
    const newVolume = Math.max(0, Math.min(100, volume[0] + delta));
    setVolume([newVolume]);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };

  // Preset effects for quick application
  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'cyberpunk':
        setVideoEffects({
          ...videoEffects,
          brightness: 120,
          contrast: 140,
          saturation: 150,
          hue: 180,
          chromaticAberration: 30,
          scanlines: true,
        });
        break;
      case 'vintage':
        setVideoEffects({
          ...videoEffects,
          brightness: 90,
          contrast: 110,
          saturation: 80,
          sepia: 40,
          blur: 1,
        });
        break;
      case 'glitch':
        setVideoEffects({
          ...videoEffects,
          glitchIntensity: 50,
          chromaticAberration: 60,
          datamosh: true,
          pixelate: 30,
        });
        break;
      case 'noir':
        setVideoEffects({
          ...videoEffects,
          grayscale: 100,
          contrast: 150,
          brightness: 80,
        });
        break;
    }
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
      <div 
        ref={playerContainerRef}
        className={`relative bg-black overflow-hidden transition-all duration-300 ${
          isFullscreen 
            ? 'fixed inset-0 z-50 cursor-none' 
            : 'rounded-lg aspect-video'
        }`}
        onDoubleClick={toggleFullscreen}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          style={{ 
            display: isAudioReactive ? 'none' : 'block',
            filter: generateFilterString(),
            transform: generateTransformString(),
            willChange: 'filter, transform'
          }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={360}
          className="w-full h-full object-contain"
          style={{ 
            display: isAudioReactive ? 'block' : 'none',
            filter: generateFilterString(),
            transform: generateTransformString()
          }}
        />
        
        {/* VJ Effects Overlays */}
        {videoEffects.scanlines && (
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 255, 0, 0.1) 2px,
                rgba(0, 255, 0, 0.1) 4px
              )`
            }}
          />
        )}
        
        {videoEffects.glitchIntensity > 0 && (
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-difference"
            style={{
              background: `linear-gradient(90deg, 
                rgba(255, 0, 0, ${videoEffects.glitchIntensity / 400}) 0%, 
                transparent 33%, 
                rgba(0, 255, 0, ${videoEffects.glitchIntensity / 400}) 66%, 
                transparent 100%
              )`,
              animation: videoEffects.glitchIntensity > 50 ? 'glitch 0.1s infinite' : 'none'
            }}
          />
        )}
        
        {videoEffects.chromaticAberration > 0 && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              mixBlendMode: 'screen',
              background: `radial-gradient(circle, 
                rgba(255, 0, 0, ${videoEffects.chromaticAberration / 300}) 0%, 
                transparent 50%, 
                rgba(0, 0, 255, ${videoEffects.chromaticAberration / 300}) 100%
              )`
            }}
          />
        )}
        
        {/* Fullscreen Controls Overlay */}
        {isFullscreen && (
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-default">
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-xl">{currentVideo.title}</h3>
                  <p className="text-gray-300">{currentVideo.creator}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exitFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Minimize className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="space-y-4">
                {/* Progress Slider */}
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-300">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={previousTrack}
                    disabled={currentQueueIndex === 0}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="h-8 w-8" />
                  </Button>
                  
                  <Button 
                    onClick={togglePlay} 
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 text-white"
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={nextTrack}
                    disabled={currentQueueIndex >= queueItems.length - 1}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="h-8 w-8" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center justify-center space-x-4">
                  <Volume2 className="h-6 w-6 text-white" />
                  <Slider
                    value={volume}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="w-48"
                  />
                  <span className="text-white text-sm w-12">{volume[0]}%</span>
                </div>

                {/* Keyboard Shortcuts Hint */}
                <div className="text-center text-gray-400 text-sm">
                  F: fullscreen • Space: play/pause • ← →: seek • ↑ ↓: volume • ESC: exit<br/>
                  1: Cyberpunk • 2: Vintage • 3: Glitch • 4: Film Noir
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Video Info Overlay (non-fullscreen) */}
        {!isFullscreen && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white font-semibold">{currentVideo.title}</h3>
            <p className="text-gray-300 text-sm">{currentVideo.creator}</p>
          </div>
        )}
      </div>

      {/* Regular Controls (non-fullscreen) */}
      {!isFullscreen && (
        <>
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

              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                title="Fullscreen (F)"
              >
                <Maximize className="h-4 w-4" />
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
        </>
      )}

      {/* Track Info */}
      <div className="text-center text-sm text-gray-500">
        Track {currentQueueIndex + 1} of {queueItems.length}
      </div>
    </div>
  );
}