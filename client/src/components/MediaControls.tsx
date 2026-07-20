import { useState, useRef } from 'react';
import { Play, Pause, Square, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { setRecorder } from '@/lib/program-output';
import { useToast } from '@/hooks/use-toast';
import { ScaleTransition, PulseTransition } from './AnimatedTransitions';
import { LuckyDip } from '@/components/LuckyDip';
import { EmergencyMix } from '@/components/EmergencyMix';
export function MediaControls() {
    const { brandSkin } = useStore();
    const { toast } = useToast();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const getThemeClasses = () => {
        {
            return 'text-lime-400 hover:bg-lime-900/50';
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
            }
            else {
                video.play();
                setIsPlaying(true);
                toast({
                    title: "Playback Started",
                    description: "Video playback has been started.",
                });
            }
        }
        else {
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
            setRecorder.stop();
            setIsRecording(false);
            toast({
                title: "Set recorded",
                description: "Your set is downloading as a WebM file.",
            });
        }
        else if (setRecorder.start()) {
            setIsRecording(true);
            toast({
                title: "Recording set",
                description: "Capturing the program output (video + audio). Click again to stop.",
            });
        }
        else {
            toast({
                title: "Nothing to record",
                description: "Load a video first so the program output is live.",
                variant: "destructive",
            });
        }
    };

    const handleLuckyDipResults = (results: any) => {
        // Results are already set by LuckyDip component
        console.log('Lucky Dip found', results.length, 'clips');
    };
    return (<div className="flex items-center space-x-1">
      {/* Play/Pause Button */}
      <ScaleTransition hoverScale={1.1} tapScale={0.9}>
        <Button variant="ghost" size="sm" onClick={handlePlay} className={`p-2 ${getThemeClasses()}`} title={isPlaying ? "Pause playback" : "Start playback"} data-testid={isPlaying ? "button-pause" : "button-play"}>
          {isPlaying ? <Pause size={14}/> : <Play size={14}/>}
        </Button>
      </ScaleTransition>

      {/* Stop Button */}
      <ScaleTransition hoverScale={1.1} tapScale={0.9}>
        <Button variant="ghost" size="sm" onClick={handleStop} className={`p-2 ${getThemeClasses()}`} title="Stop playback" data-testid="button-stop">
          <Square size={14}/>
        </Button>
      </ScaleTransition>

      {/* Record Button with Pulse Animation */}
      <PulseTransition isActive={isRecording}>
        <ScaleTransition hoverScale={1.1} tapScale={0.9}>
          <Button variant="ghost" size="sm" onClick={handleRecord} className={`p-2 ${getThemeClasses()}`} title={isRecording ? "Stop recording" : "Start screen recording"} data-testid={isRecording ? "button-stop-record" : "button-start-record"}>
            <Circle size={14} className={isRecording ? 'fill-current' : ''}/>
          </Button>
        </ScaleTransition>
      </PulseTransition>

      {/* Lucky Dip & Emergency Mix Buttons */}
      <div className="border-l border-white/20 pl-1 ml-1 flex items-center space-x-1">
        <LuckyDip onDipResults={handleLuckyDipResults}/>
        <EmergencyMix />
      </div>
    </div>);
}
