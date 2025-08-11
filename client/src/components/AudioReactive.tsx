import { useState, useEffect } from 'react';
import { Mic, MicOff, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useStore } from '@/lib/store';
import { AudioReactiveController } from '@/lib/audio-reactive';
import { useToast } from '@/hooks/use-toast';

export function AudioReactive() {
  const { isAudioReactive, setAudioReactive, nextTrack } = useStore();
  const { toast } = useToast();
  const [controller] = useState(() => new AudioReactiveController());
  const [isInitialized, setIsInitialized] = useState(false);
  const [threshold, setThreshold] = useState(128);
  const [cooldown, setCooldown] = useState(500);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    return () => {
      controller.dispose();
    };
  }, [controller]);

  const handleToggle = async () => {
    if (!isAudioReactive) {
      // Start audio reactive mode
      if (!isInitialized) {
        const success = await controller.initialize();
        if (!success) {
          toast({
            title: "Microphone Access Denied",
            description: "Please allow microphone access to use audio reactive features",
            variant: "destructive",
          });
          return;
        }
        setIsInitialized(true);
      }

      controller.setThreshold(threshold);
      controller.setCooldown(cooldown);
      controller.start(() => {
        // Beat detected - advance to next track
        nextTrack();
      });

      setAudioReactive(true);
      
      toast({
        title: "Audio Reactive Enabled",
        description: "Video will switch on beat detection",
      });
    } else {
      // Stop audio reactive mode
      controller.stop();
      setAudioReactive(false);
      
      toast({
        title: "Audio Reactive Disabled",
        description: "Manual control restored",
      });
    }
  };

  const handleThresholdChange = (value: number[]) => {
    const newThreshold = value[0];
    setThreshold(newThreshold);
    if (isAudioReactive) {
      controller.setThreshold(newThreshold);
    }
  };

  const handleCooldownChange = (value: number[]) => {
    const newCooldown = value[0];
    setCooldown(newCooldown);
    if (isAudioReactive) {
      controller.setCooldown(newCooldown);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Audio Reactive Toggle */}
      <Button
        onClick={handleToggle}
        data-testid="button-audio-reactive"
        className={`px-2 py-2 rounded-lg transition-all duration-200 ${
          isAudioReactive
            ? 'bg-red-600 hover:bg-red-700 dark:bg-lime-500 dark:hover:bg-lime-400 text-white dark:text-black'
            : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
        }`}
        title={isAudioReactive ? "Disable Audio Reactive" : "Enable Audio Reactive"}
      >
        {isAudioReactive ? <Mic size={16} /> : <MicOff size={16} />}
      </Button>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            data-testid="button-audio-settings"
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <Settings size={16} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Audio Reactive Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium">
                Beat Detection Threshold
              </Label>
              <div className="mt-2">
                <Slider
                  value={[threshold]}
                  onValueChange={handleThresholdChange}
                  min={50}
                  max={200}
                  step={10}
                  className="w-full"
                  data-testid="slider-threshold"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Sensitive (50)</span>
                  <span>Current: {threshold}</span>
                  <span>Less Sensitive (200)</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Lower values = more sensitive to quiet sounds
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Cooldown Period (ms)
              </Label>
              <div className="mt-2">
                <Slider
                  value={[cooldown]}
                  onValueChange={handleCooldownChange}
                  min={100}
                  max={2000}
                  step={100}
                  className="w-full"
                  data-testid="slider-cooldown"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Fast (100ms)</span>
                  <span>Current: {cooldown}ms</span>
                  <span>Slow (2000ms)</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Minimum time between track changes to prevent rapid switching
              </p>
            </div>

            <div className="pt-4">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>Tip:</strong> Audio reactive mode works best with music that has clear beats. 
                  Adjust the threshold if switches are too frequent or infrequent.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setIsSettingsOpen(false)}
                data-testid="button-close-audio-settings"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
