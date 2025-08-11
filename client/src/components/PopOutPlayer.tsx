import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, X, Maximize2, Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { type QueueItem } from '@/lib/types';

interface PopOutPlayerProps {
  currentVideo?: QueueItem | null;
}

export function PopOutPlayer({ currentVideo }: PopOutPlayerProps) {
  const { brandSkin, queueItems, currentQueueIndex, isPlaying, setPlaying } = useStore();
  const { toast } = useToast();
  const [popOutWindow, setPopOutWindow] = useState<Window | null>(null);
  const [isPopOutOpen, setIsPopOutOpen] = useState(false);
  const windowCheckInterval = useRef<NodeJS.Timeout>();

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'testcard':
        return 'text-blue-400 hover:bg-blue-400/10';
      case 'waffle':
        return 'text-amber-800 hover:bg-yellow-100/50';
      case 'ebn':
        return 'text-lime-400 hover:bg-lime-900/50';
      case 'ozzy':
        return 'text-red-300 hover:bg-red-900/30';
      case 'hogan':
        return 'text-yellow-300 hover:bg-yellow-900/50';
      case 'dx':
        return 'text-pink-300 hover:bg-pink-900/50';
      case 'maxheadroom':
        return 'text-green-300 hover:bg-green-900/50';
      case 'mario':
        return 'text-yellow-300 hover:bg-red-900/50';
      case 'dakota':
        return 'text-gray-300 hover:bg-gray-800/50';
      case 'blondie':
        return 'text-amber-300 hover:bg-amber-900/50';
      default:
        return 'text-blue-400 hover:bg-blue-400/10';
    }
  };

  const openPopOutPlayer = () => {
    if (popOutWindow && !popOutWindow.closed) {
      popOutWindow.focus();
      return;
    }

    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const windowWidth = Math.min(1280, screenWidth * 0.8);
    const windowHeight = Math.min(720, screenHeight * 0.8);
    const left = (screenWidth - windowWidth) / 2;
    const top = (screenHeight - windowHeight) / 2;

    const newWindow = window.open(
      '',
      'StaticBuffetPlayer',
      `width=${windowWidth},height=${windowHeight},left=${left},top=${top},resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no`
    );

    if (!newWindow) {
      toast({
        title: "Pop-out Blocked",
        description: "Please allow pop-ups for this site to use the pop-out player.",
        variant: "destructive",
      });
      return;
    }

    setPopOutWindow(newWindow);
    setIsPopOutOpen(true);

    // Check if window is still open periodically
    windowCheckInterval.current = setInterval(() => {
      if (newWindow.closed) {
        setIsPopOutOpen(false);
        setPopOutWindow(null);
        if (windowCheckInterval.current) {
          clearInterval(windowCheckInterval.current);
        }
      }
    }, 1000);

    // Create the pop-out player HTML
    createPopOutPlayerContent(newWindow);

    toast({
      title: "Pop-out Player Opened",
      description: "Video player is now in a separate window.",
    });
  };

  const createPopOutPlayerContent = (window: Window) => {
    const themeColors = {
      testcard: { bg: '#0f172a', accent: '#3b82f6', text: '#e2e8f0' },
      waffle: { bg: '#fef3c7', accent: '#d97706', text: '#92400e' },
      ebn: { bg: '#1a2e05', accent: '#84cc16', text: '#bef264' },
      ozzy: { bg: '#0f0f0f', accent: '#ef4444', text: '#fca5a5' },
      hogan: { bg: '#1f2937', accent: '#eab308', text: '#fde047' },
      dx: { bg: '#1f2937', accent: '#ec4899', text: '#f9a8d4' },
      maxheadroom: { bg: '#064e3b', accent: '#22c55e', text: '#86efac' },
      mario: { bg: '#7f1d1d', accent: '#eab308', text: '#fde047' },
      dakota: { bg: '#374151', accent: '#9ca3af', text: '#d1d5db' },
      blondie: { bg: '#451a03', accent: '#f59e0b', text: '#fbbf24' }
    };

    const theme = themeColors[brandSkin] || themeColors.testcard;

    window.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Static Buffet - Pop-out Player</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            background: ${theme.bg};
            color: ${theme.text};
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            height: 100vh;
          }
          .header {
            background: rgba(0, 0, 0, 0.8);
            padding: 8px 16px;
            display: flex;
            justify-content: between;
            align-items: center;
            border-bottom: 1px solid ${theme.accent}50;
            backdrop-filter: blur(10px);
          }
          .title {
            font-weight: bold;
            color: ${theme.accent};
            font-size: 14px;
          }
          .video-container {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
            position: relative;
          }
          .video {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          .controls {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
            padding: 20px 16px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .video-container:hover .controls {
            opacity: 1;
          }
          .control-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
          }
          .control-btn:hover {
            background: rgba(255, 255, 255, 0.3);
          }
          .time-display {
            color: white;
            font-size: 12px;
            font-family: 'JetBrains Mono', monospace;
          }
          .progress-container {
            flex: 1;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            cursor: pointer;
            position: relative;
          }
          .progress-bar {
            height: 100%;
            background: ${theme.accent};
            border-radius: 2px;
            width: 0%;
            transition: width 0.1s ease;
          }
          .placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: ${theme.text};
            opacity: 0.7;
            text-align: center;
            padding: 40px;
          }
          .placeholder-icon {
            width: 64px;
            height: 64px;
            margin-bottom: 16px;
            opacity: 0.5;
          }
          .queue-info {
            position: absolute;
            top: 60px;
            left: 16px;
            background: rgba(0, 0, 0, 0.8);
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid ${theme.accent}50;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">🎛️ STATIC BUFFET - POP-OUT PLAYER</div>
        </div>
        <div class="video-container" id="videoContainer">
          <div class="placeholder" id="placeholder">
            <svg class="placeholder-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <h3>No Video Playing</h3>
            <p>Start playing a video in the main interface</p>
          </div>
          <div class="queue-info" id="queueInfo" style="display: none;">
            <div id="currentTrack">Track 1 of 1</div>
            <div id="trackTitle">No video loaded</div>
          </div>
        </div>
      </body>
      </html>
    `);

    window.document.close();

    // Set up message listener for updates from main window
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'VIDEO_UPDATE') {
        updatePopOutVideo(window, event.data);
      } else if (event.data.type === 'PLAYBACK_UPDATE') {
        updatePlaybackState(window, event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('beforeunload', () => {
      setIsPopOutOpen(false);
      setPopOutWindow(null);
    });
  };

  const updatePopOutVideo = (popWindow: Window, data: any) => {
    const { videoUrl, title, queueIndex, queueLength } = data;
    
    const videoContainer = popWindow.document.getElementById('videoContainer');
    const placeholder = popWindow.document.getElementById('placeholder');
    const queueInfo = popWindow.document.getElementById('queueInfo');
    const currentTrack = popWindow.document.getElementById('currentTrack');
    const trackTitle = popWindow.document.getElementById('trackTitle');

    if (!videoContainer) return;

    if (videoUrl) {
      placeholder?.style.setProperty('display', 'none');
      queueInfo?.style.setProperty('display', 'block');
      
      if (currentTrack) currentTrack.textContent = `Track ${queueIndex + 1} of ${queueLength}`;
      if (trackTitle) trackTitle.textContent = title || 'Untitled Video';

      // Remove existing video
      const existingVideo = videoContainer.querySelector('video');
      if (existingVideo) {
        existingVideo.remove();
      }

      // Create new video element
      const video = popWindow.document.createElement('video');
      video.className = 'video';
      video.src = videoUrl;
      video.controls = true;
      video.autoplay = isPlaying;
      
      // Add video before controls
      const controls = videoContainer.querySelector('.controls');
      if (controls) {
        videoContainer.insertBefore(video, controls);
      } else {
        videoContainer.appendChild(video);
      }
    } else {
      placeholder?.style.setProperty('display', 'flex');
      queueInfo?.style.setProperty('display', 'none');
      
      const existingVideo = videoContainer.querySelector('video');
      if (existingVideo) {
        existingVideo.remove();
      }
    }
  };

  const updatePlaybackState = (popWindow: Window, data: any) => {
    const video = popWindow.document.querySelector('video') as HTMLVideoElement;
    if (video) {
      if (data.isPlaying) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  // Send updates to pop-out window when video changes
  useEffect(() => {
    if (popOutWindow && !popOutWindow.closed && currentVideo) {
      popOutWindow.postMessage({
        type: 'VIDEO_UPDATE',
        videoUrl: currentVideo.videoUrl,
        title: currentVideo.title,
        queueIndex: currentQueueIndex,
        queueLength: queueItems.length
      }, '*');
    }
  }, [currentVideo, currentQueueIndex, queueItems.length, popOutWindow]);

  // Send playback state updates
  useEffect(() => {
    if (popOutWindow && !popOutWindow.closed) {
      popOutWindow.postMessage({
        type: 'PLAYBACK_UPDATE',
        isPlaying
      }, '*');
    }
  }, [isPlaying, popOutWindow]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (windowCheckInterval.current) {
        clearInterval(windowCheckInterval.current);
      }
      if (popOutWindow && !popOutWindow.closed) {
        popOutWindow.close();
      }
    };
  }, [popOutWindow]);

  const closePopOut = () => {
    if (popOutWindow && !popOutWindow.closed) {
      popOutWindow.close();
    }
    setIsPopOutOpen(false);
    setPopOutWindow(null);
    
    toast({
      title: "Pop-out Closed",
      description: "Video player returned to main interface.",
    });
  };

  return (
    <div className="flex items-center space-x-2">
      {!isPopOutOpen ? (
        <Button
          onClick={openPopOutPlayer}
          variant="ghost"
          size="sm"
          className={`flex items-center space-x-1 px-2 py-1 ${getThemeClasses()}`}
          title="Open video player in separate window"
          data-testid="button-pop-out-player"
        >
          <ExternalLink size={14} />
          <span className="text-xs">Pop Out</span>
        </Button>
      ) : (
        <Button
          onClick={closePopOut}
          variant="ghost"
          size="sm"
          className={`flex items-center space-x-1 px-2 py-1 ${getThemeClasses()}`}
          title="Close pop-out player"
          data-testid="button-close-pop-out"
        >
          <X size={14} />
          <span className="text-xs">Close Pop-out</span>
        </Button>
      )}
    </div>
  );
}