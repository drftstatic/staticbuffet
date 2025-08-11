import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Repeat, Repeat1, RotateCcw } from 'lucide-react';
import { useStore } from '@/lib/store';

export function LoopControls() {
  const { 
    timelineLoop, 
    setTimelineLoop, 
    queueItems, 
    updateQueueItem 
  } = useStore();

  const loopingClips = queueItems.filter(item => item.loop);

  const toggleAllClipLoops = () => {
    const hasLoopingClips = loopingClips.length > 0;
    queueItems.forEach(item => {
      updateQueueItem(item.id, { loop: !hasLoopingClips });
    });
  };

  const clearAllLoops = () => {
    setTimelineLoop(false);
    queueItems.forEach(item => {
      updateQueueItem(item.id, { loop: false });
    });
  };

  return (
    <div className="space-y-4 p-4 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Repeat className="w-4 h-4 text-muted-foreground" />
          <Label className="text-sm font-medium">Loop Controls</Label>
        </div>
        {(timelineLoop || loopingClips.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllLoops}
            className="text-xs"
            data-testid="button-clear-loops"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {/* Timeline Loop */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Repeat className="w-3 h-3 text-muted-foreground" />
            <Label htmlFor="timeline-loop" className="text-xs">
              Loop Entire Timeline
            </Label>
            {timelineLoop && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                ON
              </Badge>
            )}
          </div>
          <Switch
            id="timeline-loop"
            checked={timelineLoop}
            onCheckedChange={setTimelineLoop}
            data-testid="switch-timeline-loop"
          />
        </div>

        {/* Individual Clip Loops */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Repeat1 className="w-3 h-3 text-muted-foreground" />
            <Label htmlFor="all-clips-loop" className="text-xs">
              Loop All Clips
            </Label>
            {loopingClips.length > 0 && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                {loopingClips.length}
              </Badge>
            )}
          </div>
          <Switch
            id="all-clips-loop"
            checked={loopingClips.length === queueItems.length && queueItems.length > 0}
            onCheckedChange={toggleAllClipLoops}
            data-testid="switch-all-clips-loop"
          />
        </div>

        {/* Status Information */}
        <div className="text-xs text-muted-foreground space-y-1">
          {timelineLoop && (
            <div>• Timeline will restart from beginning when last clip ends</div>
          )}
          {loopingClips.length > 0 && (
            <div>• {loopingClips.length} clip{loopingClips.length === 1 ? '' : 's'} set to loop individually</div>
          )}
          {!timelineLoop && loopingClips.length === 0 && (
            <div>• No loops active - timeline will stop at end</div>
          )}
        </div>
      </div>
    </div>
  );
}