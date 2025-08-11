import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EasterEggProps {
  isActive: boolean;
  onClose: () => void;
}

export function EasterEgg({ isActive, onClose }: EasterEggProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    // Load the video when activated
    if (videoRef.current && !isLoaded) {
      // Use the correct filename from Archive.org
      videoRef.current.src = 'https://archive.org/download/TheVistaGroup-MarilynMansonGetYourGunnonBeavisandButthead/Marilyn%20Manson%20-%20Get%20Your%20Gunn%20on%20Beavis%20and%20Butthead%20VHS%20%E2%80%A2%2060%20FPS%201996.mp4';
      videoRef.current.crossOrigin = 'anonymous';
      videoRef.current.load();
      setIsLoaded(true);
    }

    // Start the acid trip animation
    const startAcidTrip = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      let time = 0;
      const kaleidoscope = () => {
        if (!canvas || !video || !ctx) return;
        
        time += 0.05;
        
        // Clear canvas with a trippy background
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
        );
        gradient.addColorStop(0, `hsl(${(time * 50) % 360}, 100%, 20%)`);
        gradient.addColorStop(1, `hsl(${(time * 30 + 180) % 360}, 100%, 5%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw multiple kaleidoscope segments
        const segments = 8;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        for (let i = 0; i < segments; i++) {
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate((i * Math.PI * 2) / segments + time);
          
          // Scale and distort
          const scale = 0.3 + Math.sin(time * 2) * 0.2;
          ctx.scale(scale, scale);
          
          // Add chromatic aberration effect
          ctx.globalCompositeOperation = i % 3 === 0 ? 'screen' : 
                                       i % 3 === 1 ? 'multiply' : 'overlay';
          
          // Draw video segment with psychedelic transforms
          const videoAspect = video.videoWidth / video.videoHeight;
          const segmentWidth = 200;
          const segmentHeight = segmentWidth / videoAspect;
          
          ctx.drawImage(
            video,
            -segmentWidth / 2,
            -segmentHeight / 2,
            segmentWidth,
            segmentHeight
          );
          
          ctx.restore();
        }

        // Add strobing overlay
        const strobe = Math.sin(time * 20) * 0.5 + 0.5;
        ctx.globalCompositeOperation = 'color-dodge';
        ctx.fillStyle = `rgba(255, 0, 255, ${strobe * 0.3})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add plasma effect
        ctx.globalCompositeOperation = 'screen';
        for (let x = 0; x < canvas.width; x += 20) {
          for (let y = 0; y < canvas.height; y += 20) {
            const plasma = Math.sin(x * 0.01 + time) * Math.cos(y * 0.01 + time * 1.5);
            const hue = (plasma * 180 + time * 100) % 360;
            ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.1)`;
            ctx.fillRect(x, y, 20, 20);
          }
        }

        animationRef.current = requestAnimationFrame(kaleidoscope);
      };

      const playVideo = async () => {
        try {
          await video.play();
          kaleidoscope();
        } catch (error) {
          console.log('Video autoplay failed, waiting for user interaction');
          // Fallback: start animation even without video
          kaleidoscope();
        }
      };

      video.addEventListener('loadeddata', playVideo);
      video.addEventListener('canplay', playVideo);

      // Add click to play fallback
      video.addEventListener('click', async () => {
        try {
          await video.play();
        } catch (error) {
          console.log('Manual play failed:', error);
        }
      });

      if (video.readyState >= 2) {
        playVideo();
      }
    };

    startAcidTrip();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isLoaded]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      {/* Hidden video element */}
      <video
        ref={videoRef}
        className="hidden"
        crossOrigin="anonymous"
        muted
        loop
        playsInline
        preload="metadata"
      />
      
      {/* Trippy canvas overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Close button */}
      <Button
        onClick={onClose}
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
        data-testid="button-close-easter-egg"
      >
        <X size={20} />
      </Button>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 text-center text-white text-sm opacity-75 z-10">
        <p>🌀 ACID TRIP MODE ACTIVATED 🌀</p>
        <p>Press ESC or click X to exit</p>
        {!isLoaded && <p>Loading Marilyn Manson...</p>}
      </div>
    </div>
  );
}