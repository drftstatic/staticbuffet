import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Play,
  Pause,
  Settings,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/lib/store';
import { ttsService } from '@/lib/text-to-speech';

interface BrowserCapabilities {
  audioContext: boolean;
  mediaDevices: boolean;
  getUserMedia: boolean;
  audioPlayback: boolean;
  webAudioAPI: boolean;
  autoplay: boolean;
}

interface TestSound {
  id: string;
  name: string;
  frequency: number;
  duration: number;
  waveType: OscillatorType;
}

const TEST_SOUNDS: TestSound[] = [
  { id: 'beep', name: 'Beep (440Hz)', frequency: 440, duration: 0.3, waveType: 'sine' },
  { id: 'boop', name: 'Boop (220Hz)', frequency: 220, duration: 0.5, waveType: 'square' },
  { id: 'ping', name: 'Ping (880Hz)', frequency: 880, duration: 0.2, waveType: 'triangle' },
  { id: 'buzz', name: 'Buzz (150Hz)', frequency: 150, duration: 0.7, waveType: 'sawtooth' }
];

export function SoundboardTester() {
  const { toast } = useToast();
  const { brandSkin } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [capabilities, setCapabilities] = useState<BrowserCapabilities>({
    audioContext: false,
    mediaDevices: false,
    getUserMedia: false,
    audioPlayback: false,
    webAudioAPI: false,
    autoplay: false
  });
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [micPermission, setMicPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const [audioContextState, setAudioContextState] = useState<AudioContextState>('suspended');
  const [testProgress, setTestProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Check browser capabilities on mount
  useEffect(() => {
    checkBrowserCapabilities();
    checkMicrophonePermission();
  }, []);

  const checkBrowserCapabilities = () => {
    const caps: BrowserCapabilities = {
      audioContext: !!(window.AudioContext || (window as any).webkitAudioContext),
      mediaDevices: !!navigator.mediaDevices,
      getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      audioPlayback: !!document.createElement('audio').canPlayType,
      webAudioAPI: !!(window.AudioContext || (window as any).webkitAudioContext),
      autoplay: true // We'll test this dynamically
    };
    setCapabilities(caps);
  };

  const checkMicrophonePermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setMicPermission(permission.state);
      
      permission.addEventListener('change', () => {
        setMicPermission(permission.state);
      });
    } catch (error) {
      setMicPermission('unknown');
    }
  };

  const initializeAudioContext = async () => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      setAudioContextState(audioContextRef.current.state);
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      toast({
        title: "Audio Context Error",
        description: "Failed to initialize Web Audio API",
        variant: "destructive",
      });
      return false;
    }
  };

  const testMicrophoneAccess = async () => {
    try {
      setCurrentTest('Testing microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setMicPermission('granted');
      
      toast({
        title: "Microphone Access Granted",
        description: "Audio reactive features should work properly",
      });
      
      // Stop the stream after testing
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      setMicPermission('denied');
      toast({
        title: "Microphone Access Denied",
        description: "Audio reactive features will not work. Please allow microphone access.",
        variant: "destructive",
      });
      return false;
    }
  };

  const playTestSound = async (sound: TestSound) => {
    if (!audioContextRef.current) {
      const success = await initializeAudioContext();
      if (!success) return;
    }

    try {
      const oscillator = audioContextRef.current!.createOscillator();
      const gainNode = audioContextRef.current!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current!.destination);

      oscillator.frequency.setValueAtTime(sound.frequency, audioContextRef.current!.currentTime);
      oscillator.type = sound.waveType;

      gainNode.gain.setValueAtTime(0.3, audioContextRef.current!.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current!.currentTime + sound.duration);

      oscillator.start(audioContextRef.current!.currentTime);
      oscillator.stop(audioContextRef.current!.currentTime + sound.duration);

      toast({
        title: `🔊 ${sound.name}`,
        description: `Playing ${sound.frequency}Hz ${sound.waveType} wave`,
        duration: 1000,
      });
    } catch (error) {
      console.error('Failed to play test sound:', error);
      toast({
        title: "Audio Playback Error",
        description: "Failed to play test sound",
        variant: "destructive",
      });
    }
  };

  const runFullAudioTest = async () => {
    setIsTestingAudio(true);
    setTestProgress(0);

    try {
      // Test 1: Audio Context
      setCurrentTest('Initializing Audio Context...');
      setTestProgress(20);
      const audioContextSuccess = await initializeAudioContext();
      await new Promise(resolve => setTimeout(resolve, 500));

      // Test 2: Microphone Access
      setCurrentTest('Testing Microphone Access...');
      setTestProgress(40);
      const micSuccess = await testMicrophoneAccess();
      await new Promise(resolve => setTimeout(resolve, 500));

      // Test 3: Audio Playback
      setCurrentTest('Testing Audio Playback...');
      setTestProgress(60);
      await playTestSound(TEST_SOUNDS[0]);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test 4: Web Audio API Features
      setCurrentTest('Testing Web Audio API Features...');
      setTestProgress(80);
      await playTestSound(TEST_SOUNDS[1]);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCurrentTest('Tests Complete!');
      setTestProgress(100);

      toast({
        title: "Audio Tests Complete",
        description: `Audio Context: ${audioContextSuccess ? '✓' : '✗'}, Microphone: ${micSuccess ? '✓' : '✗'}`,
      });

    } catch (error) {
      console.error('Audio test failed:', error);
      toast({
        title: "Audio Test Failed",
        description: "Some audio features may not work properly",
        variant: "destructive",
      });
    } finally {
      setIsTestingAudio(false);
      setTimeout(() => {
        setTestProgress(0);
        setCurrentTest('');
      }, 2000);
    }
  };

  const getCapabilityIcon = (supported: boolean) => {
    return supported ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'granted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'denied':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'prompt':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'testcard':
        return 'bg-slate-900/95 border-blue-400/60 text-blue-100';
      case 'waffle':
        return 'bg-amber-50/95 border-amber-500/60 text-amber-900';
      case 'ebn':
        return 'bg-gray-900/95 border-lime-400/60 text-lime-100';
      case 'ozzy':
        return 'bg-red-950/95 border-red-400/60 text-red-100';
      case 'hogan':
        return 'bg-yellow-950/95 border-yellow-400/60 text-yellow-100';
      case 'dx':
        return 'bg-pink-950/95 border-pink-400/60 text-pink-100';
      case 'maxheadroom':
        return 'bg-green-950/95 border-green-400/60 text-green-100';
      case 'mario':
        return 'bg-red-950/95 border-yellow-400/60 text-yellow-100';
      case 'dakota':
        return 'bg-gray-900/95 border-gray-400/60 text-gray-100';
      case 'blondie':
        return 'bg-amber-950/95 border-amber-400/60 text-amber-100';
      default:
        return 'bg-slate-900/95 border-blue-400/60 text-blue-100';
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-40"
        data-testid="button-soundboard-tester"
      >
        <Volume2 className="w-4 h-4 mr-2" />
        Test Audio
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`sm:max-w-lg ${getThemeClasses()}`}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold">Audio Test</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Browser Capabilities */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Browser Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Audio Context</span>
                    {getCapabilityIcon(capabilities.audioContext)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Web Audio API</span>
                    {getCapabilityIcon(capabilities.webAudioAPI)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Microphone</span>
                    {getPermissionIcon(micPermission)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audio Context Status */}
            <div className="flex items-center justify-between">
              <Badge variant={audioContextState === 'running' ? 'default' : 'secondary'}>
                Audio: {audioContextState}
              </Badge>
              <Button
                onClick={initializeAudioContext}
                variant="outline"
                size="sm"
                disabled={audioContextState === 'running'}
              >
                {audioContextState === 'running' ? 'Ready' : 'Initialize'}
              </Button>
            </div>

            {/* Test Sounds */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Test Audio Playback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {TEST_SOUNDS.slice(0, 2).map((sound) => (
                    <Button
                      key={sound.id}
                      onClick={() => playTestSound(sound)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      data-testid={`button-test-sound-${sound.id}`}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      {sound.name.split(' ')[0]}
                    </Button>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 gap-2 mb-3">
                  <Button
                    onClick={() => ttsService.speak('Testing speech synthesis', 'mario')}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    data-testid="button-test-tts"
                  >
                    <Volume2 className="w-3 h-3 mr-1" />
                    Test Speech
                  </Button>
                </div>
                
                <Button
                  onClick={runFullAudioTest}
                  disabled={isTestingAudio}
                  className="w-full"
                  size="sm"
                  data-testid="button-run-full-test"
                >
                  {isTestingAudio ? (
                    <div className="flex items-center space-x-2">
                      <Settings className="w-4 h-4 animate-spin" />
                      <span>Testing...</span>
                    </div>
                  ) : (
                    'Run Full Audio Test'
                  )}
                </Button>

                {isTestingAudio && (
                  <div className="mt-3 space-y-2">
                    <Progress value={testProgress} className="w-full" />
                    <p className="text-xs text-center opacity-70">{currentTest}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Quick Fix:</strong> Click anywhere on the page first, then test sounds. 
                Allow microphone access for audio-reactive features.
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}