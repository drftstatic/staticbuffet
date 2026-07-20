import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { type QueueItem } from '@/lib/types';
// Global singleton for pop-out window management
let globalPopOutWindow: Window | null = null;
let globalPopOutWindowOpen = false;
interface PopOutPlayerProps {
    currentVideo?: QueueItem | null;
}
export function PopOutPlayer({ currentVideo }: PopOutPlayerProps) {
    const { brandSkin, queueItems, currentQueueIndex, isPlaying, nextTrack, previousTrack, setVideoEffects, videoEffects } = useStore();
    const { toast } = useToast();
    const windowCheckInterval = useRef<NodeJS.Timeout>();
    // Use global singleton instead of local state
    const [isPopOutOpen, setIsPopOutOpen] = useState(globalPopOutWindowOpen);
    const getThemeClasses = () => {
        {
            return 'text-lime-400 hover:bg-lime-900/50';
        }
    };
    // Effect presets for keyboard shortcuts
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
    // Handle keyboard commands from pop-out window
    const handleKeyboardCommand = (keyCode: string, modifiers: {
        ctrlKey: boolean;
        metaKey: boolean;
        altKey: boolean;
        shiftKey: boolean;
    }) => {
        if (!currentVideo)
            return;
        switch (keyCode) {
            case 'Space':
                // Toggle play/pause via video element in pop-out
                if (globalPopOutWindow && !globalPopOutWindow.closed) {
                    const video = globalPopOutWindow.document.querySelector('video') as HTMLVideoElement;
                    if (video) {
                        if (video.paused) {
                            video.play();
                        }
                        else {
                            video.pause();
                        }
                    }
                }
                toast({
                    title: isPlaying ? "Video Paused" : "Video Playing",
                    description: `${currentVideo.title}`,
                });
                break;
            case 'ArrowLeft':
                // Seek backward
                if (globalPopOutWindow && !globalPopOutWindow.closed) {
                    const video = globalPopOutWindow.document.querySelector('video') as HTMLVideoElement;
                    if (video) {
                        video.currentTime = Math.max(0, video.currentTime - 10);
                    }
                }
                break;
            case 'ArrowRight':
                // Seek forward
                if (globalPopOutWindow && !globalPopOutWindow.closed) {
                    const video = globalPopOutWindow.document.querySelector('video') as HTMLVideoElement;
                    if (video) {
                        video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
                    }
                }
                break;
            case 'ArrowUp':
                // Volume up
                if (globalPopOutWindow && !globalPopOutWindow.closed) {
                    const video = globalPopOutWindow.document.querySelector('video') as HTMLVideoElement;
                    if (video) {
                        video.volume = Math.min(1, video.volume + 0.1);
                    }
                }
                break;
            case 'ArrowDown':
                // Volume down
                if (globalPopOutWindow && !globalPopOutWindow.closed) {
                    const video = globalPopOutWindow.document.querySelector('video') as HTMLVideoElement;
                    if (video) {
                        video.volume = Math.max(0, video.volume - 0.1);
                    }
                }
                break;
            case 'Digit1':
                applyPreset('cyberpunk');
                toast({ title: "Cyberpunk Effect Applied", description: "High contrast, neon colors" });
                break;
            case 'Digit2':
                applyPreset('vintage');
                toast({ title: "Vintage Effect Applied", description: "Warm, sepia tones" });
                break;
            case 'Digit3':
                applyPreset('glitch');
                toast({ title: "Glitch Effect Applied", description: "Digital distortion" });
                break;
            case 'Digit4':
                applyPreset('noir');
                toast({ title: "Noir Effect Applied", description: "Black and white, high contrast" });
                break;
            case 'Digit5':
                applyPreset('vortex');
                toast({ title: "Vortex Effect Applied", description: "Twisted reality" });
                break;
            case 'Digit6':
                applyPreset('portal');
                toast({ title: "Portal Effect Applied", description: "Otherworldly distortion" });
                break;
            case 'Digit7':
                applyPreset('fractal');
                toast({ title: "Fractal Effect Applied", description: "Geometric patterns" });
                break;
            case 'Digit8':
                applyPreset('timewarp');
                toast({ title: "Timewarp Effect Applied", description: "Temporal distortion" });
                break;
        }
    };
    // Apply video effects to pop-out video element
    const applyEffectsToPopOutVideo = (video: HTMLVideoElement) => {
        const filterString = `
      brightness(${videoEffects.brightness}%) 
      contrast(${videoEffects.contrast}%) 
      saturate(${videoEffects.saturation}%) 
      hue-rotate(${videoEffects.hue}deg) 
      blur(${videoEffects.blur}px) 
      opacity(${videoEffects.opacity}%) 
      grayscale(${videoEffects.grayscale}%) 
      invert(${videoEffects.invert}%) 
      sepia(${videoEffects.sepia}%)
    `;
        const transformString = `rotate(${videoEffects.rotate}deg) scaleX(${videoEffects.scaleX / 100}) scaleY(${videoEffects.scaleY / 100})`;
        video.style.filter = filterString;
        video.style.transform = transformString;
    };
    const openPopOutPlayer = () => {
        if (globalPopOutWindow && !globalPopOutWindow.closed) {
            globalPopOutWindow.focus();
            return;
        }
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const windowWidth = Math.min(1280, screenWidth * 0.8);
        const windowHeight = Math.min(720, screenHeight * 0.8);
        const left = (screenWidth - windowWidth) / 2;
        const top = (screenHeight - windowHeight) / 2;
        const newWindow = window.open('', 'StaticBuffetPlayer', `width=${windowWidth},height=${windowHeight},left=${left},top=${top},resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no`);
        if (!newWindow) {
            toast({
                title: "Pop-out Blocked",
                description: "Please allow pop-ups for this site to use the pop-out player.",
                variant: "destructive",
            });
            return;
        }
        globalPopOutWindow = newWindow;
        globalPopOutWindowOpen = true;
        setIsPopOutOpen(true);
        // Check if window is still open periodically
        windowCheckInterval.current = setInterval(() => {
            if (newWindow.closed) {
                globalPopOutWindowOpen = false;
                globalPopOutWindow = null;
                setIsPopOutOpen(false);
                if (windowCheckInterval.current) {
                    clearInterval(windowCheckInterval.current);
                }
            }
        }, 1000);
        // Create the pop-out player HTML
        createPopOutPlayerContent(newWindow);
        // Send current video immediately if one exists
        if (currentVideo) {
            setTimeout(() => {
                newWindow.postMessage({
                    type: 'VIDEO_UPDATE',
                    videoUrl: currentVideo.videoUrl,
                    title: currentVideo.title,
                    queueIndex: currentQueueIndex,
                    queueLength: queueItems.length
                }, '*');
            }, 500); // Small delay to ensure DOM is ready
        }
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
            blondie: { bg: '#451a03', accent: '#f59e0b', text: '#fbbf24' },
            diner: { bg: '#451a03', accent: '#f59e0b', text: '#fbbf24' }
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
            justify-content: space-between;
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
          
          <!-- Keyboard shortcuts overlay -->
          <div style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.8); padding: 8px 12px; border-radius: 4px; font-size: 11px; color: ${theme.text}; opacity: 0.7; pointer-events: none;">
            Space: play/pause • ← →: seek • ↑ ↓: volume<br/>
            1-8: effect presets • F: fullscreen
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
            }
            else if (event.data.type === 'PLAYBACK_UPDATE') {
                updatePlaybackState(window, event.data);
            }
        };
        window.addEventListener('message', handleMessage);
        window.addEventListener('beforeunload', () => {
            globalPopOutWindowOpen = false;
            globalPopOutWindow = null;
            setIsPopOutOpen(false);
        });
        // Add keyboard shortcuts to the pop-out window
        const setupKeyboardShortcuts = () => {
            const handleKeyDown = (e: KeyboardEvent) => {
                // Don't trigger shortcuts when user is typing in inputs, textareas, or contenteditable elements
                const target = e.target as HTMLElement;
                if (target && (target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.tagName === 'SELECT' ||
                    target.contentEditable === 'true' ||
                    target.closest('[contenteditable="true"]'))) {
                    return;
                }
                // Send keyboard command back to main window
                if (window.opener && !window.opener.closed) {
                    window.opener.postMessage({
                        type: 'KEYBOARD_COMMAND',
                        keyCode: e.code,
                        ctrlKey: e.ctrlKey,
                        metaKey: e.metaKey,
                        altKey: e.altKey,
                        shiftKey: e.shiftKey
                    }, '*');
                    e.preventDefault();
                }
            };
            window.document.addEventListener('keydown', handleKeyDown);
            // Cleanup function
            return () => {
                window.document.removeEventListener('keydown', handleKeyDown);
            };
        };
        // Set up keyboard shortcuts after DOM is ready
        if (window.document.readyState === 'complete') {
            setupKeyboardShortcuts();
        }
        else {
            window.addEventListener('load', setupKeyboardShortcuts);
        }
    };
    const updatePopOutVideo = (popWindow: Window, data: any) => {
        const { videoUrl, title, queueIndex, queueLength } = data;
        const videoContainer = popWindow.document.getElementById('videoContainer');
        const placeholder = popWindow.document.getElementById('placeholder');
        const queueInfo = popWindow.document.getElementById('queueInfo');
        const currentTrack = popWindow.document.getElementById('currentTrack');
        const trackTitle = popWindow.document.getElementById('trackTitle');
        if (!videoContainer)
            return;
        if (videoUrl) {
            placeholder?.style.setProperty('display', 'none');
            queueInfo?.style.setProperty('display', 'block');
            if (currentTrack)
                currentTrack.textContent = `Track ${queueIndex + 1} of ${queueLength}`;
            if (trackTitle)
                trackTitle.textContent = title || 'Untitled Video';
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
            video.crossOrigin = 'anonymous'; // Add CORS support like main player
            video.preload = 'auto'; // Match main player settings
            // Apply current video effects
            applyEffectsToPopOutVideo(video);
            console.log('🎬 Creating pop-out video element:', {
                src: videoUrl,
                controls: true,
                autoplay: isPlaying
            });
            // Add error handling to pop-out video
            video.addEventListener('error', (e) => {
                console.error('❌ Pop-out video error:', {
                    error: e,
                    errorCode: video.error?.code,
                    errorMessage: video.error?.message,
                    src: video.src
                });
            });
            video.addEventListener('loadstart', () => {
                console.log('🔄 Pop-out video load started');
            });
            video.addEventListener('canplay', () => {
                console.log('✅ Pop-out video can play');
            });
            videoContainer.appendChild(video);
        }
        else {
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
            }
            else {
                video.pause();
            }
        }
    };
    // Send updates to pop-out window when video changes
    useEffect(() => {
        if (globalPopOutWindow && !globalPopOutWindow.closed && currentVideo) {
            console.log('📺 Sending video update to pop-out:', {
                videoUrl: currentVideo.videoUrl,
                title: currentVideo.title,
                queueIndex: currentQueueIndex,
                queueLength: queueItems.length
            });
            globalPopOutWindow.postMessage({
                type: 'VIDEO_UPDATE',
                videoUrl: currentVideo.videoUrl,
                title: currentVideo.title,
                queueIndex: currentQueueIndex,
                queueLength: queueItems.length
            }, '*');
        }
    }, [currentVideo, currentQueueIndex, queueItems.length]);
    // Send playback state updates
    useEffect(() => {
        if (globalPopOutWindow && !globalPopOutWindow.closed) {
            globalPopOutWindow.postMessage({
                type: 'PLAYBACK_UPDATE',
                isPlaying
            }, '*');
        }
    }, [isPlaying]);
    // Listen for keyboard commands from pop-out window
    useEffect(() => {
        const handlePopOutMessage = (event: MessageEvent) => {
            if (event.data.type === 'KEYBOARD_COMMAND') {
                handleKeyboardCommand(event.data.keyCode, {
                    ctrlKey: event.data.ctrlKey,
                    metaKey: event.data.metaKey,
                    altKey: event.data.altKey,
                    shiftKey: event.data.shiftKey
                });
            }
        };
        window.addEventListener('message', handlePopOutMessage);
        return () => {
            window.removeEventListener('message', handlePopOutMessage);
        };
    }, [currentVideo, isPlaying, videoEffects]);
    // Update video effects in pop-out window when they change
    useEffect(() => {
        if (globalPopOutWindow && !globalPopOutWindow.closed) {
            const video = globalPopOutWindow.document.querySelector('video') as HTMLVideoElement;
            if (video) {
                applyEffectsToPopOutVideo(video);
            }
        }
    }, [videoEffects]);
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (windowCheckInterval.current) {
                clearInterval(windowCheckInterval.current);
            }
            // Don't close global window on unmount - let user close it manually
        };
    }, []);
    // Expose function globally for testing
    useEffect(() => {
        (window as any).testPopOutPlayer = () => {
            console.log('testPopOutPlayer: Manual test triggered');
            openPopOutPlayer();
        };
        return () => {
            delete (window as any).testPopOutPlayer;
        };
    }, [openPopOutPlayer]);
    const closePopOut = () => {
        if (globalPopOutWindow && !globalPopOutWindow.closed) {
            globalPopOutWindow.close();
        }
        globalPopOutWindowOpen = false;
        globalPopOutWindow = null;
        setIsPopOutOpen(false);
        toast({
            title: "Pop-out Closed",
            description: "Video player returned to main interface.",
        });
    };
    return (<div className="flex items-center space-x-2">
      {!isPopOutOpen ? (<Button onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openPopOutPlayer();
            }} variant="ghost" size="sm" className={`w-8 h-8 p-0 ${getThemeClasses()}`} title="Open video player in separate window" data-testid="button-pop-out-player">
          <ExternalLink size={14}/>
        </Button>) : (<Button onClick={closePopOut} variant="ghost" size="sm" className={`w-8 h-8 p-0 ${getThemeClasses()}`} title="Close pop-out player" data-testid="button-close-pop-out">
          <X size={14}/>
        </Button>)}
    </div>);
}
