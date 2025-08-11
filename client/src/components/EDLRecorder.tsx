import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CircleDot, 
  Square, 
  Download, 
  Clock, 
  Scissors, 
  PlayCircle, 
  PauseCircle,
  RotateCcw,
  Settings,
  FileText,
  Timer
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { type EDLEvent, type EDLSession } from '@/lib/types';

interface EDLRecorderProps {}

export function EDLRecorder({}: EDLRecorderProps) {
  const { 
    brandSkin, 
    isPlaying, 
    queueItems, 
    currentQueueIndex, 
    videoEffects, 
    audioEffects 
  } = useStore();
  const { toast } = useToast();

  const [isRecording, setIsRecording] = useState(false);
  const [currentSession, setCurrentSession] = useState<EDLSession | null>(null);
  const [sessionName, setSessionName] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [events, setEvents] = useState<EDLEvent[]>([]);
  const [eventCount, setEventCount] = useState(0);
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const lastStateRef = useRef({
    isPlaying: false,
    currentQueueIndex: 0,
    videoEffects: { ...videoEffects },
    audioEffects: { ...audioEffects }
  });

  const timerRef = useRef<NodeJS.Timeout>();

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'testcard':
        return {
          accent: 'text-blue-400 border-blue-400',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          recording: 'bg-red-600 hover:bg-red-700 text-white animate-pulse',
          badge: 'bg-blue-100 text-blue-800'
        };
      case 'waffle':
        return {
          accent: 'text-amber-800 border-amber-800',
          button: 'bg-amber-600 hover:bg-amber-700 text-white',
          recording: 'bg-red-600 hover:bg-red-700 text-white animate-pulse',
          badge: 'bg-amber-100 text-amber-800'
        };
      case 'ebn':
        return {
          accent: 'text-lime-400 border-lime-400',
          button: 'bg-lime-600 hover:bg-lime-700 text-white',
          recording: 'bg-red-600 hover:bg-red-700 text-white animate-pulse',
          badge: 'bg-lime-100 text-lime-800'
        };
      case 'ozzy':
        return {
          accent: 'text-red-300 border-red-300',
          button: 'bg-red-600 hover:bg-red-700 text-white',
          recording: 'bg-red-800 hover:bg-red-900 text-white animate-pulse',
          badge: 'bg-red-100 text-red-800'
        };
      case 'hogan':
        return {
          accent: 'text-yellow-300 border-yellow-300',
          button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          recording: 'bg-red-600 hover:bg-red-700 text-white animate-pulse',
          badge: 'bg-yellow-100 text-yellow-800'
        };
      default:
        return {
          accent: 'text-blue-400 border-blue-400',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          recording: 'bg-red-600 hover:bg-red-700 text-white animate-pulse',
          badge: 'bg-blue-100 text-blue-800'
        };
    }
  };

  const theme = getThemeClasses();

  // Generate unique session ID
  const generateSessionId = () => {
    return `edl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Generate unique event ID
  const generateEventId = () => {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Format duration for display
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording session
  const startRecording = () => {
    if (!sessionName.trim()) {
      toast({
        title: "Session Name Required",
        description: "Please enter a name for your recording session.",
        variant: "destructive",
      });
      return;
    }

    const sessionId = generateSessionId();
    const startTime = new Date();
    
    const newSession: EDLSession = {
      id: sessionId,
      name: sessionName,
      startTime: startTime.toISOString(),
      venue: venue || undefined,
      description: description || undefined,
      events: [],
      metadata: {
        theme: brandSkin,
        audioReactive: false,
        totalClips: 0,
        totalCuts: 0,
      }
    };

    setCurrentSession(newSession);
    setIsRecording(true);
    setRecordingStartTime(startTime);
    setEvents([]);
    setEventCount(0);

    // Start the timer
    timerRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);

    // Log initial state
    const currentVideo = queueItems[currentQueueIndex];
    if (currentVideo) {
      logEvent('play', {
        clipId: currentVideo.id,
        clipTitle: currentVideo.title,
        timecode: '00:00:00',
        trimIn: currentVideo.trimIn,
        trimOut: currentVideo.trimOut,
        notes: 'Session started'
      });
    }

    toast({
      title: "EDL Recording Started",
      description: `Now recording "${sessionName}" - all cuts and effects will be logged.`,
    });
  };

  // Stop recording session
  const stopRecording = () => {
    if (!currentSession || !recordingStartTime) return;

    const endTime = new Date();
    const totalDuration = Math.floor((endTime.getTime() - recordingStartTime.getTime()) / 1000);

    const updatedSession: EDLSession = {
      ...currentSession,
      endTime: endTime.toISOString(),
      totalDuration: formatDuration(totalDuration),
      events: events,
      metadata: {
        ...currentSession.metadata,
        totalClips: new Set(events.map(e => e.clipId)).size,
        totalCuts: events.filter(e => e.eventType === 'cut').length,
      }
    };

    setCurrentSession(updatedSession);
    setIsRecording(false);
    setRecordingDuration(0);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Save to localStorage
    const savedSessions = JSON.parse(localStorage.getItem('staticBuffetEDLSessions') || '[]');
    savedSessions.push(updatedSession);
    localStorage.setItem('staticBuffetEDLSessions', JSON.stringify(savedSessions));

    toast({
      title: "EDL Recording Stopped",
      description: `Session "${updatedSession.name}" saved with ${events.length} events.`,
    });
  };

  // Log an EDL event
  const logEvent = (eventType: EDLEvent['eventType'], params: Partial<EDLEvent>) => {
    if (!isRecording || !currentSession) return;

    const currentVideo = queueItems[currentQueueIndex];
    if (!currentVideo && eventType !== 'pause') return;

    const event: EDLEvent = {
      id: generateEventId(),
      sessionId: currentSession.id,
      timestamp: new Date().toISOString(),
      eventType,
      clipId: params.clipId || currentVideo?.id || 'unknown',
      clipTitle: params.clipTitle || currentVideo?.title || 'Unknown',
      timecode: params.timecode || '00:00:00',
      trimIn: params.trimIn || currentVideo?.trimIn || '00:00:00',
      trimOut: params.trimOut || currentVideo?.trimOut || '00:00:00',
      parameters: params.parameters,
      notes: params.notes,
    };

    setEvents(prev => [...prev, event]);
    setEventCount(prev => prev + 1);
  };

  // Watch for state changes to log events
  useEffect(() => {
    const lastState = lastStateRef.current;
    
    // Play/Pause changes
    if (isPlaying !== lastState.isPlaying) {
      logEvent(isPlaying ? 'play' : 'pause', {
        notes: isPlaying ? 'Playback started' : 'Playback paused'
      });
    }

    // Queue index changes (cuts)
    if (currentQueueIndex !== lastState.currentQueueIndex) {
      const currentVideo = queueItems[currentQueueIndex];
      if (currentVideo) {
        logEvent('cut', {
          clipId: currentVideo.id,
          clipTitle: currentVideo.title,
          trimIn: currentVideo.trimIn,
          trimOut: currentVideo.trimOut,
          notes: `Cut to track ${currentQueueIndex + 1}`
        });
      }
    }

    // Update last state
    lastStateRef.current = {
      isPlaying,
      currentQueueIndex,
      videoEffects: { ...videoEffects },
      audioEffects: { ...audioEffects }
    };
  }, [isPlaying, currentQueueIndex, queueItems, videoEffects, audioEffects]);

  // Export EDL as file
  const exportEDL = () => {
    if (!currentSession) return;

    // Create detailed EDL text format
    const edlText = [
      `STATIC BUFFET EDL - ${currentSession.name}`,
      `Session ID: ${currentSession.id}`,
      `Date: ${new Date(currentSession.startTime).toLocaleString()}`,
      `Duration: ${currentSession.totalDuration || 'In Progress'}`,
      `Venue: ${currentSession.venue || 'N/A'}`,
      `Theme: ${currentSession.metadata?.theme || 'Unknown'}`,
      `Total Events: ${events.length}`,
      ``,
      `EVENT LOG:`,
      `========================================`,
      ...events.map((event, index) => {
        const time = new Date(event.timestamp).toLocaleTimeString();
        return [
          `${(index + 1).toString().padStart(3, '0')}. [${time}] ${event.eventType.toUpperCase()}`,
          `     Clip: ${event.clipTitle}`,
          `     Timecode: ${event.timecode} (${event.trimIn} - ${event.trimOut})`,
          event.notes ? `     Notes: ${event.notes}` : '',
          event.parameters ? `     Parameters: ${JSON.stringify(event.parameters)}` : '',
          ``,
        ].filter(Boolean).join('\n');
      }),
      ``,
      `END OF EDL`,
    ].join('\n');

    // Download as text file
    const blob = new Blob([edlText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSession.name.replace(/[^a-z0-9]/gi, '_')}_EDL.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "EDL Exported",
      description: `Edit Decision List saved as ${a.download}`,
    });
  };

  // Export EDL as JSON
  const exportEDLJSON = () => {
    if (!currentSession) return;

    const jsonData = {
      ...currentSession,
      events: events,
      exportedAt: new Date().toISOString(),
      format: 'static-buffet-edl-v1'
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSession.name.replace(/[^a-z0-9]/gi, '_')}_EDL.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "EDL JSON Exported",
      description: `Machine-readable EDL saved as ${a.download}`,
    });
  };

  return (
    <div className="space-y-3">
      {/* Recording Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isRecording ? (
            <Badge className={`${theme.recording} flex items-center space-x-1`}>
              <CircleDot size={12} />
              <span>REC</span>
              <Timer size={12} />
              <span>{formatDuration(recordingDuration)}</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center space-x-1">
              <Square size={12} />
              <span>Standby</span>
            </Badge>
          )}
          
          {eventCount > 0 && (
            <Badge className={theme.badge}>
              {eventCount} events
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {!isRecording ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className={theme.button}
                  data-testid="button-start-edl-recording"
                >
                  <CircleDot size={14} className="mr-1" />
                  Record Set
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Start EDL Recording</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Session Name *</Label>
                    <Input
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      placeholder="e.g., Club Night, Wedding Set, Practice Session"
                      data-testid="input-session-name"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Venue</Label>
                    <Input
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="e.g., The Underground, Studio A"
                      data-testid="input-venue"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Optional notes about this session..."
                      rows={3}
                      data-testid="textarea-description"
                    />
                  </div>
                  <Button
                    onClick={startRecording}
                    className={`w-full ${theme.recording}`}
                    data-testid="button-confirm-start-recording"
                  >
                    <CircleDot size={16} className="mr-2" />
                    Start Recording
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              onClick={stopRecording}
              size="sm"
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              data-testid="button-stop-edl-recording"
            >
              <Square size={14} className="mr-1" />
              Stop
            </Button>
          )}

          {currentSession && (
            <div className="flex space-x-1">
              <Button
                onClick={exportEDL}
                size="sm"
                variant="outline"
                title="Export as readable text"
                data-testid="button-export-edl-text"
              >
                <FileText size={14} />
              </Button>
              <Button
                onClick={exportEDLJSON}
                size="sm"
                variant="outline"
                title="Export as JSON data"
                data-testid="button-export-edl-json"
              >
                <Download size={14} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Live Event Feed (only during recording) */}
      {isRecording && events.length > 0 && (
        <Card className="border-2 border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Clock size={14} />
              <span>Live Event Log</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32">
              <div className="space-y-1">
                {events.slice(-5).map((event, index) => (
                  <div key={event.id} className="text-xs opacity-75 flex items-center space-x-2">
                    <span className="font-mono">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {event.eventType}
                    </Badge>
                    <span className="truncate">{event.clipTitle}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Session Summary */}
      {currentSession && !isRecording && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Last Session: {currentSession.name}</span>
              <Badge className={theme.badge}>
                {events.length} events
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Duration:</span> {currentSession.totalDuration}
              </div>
              <div>
                <span className="font-medium">Cuts:</span> {currentSession.metadata?.totalCuts}
              </div>
              <div>
                <span className="font-medium">Clips:</span> {currentSession.metadata?.totalClips}
              </div>
              <div>
                <span className="font-medium">Theme:</span> {currentSession.metadata?.theme}
              </div>
            </div>
            {currentSession.venue && (
              <div>
                <span className="font-medium">Venue:</span> {currentSession.venue}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}