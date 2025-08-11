import { useState, useRef } from 'react';
import { Play, Pause, Square, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { ScaleTransition, PulseTransition } from './AnimatedTransitions';

export function MediaControls() {
  const { brandSkin } = useStore();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

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

  const handlePlay = () => {
    const videos = document.querySelectorAll('video');
    if (videos.length > 0) {
      const video = videos[0]; // Get the first video element
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
        toast({
          title: "Playback Paused",
          description: "Video playback has been paused.",
        });
      } else {
        video.play();
        setIsPlaying(true);
        toast({
          title: "Playback Started",
          description: "Video playback has been started.",
        });
      }
    } else {
      toast({
        title: "No Video",
        description: "No video available to play.",
        variant: "destructive",
      });
    }
  };

  const handleStop = () => {
    const videos = document.querySelectorAll('video');
    if (videos.length > 0) {
      const video = videos[0];
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
      toast({
        title: "Playback Stopped",
        description: "Video playback has been stopped and reset.",
      });
    }
  };

  const handleRecord = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        toast({
          title: "Recording Stopped",
          description: "Screen recording has been stopped.",
        });
      }
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9'
        });

        recordedChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, {
            type: 'video/webm'
          });
          
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `static-buffet-recording-${Date.now()}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          // Clean up stream
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);

        toast({
          title: "Recording Started",
          description: "Screen recording has begun. Click record again to stop.",
        });
      } catch (error) {
        console.error('Error starting screen recording:', error);
        toast({
          title: "Recording Failed",
          description: "Could not start screen recording. Permission may be denied.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Play/Pause Button */}
      <ScaleTransition hoverScale={1.1} tapScale={0.9}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePlay}
          className={`p-2 ${getThemeClasses()}`}
          title={isPlaying ? "Pause playback" : "Start playback"}
          data-testid={isPlaying ? "button-pause" : "button-play"}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </Button>
      </ScaleTransition>

      {/* Stop Button */}
      <ScaleTransition hoverScale={1.1} tapScale={0.9}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStop}
          className={`p-2 ${getThemeClasses()}`}
          title="Stop playback"
          data-testid="button-stop"
        >
          <Square size={14} />
        </Button>
      </ScaleTransition>

      {/* Record Button with Pulse Animation */}
      <PulseTransition isActive={isRecording}>
        <ScaleTransition hoverScale={1.1} tapScale={0.9}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRecord}
            className={`p-2 ${getThemeClasses()}`}
            title={isRecording ? "Stop recording" : "Start screen recording"}
            data-testid={isRecording ? "button-stop-record" : "button-start-record"}
          >
            <Circle size={14} className={isRecording ? 'fill-current' : ''} />
          </Button>
        </ScaleTransition>
      </PulseTransition>
    </div>
  );
}