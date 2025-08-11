import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Camera, CameraOff, Settings, Monitor, Square } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CameraDevice {
  deviceId: string;
  label: string;
}

export function LiveVideoMode() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { brandSkin, videoEffects, addToQueue } = useStore();

  // Get available cameras
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices
          .filter(device => device.kind === 'videoinput')
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `Camera ${device.deviceId.slice(0, 8)}`
          }));
        
        setCameras(videoDevices);
        if (videoDevices.length > 0 && !selectedCamera) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error enumerating devices:', error);
      }
    };

    getCameras();
  }, [selectedCamera]);

  const startLiveVideo = async () => {
    if (!videoRef.current) return;
    
    setIsLoading(true);
    
    try {
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Request camera access
      const constraints = {
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      
      await videoRef.current.play();
      setIsLiveMode(true);
      
      toast({
        title: "📹 Live Video Active",
        description: "Webcam feed is now streaming with real-time effects",
        duration: 3000,
      });

    } catch (error) {
      console.error('Error starting live video:', error);
      
      let errorMessage = "Could not access camera";
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = "Camera permission denied. Please allow camera access.";
        } else if (error.name === 'NotFoundError') {
          errorMessage = "No camera found. Please connect a camera.";
        } else if (error.name === 'NotReadableError') {
          errorMessage = "Camera is being used by another application.";
        }
      }
      
      toast({
        title: "❌ Camera Error",
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopLiveVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsLiveMode(false);
    
    toast({
      title: "📹 Live Video Stopped",
      description: "Webcam feed disconnected",
      duration: 2000,
    });
  };

  const addLiveVideoToQueue = () => {
    if (!isLiveMode || !streamRef.current) return;
    
    // Create a mock video result for the live stream
    const liveVideoItem = {
      identifier: 'live_webcam_' + Date.now(),
      title: 'Live Webcam Feed',
      creator: 'Real-time Camera',
      description: 'Live webcam video for real-time mixing',
      year: new Date().getFullYear().toString(),
      licenseurl: 'live_stream',
      downloads: 0
    };

    // Add to queue with special live video URL
    addToQueue(liveVideoItem, 'live_webcam_stream', false);
    
    toast({
      title: "📹 Live Feed Added",
      description: "Webcam stream added to queue for mixing",
      duration: 3000,
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className={`rounded-lg p-4 transition-all duration-300 ${
      brandSkin === 'waffle' 
        ? 'bg-yellow-50/50 border border-yellow-400/30' 
        : brandSkin === 'ebn'
        ? 'bg-gray-800/50 border border-lime-500/30'
        : brandSkin === 'ozzy'
        ? 'bg-red-950/30 border border-red-500/30'
        : brandSkin === 'mario'
        ? 'bg-red-900/30 border border-yellow-400/30'
        : 'bg-gray-800/50 border border-yellow-400/30'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Camera className={`${
            brandSkin === 'waffle' ? 'text-amber-600' : 
            brandSkin === 'ebn' ? 'text-lime-400' :
            brandSkin === 'ozzy' ? 'text-red-400' :
            brandSkin === 'mario' ? 'text-red-500' :
            'text-yellow-400'
          }`} size={20} />
          <h3 className={`font-bold ${
            brandSkin === 'waffle' ? 'text-amber-900' : 
            brandSkin === 'ebn' ? 'text-gray-100' :
            brandSkin === 'ozzy' ? 'text-red-300' :
            brandSkin === 'mario' ? 'text-yellow-200' :
            'text-yellow-300'
          }`}>
            Live Video Mode
          </h3>
        </div>
        
        {isLiveMode && (
          <div className="flex items-center space-x-1 animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-xs font-mono text-red-500">LIVE</span>
          </div>
        )}
      </div>

      {/* Camera Selection */}
      {cameras.length > 0 && (
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${
            brandSkin === 'waffle' ? 'text-amber-800' : 
            brandSkin === 'ebn' ? 'text-gray-300' :
            brandSkin === 'ozzy' ? 'text-red-200' :
            brandSkin === 'mario' ? 'text-yellow-200' :
            'text-yellow-200'
          }`}>
            Camera Device
          </label>
          <Select value={selectedCamera} onValueChange={setSelectedCamera} disabled={isLiveMode}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select camera" />
            </SelectTrigger>
            <SelectContent>
              {cameras.map((camera) => (
                <SelectItem key={camera.deviceId} value={camera.deviceId}>
                  {camera.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Preview Video */}
      <div className="mb-4">
        <video 
          ref={videoRef}
          className="w-full aspect-video bg-black rounded-lg"
          style={{
            filter: isLiveMode ? `
              brightness(${videoEffects.brightness}%) 
              contrast(${videoEffects.contrast}%) 
              saturate(${videoEffects.saturation}%) 
              hue-rotate(${videoEffects.hue}deg)
              blur(${videoEffects.blur}px)
              opacity(${videoEffects.opacity}%)
              grayscale(${videoEffects.grayscale}%)
              invert(${videoEffects.invert}%)
              sepia(${videoEffects.sepia}%)
            ` : 'none'
          }}
          muted={false}
          playsInline
        />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        {!isLiveMode ? (
          <Button 
            onClick={startLiveVideo} 
            disabled={isLoading || cameras.length === 0}
            className="flex items-center space-x-2"
          >
            <Camera size={16} />
            <span>{isLoading ? 'Starting...' : 'Start Live Video'}</span>
          </Button>
        ) : (
          <>
            <Button 
              onClick={stopLiveVideo}
              variant="destructive" 
              className="flex items-center space-x-2"
            >
              <CameraOff size={16} />
              <span>Stop Live Video</span>
            </Button>
            
            <Button 
              onClick={addLiveVideoToQueue}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <Square size={16} />
              <span>Add to Queue</span>
            </Button>
          </>
        )}
      </div>

      {cameras.length === 0 && (
        <div className={`mt-4 p-3 rounded-lg ${
          brandSkin === 'waffle' 
            ? 'bg-amber-100 text-amber-800 border border-amber-200'
            : 'bg-gray-700 text-gray-300 border border-gray-600'
        }`}>
          <p className="text-sm">
            No cameras detected. Please connect a webcam or check camera permissions.
          </p>
        </div>
      )}
    </div>
  );
}