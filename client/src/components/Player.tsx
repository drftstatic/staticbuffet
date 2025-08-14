import React, { useRef, useEffect, useState } from 'react';
import { useAdaptiveColors } from '@/hooks/use-adaptive-colors';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useStore } from '@/lib/store';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Minimize, Scissors, Square, RotateCcw } from 'lucide-react';
import { PopOutPlayer } from '@/components/PopOutPlayer';
import { videoPreloader } from '@/lib/video-preloader';
import { VideoPlayerSkeleton } from './SkeletonLoader';
import { useToast } from '@/hooks/use-toast';
import { TextOverlay } from '@/components/TextOverlay';

export function Player() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const bassNodeRef = useRef<BiquadFilterNode | null>(null);
  const midNodeRef = useRef<BiquadFilterNode | null>(null);
  const trebleNodeRef = useRef<BiquadFilterNode | null>(null);
  const distortionNodeRef = useRef<WaveShaperNode | null>(null);
  const reverbNodeRef = useRef<ConvolverNode | null>(null);
  const delayNodeRef = useRef<DelayNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoLoadError, setVideoLoadError] = useState(false);
  const [showTrimControls, setShowTrimControls] = useState(false);
  const [trimInTime, setTrimInTime] = useState(0);
  const [trimOutTime, setTrimOutTime] = useState(0);

  const { 
    queueItems, 
    currentQueueIndex, 
    setCurrentQueueIndex,
    nextTrack,
    previousTrack,
    isAudioReactive,
    timelineLoop,
    videoEffects,
    audioEffects,
    setVideoEffects,
    textOverlay,
    isTextOverlayVisible,
    setTextOverlayVisible,
    updateQueueItem,
    liveStream,
    getLiveStream
  } = useStore();

  const currentVideo = queueItems[currentQueueIndex];
  const { toast } = useToast();
  
  // Initialize adaptive colors
  const { analyzeCurrentFrame } = useAdaptiveColors(videoRef);

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

  useEffect(() => {
    if (videoRef.current && currentVideo) {
      console.log('🎬 Loading video:', {
        identifier: currentVideo.identifier,
        url: currentVideo.videoUrl,
        title: currentVideo.title
      });
      
      const video = videoRef.current;
      setIsVideoLoading(true);
      setVideoLoadError(false);
      
      // Special handling for live webcam streams
      if (currentVideo.videoUrl === 'live_webcam_stream') {
        console.log('📹 Loading live webcam stream');
        const stream = getLiveStream();
        
        if (stream) {
          console.log('✅ Found live stream, connecting to video element');
          video.srcObject = stream;
          video.volume = volume[0] / 100;
          video.muted = false;
          setIsVideoLoading(false);
        } else {
          console.warn('⚠️ No live stream available');
          setVideoLoadError(true);
          setIsVideoLoading(false);
        }
      } else {
        // Normal video file handling
        // Check if we have a preloaded video
        const preloadedVideo = videoPreloader.getPreloadedVideo(currentVideo.videoUrl);
        
        if (preloadedVideo) {
          console.log('🚀 Using preloaded video for smooth transition');
          // Copy properties from preloaded video
          video.src = preloadedVideo.src;
          video.currentTime = preloadedVideo.currentTime;
          video.volume = volume[0] / 100;
          video.muted = false;
          setIsVideoLoading(false);
        } else {
          // Reset video element
          video.src = '';
          video.srcObject = null; // Clear any existing stream
          video.load();
          
          // Set new source and properties
          console.log('🔗 Setting video src to:', currentVideo.videoUrl);
          video.src = currentVideo.videoUrl;
          video.volume = volume[0] / 100;
          video.muted = false;
          video.autoplay = false;
          video.preload = 'auto'; // Changed from 'metadata' to 'auto' for better loading
          video.crossOrigin = 'anonymous'; // Add CORS support
        }
      }
      
      // Preload next video in queue (skip for live streams)
      if (currentVideo.videoUrl !== 'live_webcam_stream') {
        videoPreloader.preloadNext(queueItems, currentQueueIndex);
      }
      
      // Add comprehensive event listeners for debugging
      const handleCanPlay = () => {
        console.log('✅ Video can play:', {
          duration: video.duration,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          readyState: video.readyState,
          currentSrc: video.currentSrc
        });
        setIsVideoLoading(false);
        setVideoLoadError(false);
      };
      
      const handleLoadedData = () => {
        console.log('📺 Video loaded:', {
          duration: video.duration,
          muted: video.muted,
          volume: video.volume,
          src: video.src
        });
      };
      
      const handleError = (e: any) => {
        console.error('❌ Video error:', {
          error: e,
          errorCode: video.error?.code,
          errorMessage: video.error?.message,
          networkState: video.networkState,
          readyState: video.readyState,
          src: video.src
        });
        
        setIsVideoLoading(false);
        setVideoLoadError(true);
        
        // Network state meanings:
        // 0 = NETWORK_EMPTY, 1 = NETWORK_IDLE, 2 = NETWORK_LOADING, 3 = NETWORK_NO_SOURCE
        if (video.networkState === 3) {
          console.error('❌ NETWORK_NO_SOURCE - Video source cannot be loaded');
        }
        
        // Error code meanings:
        // 1 = MEDIA_ERR_ABORTED, 2 = MEDIA_ERR_NETWORK, 3 = MEDIA_ERR_DECODE, 4 = MEDIA_ERR_SRC_NOT_SUPPORTED
        if (video.error?.code === 4) {
          console.error('❌ MEDIA_ERR_SRC_NOT_SUPPORTED - Browser cannot play this video format');
        }
        
        // Show toast notification for user feedback
        toast({
          title: "Video Load Error",
          description: `Failed to load video: ${video.error?.message || 'Unknown error'}`,
          variant: "destructive"
        });
      };
      
      const handleLoadStart = () => console.log('🔄 Video load started');
      const handleProgress = () => console.log('📊 Video loading progress...');
      const handleSuspend = () => console.log('⏸️ Video loading suspended');
      const handleStalled = () => console.log('🚫 Video loading stalled');
      const handleWaiting = () => console.log('⏳ Video waiting for data');
      const handleAbort = () => console.log('❌ Video loading aborted');
      const handleEmptied = () => console.log('🗑️ Video element emptied');
      
      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
      video.addEventListener('loadstart', handleLoadStart);
      video.addEventListener('progress', handleProgress);
      video.addEventListener('suspend', handleSuspend);
      video.addEventListener('stalled', handleStalled);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('abort', handleAbort);
      video.addEventListener('emptied', handleEmptied);
      
      // Load the video
      video.load();
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('progress', handleProgress);
        video.removeEventListener('suspend', handleSuspend);
        video.removeEventListener('stalled', handleStalled);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('abort', handleAbort);
        video.removeEventListener('emptied', handleEmptied);
      };
    }
  }, [currentVideo, liveStream, volume, getLiveStream]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    const handleEnded = () => {
      const currentItem = queueItems[currentQueueIndex];
      
      // Check if current clip should loop
      if (currentItem?.loop) {
        console.log('🔄 Looping current clip');
        video.currentTime = 0;
        video.play();
        return;
      }
      
      // Check if we're at the end and timeline loop is enabled
      if (currentQueueIndex === queueItems.length - 1 && timelineLoop) {
        console.log('🔄 Looping entire timeline');
        setCurrentQueueIndex(0);
        return;
      }
      
      // Normal progression to next track
      if (currentQueueIndex < queueItems.length - 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };
    
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    };
  }, [nextTrack, timelineLoop, queueItems, currentQueueIndex, setCurrentQueueIndex]);

  // Initialize audio context and effects chain
  const initializeAudioEffects = async () => {
    if (!videoRef.current || audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create audio nodes
      const sourceNode = audioContext.createMediaElementSource(videoRef.current);
      const gainNode = audioContext.createGain();
      const bassNode = audioContext.createBiquadFilter();
      const midNode = audioContext.createBiquadFilter();
      const trebleNode = audioContext.createBiquadFilter();
      const distortionNode = audioContext.createWaveShaper();
      const delayNode = audioContext.createDelay();
      
      // Configure EQ filters
      bassNode.type = 'lowshelf';
      bassNode.frequency.value = 320;
      bassNode.gain.value = 0;

      midNode.type = 'peaking';
      midNode.frequency.value = 1000;
      midNode.Q.value = 0.5;
      midNode.gain.value = 0;

      trebleNode.type = 'highshelf';
      trebleNode.frequency.value = 3200;
      trebleNode.gain.value = 0;

      // Configure distortion
      distortionNode.curve = createDistortionCurve(0);
      distortionNode.oversample = '4x';

      // Configure delay
      delayNode.delayTime.value = 0;

      // Connect audio chain
      sourceNode.connect(bassNode);
      bassNode.connect(midNode);
      midNode.connect(trebleNode);
      trebleNode.connect(distortionNode);
      distortionNode.connect(delayNode);
      delayNode.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Store references
      audioContextRef.current = audioContext;
      sourceNodeRef.current = sourceNode;
      gainNodeRef.current = gainNode;
      bassNodeRef.current = bassNode;
      midNodeRef.current = midNode;
      trebleNodeRef.current = trebleNode;
      distortionNodeRef.current = distortionNode;
      delayNodeRef.current = delayNode;

      console.log('Audio effects initialized successfully');
    } catch (error) {
      console.error('Audio effects initialization error:', error);
    }
  };

  // Create distortion curve
  const createDistortionCurve = (amount: number) => {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    
    return curve;
  };

  // Audio reactive visualization setup
  useEffect(() => {
    if (!isAudioReactive || !videoRef.current || !canvasRef.current) return;

    let analyser: AnalyserNode;
    let animationFrame: number;

    const setupAudioReactive = async () => {
      try {
        if (!audioContextRef.current) {
          await initializeAudioEffects();
        }

        if (!audioContextRef.current || !sourceNodeRef.current) return;

        analyser = audioContextRef.current.createAnalyser();
        sourceNodeRef.current.connect(analyser);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
          if (!isPlaying) {
            animationFrame = requestAnimationFrame(draw);
            return;
          }

          analyser.getByteFrequencyData(dataArray);
          
          // Apply audio-reactive effects to video
          const bass = dataArray.slice(0, 4).reduce((a, b) => a + b, 0) / 4;
          const mid = dataArray.slice(4, 16).reduce((a, b) => a + b, 0) / 12;
          const treble = dataArray.slice(16, 64).reduce((a, b) => a + b, 0) / 48;
          
          // Normalize values (0-1)
          const bassNorm = bass / 255;
          const midNorm = mid / 255;
          const trebleNorm = treble / 255;
          
          // Apply reactive effects (this could be enhanced further)
          if (videoRef.current) {
            const reactiveFilter = `brightness(${1 + bassNorm * 0.3}) saturate(${1 + midNorm * 0.5}) hue-rotate(${trebleNorm * 30}deg)`;
            videoRef.current.style.filter = reactiveFilter;
          }

          animationFrame = requestAnimationFrame(draw);
        };

        draw();
      } catch (error) {
        console.error('Audio reactive setup error:', error);
      }
    };

    if (isPlaying) {
      setupAudioReactive();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isAudioReactive, isPlaying]);

  // Update audio effects when settings change
  useEffect(() => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    try {
      // Update volume
      gainNodeRef.current.gain.value = volume[0] / 100;

      // Update EQ
      if (bassNodeRef.current) {
        bassNodeRef.current.gain.value = (audioEffects.bass - 50) * 0.3; // -15 to +15 dB
      }
      if (midNodeRef.current) {
        midNodeRef.current.gain.value = (audioEffects.mid - 50) * 0.3;
      }
      if (trebleNodeRef.current) {
        trebleNodeRef.current.gain.value = (audioEffects.treble - 50) * 0.3;
      }

      // Update distortion
      if (distortionNodeRef.current) {
        distortionNodeRef.current.curve = createDistortionCurve(audioEffects.distortion / 10);
      }

      // Update delay
      if (delayNodeRef.current) {
        delayNodeRef.current.delayTime.value = audioEffects.delay / 1000; // Convert ms to seconds
      }
    } catch (error) {
      console.error('Audio effects update error:', error);
    }
  }, [audioEffects, volume]);

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
      
      // Don't trigger shortcuts when user is typing in inputs, textareas, or contenteditable elements
      const target = e.target as HTMLElement;
      if (target && (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' ||
        target.contentEditable === 'true' ||
        target.closest('[contenteditable="true"]')
      )) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          toast({
            title: isPlaying ? "Video Paused" : "Video Playing",
            description: `${currentVideo.title}`,
          });
          break;
        case 'KeyF':
          e.preventDefault();
          const willEnterFullscreen = !isFullscreen;
          toggleFullscreen();
          toast({
            title: willEnterFullscreen ? "Entering Fullscreen" : "Exiting Fullscreen",
            description: "Press F again to toggle, or Esc to exit",
          });
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
        case 'Digit5':
          e.preventDefault();
          applyPreset('vortex');
          break;
        case 'Digit6':
          e.preventDefault();
          applyPreset('portal');
          break;
        case 'Digit7':
          e.preventDefault();
          applyPreset('fractal');
          break;
        case 'Digit8':
          e.preventDefault();
          applyPreset('timewarp');
          break;
        case 'KeyT':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setShowTrimControls(!showTrimControls);
            toast({
              title: showTrimControls ? "Trim Controls Hidden" : "Trim Controls Shown",
              description: showTrimControls ? "Trim controls panel closed" : "Trim controls panel opened",
            });
          }
          break;
        case 'KeyI':
          e.preventDefault();
          setTrimIn();
          break;
        case 'KeyO':
          e.preventDefault();
          setTrimOut();
          break;
        case 'KeyR':
          if (e.ctrlKey) {
            e.preventDefault();
            resetTrim();
          }
          break;
        case 'KeyP':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            // Trigger pop-out player (handled by PopOutPlayer component)
            const popOutButton = document.querySelector('[data-testid="button-pop-out-player"]') as HTMLButtonElement;
            if (popOutButton) {
              popOutButton.click();
            }
          }
          break;
      }
    };

    if (isFullscreen || currentVideo) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentVideo, isPlaying]);

  const togglePlay = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        // Ensure video is properly configured
        videoRef.current.volume = volume[0] / 100;
        videoRef.current.muted = false;
        
        console.log('Attempting to play video:', {
          src: videoRef.current.src,
          volume: videoRef.current.volume,
          muted: videoRef.current.muted,
          readyState: videoRef.current.readyState,
          networkState: videoRef.current.networkState,
          paused: videoRef.current.paused,
          currentTime: videoRef.current.currentTime,
          duration: videoRef.current.duration || 'unknown'
        });
        
        await videoRef.current.play();
        setIsPlaying(true);
        
        console.log('✓ Video started playing successfully');
        
        // Initialize audio effects after successful play (non-blocking)
        if (!audioContextRef.current) {
          initializeAudioEffects().catch(console.warn);
        }
        
      } catch (error: any) {
        console.error('❌ Play error:', error);
        
        // Common browser autoplay issues
        if (error.name === 'NotAllowedError') {
          console.log('Autoplay blocked - user interaction required');
        }
        
        // Try without audio effects first
        try {
          console.log('Retrying without audio effects...');
          await videoRef.current.play();
          setIsPlaying(true);
          console.log('✓ Video playing without audio effects');
        } catch (retryError) {
          console.error('❌ Retry failed:', retryError);
        }
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    const volumeLevel = value[0] / 100;
    
    if (videoRef.current) {
      videoRef.current.volume = volumeLevel;
      console.log('Volume set to:', volumeLevel);
    }
    
    // Update Web Audio API gain if available
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volumeLevel;
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
    if (!playerContainerRef.current) {
      console.warn('No player container reference for fullscreen');
      toast({
        title: "Fullscreen Failed", 
        description: "Player container not ready",
        variant: "destructive"
      });
      return;
    }

    try {
      if (!isFullscreen) {
        console.log('Requesting fullscreen...');
        await playerContainerRef.current.requestFullscreen();
      } else {
        console.log('Exiting fullscreen...');
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      toast({
        title: "Fullscreen Error", 
        description: error instanceof Error ? error.message : "Could not toggle fullscreen",
        variant: "destructive"
      });
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
      case 'vortex':
        setVideoEffects({
          ...videoEffects,
          rotate: 180,
          scaleX: 120,
          scaleY: 80,
          blur: 2,
          brightness: 130,
          contrast: 160,
          saturation: 200,
          hue: 120,
          chromaticAberration: 40,
          pixelate: 15,
        });
        break;
      case 'portal':
        setVideoEffects({
          ...videoEffects,
          brightness: 80,
          contrast: 200,
          saturation: 50,
          hue: -60,
          invert: 30,
          sepia: 20,
          chromaticAberration: 80,
          glitchIntensity: 60,
          scaleX: 150,
          scaleY: 150,
        });
        break;
      case 'fractal':
        setVideoEffects({
          ...videoEffects,
          brightness: 140,
          contrast: 180,
          saturation: 250,
          hue: 240,
          blur: 1,
          scaleX: 110,
          scaleY: 110,
          rotate: 45,
          chromaticAberration: 25,
          pixelate: 8,
        });
        break;
      case 'timewarp':
        setVideoEffects({
          ...videoEffects,
          brightness: 110,
          contrast: 130,
          saturation: 120,
          hue: 30,
          blur: 3,
          sepia: 40,
          scaleX: 95,
          scaleY: 105,
          rotate: -15,
          glitchIntensity: 35,
        });
        break;
    }
  };

  if (!currentVideo) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-gray-400">
        <div className="text-center space-y-4">
          <div className="text-[22px] text-[#9ca3af9e] font-bold">[ TRASH TEAM x NULLTONE.TV ]</div>
          <div>
            <p className="text-lg font-medium text-white">No video loaded</p>
            <p className="text-sm">Search and add videos to your queue to start playing</p>
            <p className="text-xs mt-2 text-gray-500">Queue has {queueItems.length} items, current index: {currentQueueIndex}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Video Display */}
      <div 
        ref={playerContainerRef}
        className={`relative bg-black overflow-hidden transition-all duration-300 ${
          isFullscreen 
            ? 'fixed inset-0 z-50 cursor-none' 
            : 'flex-1 w-full h-full min-h-0'
        }`}
        onDoubleClick={toggleFullscreen}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          controls={false}
          preload="metadata"
          playsInline
          style={{ 
            display: isAudioReactive ? 'none' : 'block',
            filter: generateFilterString(),
            transform: generateTransformString(),
            willChange: 'filter, transform',
            maxHeight: '100%',
            maxWidth: '100%'
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
        
        {/* Text Overlay */}
        <TextOverlay 
          textSettings={textOverlay}
          isVisible={isTextOverlayVisible}
        />
        
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

                {/* Trim Controls in Fullscreen */}
                {showTrimControls && currentVideo && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={setTrimIn}
                        className="text-green-400 hover:bg-green-500/20"
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Set In ({secondsToTime(trimInTime)})
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={setTrimOut}
                        className="text-red-400 hover:bg-red-500/20"
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Set Out ({secondsToTime(trimOutTime)})
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetTrim}
                        className="text-white hover:bg-white/20"
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                    </div>
                    <div className="text-center text-gray-300 text-sm">
                      Duration: {secondsToTime(Math.max(0, trimOutTime - trimInTime))}
                    </div>
                  </div>
                )}

                {/* Keyboard Shortcuts Hint */}
                <div className="text-center text-gray-400 text-sm">
                  F: fullscreen • Space: play/pause • ← →: seek • ↑ ↓: volume • ESC: exit • Ctrl+P: pop-out<br/>
                  1-8: effect presets • Ctrl+T: trim controls • I: set in • O: set out • Ctrl+R: reset trim<br/>
                  ?: shortcuts • bb: acid trip • etc: geometry • Ctrl+Shift+A: ASCII mode
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
              
              <div className="border-l border-gray-300 dark:border-gray-600 mx-2 h-6"></div>
              
              <PopOutPlayer currentVideo={currentVideo} />
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
          
          {/* Trim Controls */}
          {currentVideo && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Trim Controls</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTrimControls(!showTrimControls)}
                  title="Toggle trim controls"
                >
                  <Scissors className="h-4 w-4" />
                </Button>
              </div>
              
              {showTrimControls && (
                <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  {/* Trim Markers on Progress Bar */}
                  <div className="relative">
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={1}
                      onValueChange={handleSeek}
                      className="w-full"
                    />
                    {/* In/Out Point Markers */}
                    <div 
                      className="absolute top-0 w-1 h-6 bg-green-500 pointer-events-none"
                      style={{ left: `${(trimInTime / (duration || 100)) * 100}%` }}
                      title={`In: ${secondsToTime(trimInTime)}`}
                    />
                    <div 
                      className="absolute top-0 w-1 h-6 bg-red-500 pointer-events-none"
                      style={{ left: `${(trimOutTime / (duration || 100)) * 100}%` }}
                      title={`Out: ${secondsToTime(trimOutTime)}`}
                    />
                  </div>
                  
                  {/* Trim Time Display */}
                  <div className="flex justify-between text-xs text-gray-600">
                    <span className="text-green-600">In: {secondsToTime(trimInTime)}</span>
                    <span className="text-gray-500">Current: {formatTime(currentTime)}</span>
                    <span className="text-red-600">Out: {secondsToTime(trimOutTime)}</span>
                  </div>
                  
                  {/* Trim Control Buttons */}
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={setTrimIn}
                      className="text-green-600 border-green-300 hover:bg-green-50"
                      title="Set In Point at current time"
                    >
                      <Square className="h-3 w-3 mr-1" />
                      Set In
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={setTrimOut}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      title="Set Out Point at current time"
                    >
                      <Square className="h-3 w-3 mr-1" />
                      Set Out
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetTrim}
                      title="Reset to full duration"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Reset
                    </Button>
                  </div>
                  
                  {/* Trimmed Duration */}
                  <div className="text-center text-xs text-gray-500">
                    Trimmed duration: {secondsToTime(Math.max(0, trimOutTime - trimInTime))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Track Info */}
      <div className="text-center text-sm text-gray-500">
        Track {currentQueueIndex + 1} of {queueItems.length}
      </div>
    </div>
  );
}