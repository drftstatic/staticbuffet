import { useState } from 'react';
import { Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store';
import { generateEmergencyMix, type EmergencyMixOptions } from '@/lib/emergency-mix';
import { useToast } from '@/hooks/use-toast';

export function EmergencyMix() {
  const { searchResults, queueItems, setQueueItems, brandSkin } = useStore();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<EmergencyMixOptions>({
    duration: 150, // 2.5 minutes
    segmentLength: [2, 5],
    crossfadeDuration: 0.5,
    maxClips: 10,
  });

  const handleGenerateMix = () => {
    console.log('EmergencyMix: handleGenerateMix called');
    console.log('EmergencyMix: searchResults.length =', searchResults.length);
    try {
      if (searchResults.length === 0) {
        toast({
          title: "No results available",
          description: "Search for videos first to generate an emergency mix",
          variant: "destructive",
        });
        return;
      }

      const mixItems = generateEmergencyMix(searchResults, options);
      
      // Replace current queue with emergency mix
      setQueueItems(mixItems);
      
      toast({
        title: "Emergency Mix Generated!",
        description: `Created ${mixItems.length} clips totaling ${Math.floor(options.duration / 60)}:${(options.duration % 60).toString().padStart(2, '0')}`,
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Mix Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate emergency mix",
        variant: "destructive",
      });
    }
  };

  const handleQuickMix = () => {
    handleGenerateMix();
  };

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'testcard':
        return 'bg-red-400/20 text-red-300 hover:bg-red-400/30 border-red-400/50';
      case 'waffle':
        return 'bg-red-400/20 text-red-600 hover:bg-red-400/30 border-red-400/50';
      case 'ebn':
        return 'bg-red-400/20 text-red-300 hover:bg-red-400/30 border-red-500/50';
      case 'ozzy':
        return 'bg-red-400/20 text-red-300 hover:bg-red-400/30 border-red-500/50';
      case 'hogan':
        return 'bg-red-400/20 text-red-300 hover:bg-red-400/30 border-red-400/50';
      case 'dx':
        return 'bg-red-400/20 text-red-300 hover:bg-red-400/30 border-red-500/50';
      case 'maxheadroom':
        return 'bg-red-400/20 text-red-300 hover:bg-red-400/30 border-red-500/50';
      case 'mario':
        return 'bg-red-400/20 text-red-300 hover:bg-red-400/30 border-red-400/50';
      case 'dakota':
        return 'bg-red-400/20 text-red-300 hover:bg-red-400/30 border-red-400/50';
      case 'blondie':
        return 'bg-red-400/20 text-red-300 hover:bg-red-400/30 border-red-400/50';
      default:
        return 'bg-red-400/20 text-red-300 hover:bg-red-400/30 border-red-400/50';
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Quick Emergency Mix */}
      <Button
        onClick={handleQuickMix}
        disabled={searchResults.length === 0}
        data-testid="button-emergency-mix"
        data-tour-target="emergency-mix"
        className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-colors ${getThemeClasses()}`}
        title="Emergency Mix - Generate instant mix"
      >
        <Zap size={14} />
      </Button>

      {/* Advanced Options Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            data-testid="button-mix-settings"
            className="h-6 w-6 p-1 text-gray-400 hover:text-gray-200 hover:bg-white/10 rounded"
          >
            <Settings size={12} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Emergency Mix Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="duration" className="text-sm font-medium">
                Total Duration (seconds)
              </Label>
              <Input
                id="duration"
                type="number"
                value={options.duration}
                onChange={(e) => setOptions(prev => ({ ...prev, duration: parseInt(e.target.value) || 150 }))}
                className="mt-1"
                min="30"
                max="600"
                data-testid="input-mix-duration"
              />
              <p className="text-xs text-gray-500 mt-1">
                {Math.floor(options.duration / 60)}:{(options.duration % 60).toString().padStart(2, '0')} total
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="segmentMin" className="text-sm font-medium">
                  Min Segment (sec)
                </Label>
                <Input
                  id="segmentMin"
                  type="number"
                  value={options.segmentLength[0]}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    segmentLength: [parseInt(e.target.value) || 2, prev.segmentLength[1]] 
                  }))}
                  className="mt-1"
                  min="1"
                  max="30"
                  data-testid="input-segment-min"
                />
              </div>
              <div>
                <Label htmlFor="segmentMax" className="text-sm font-medium">
                  Max Segment (sec)
                </Label>
                <Input
                  id="segmentMax"
                  type="number"
                  value={options.segmentLength[1]}
                  onChange={(e) => setOptions(prev => ({ 
                    ...prev, 
                    segmentLength: [prev.segmentLength[0], parseInt(e.target.value) || 5] 
                  }))}
                  className="mt-1"
                  min="2"
                  max="60"
                  data-testid="input-segment-max"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="maxClips" className="text-sm font-medium">
                Max Clips to Use
              </Label>
              <Input
                id="maxClips"
                type="number"
                value={options.maxClips}
                onChange={(e) => setOptions(prev => ({ ...prev, maxClips: parseInt(e.target.value) || 10 }))}
                className="mt-1"
                min="3"
                max="50"
                data-testid="input-max-clips"
              />
            </div>

            <div>
              <Label htmlFor="crossfade" className="text-sm font-medium">
                Crossfade Duration (seconds)
              </Label>
              <Input
                id="crossfade"
                type="number"
                step="0.1"
                value={options.crossfadeDuration}
                onChange={(e) => setOptions(prev => ({ ...prev, crossfadeDuration: parseFloat(e.target.value) || 0.5 }))}
                className="mt-1"
                min="0"
                max="2"
                data-testid="input-crossfade"
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                data-testid="button-cancel-mix"
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateMix}
                disabled={searchResults.length === 0}
                data-testid="button-generate-mix"
                className="bg-red-600 hover:bg-red-700 dark:bg-orange-500 dark:hover:bg-orange-400 text-white dark:text-black"
              >
                Generate Mix
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
