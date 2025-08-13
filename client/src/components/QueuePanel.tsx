import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Trash2, GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { QueueDropZone } from './QueueDropZone';

export function QueuePanel() {
  const { 
    queueItems, 
    removeFromQueue, 
    updateQueueItem, 
    reorderQueue, 
    clearQueue,
    brandSkin
  } = useStore();

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    reorderQueue(result.source.index, result.destination.index);
  };

  const calculateTotalDuration = () => {
    let totalSeconds = 0;
    queueItems.forEach(item => {
      const startSeconds = parseTimeToSeconds(item.trimIn);
      const endSeconds = parseTimeToSeconds(item.trimOut);
      totalSeconds += Math.max(0, endSeconds - startSeconds);
    });
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const parseTimeToSeconds = (time: string): number => {
    const parts = time.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  return (
    <div className="h-full">
      {queueItems.length === 0 ? (
        <QueueDropZone className="h-full" />
      ) : (
        <div className="flex items-center space-x-2 h-full overflow-x-auto">
          {/* Timeline Segments */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="queue" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex items-center space-x-2 h-full"
                >
                {queueItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`h-16 w-24 rounded border-2 flex flex-col items-center justify-center text-xs font-mono cursor-pointer transition-all relative group ${
                          snapshot.isDragging 
                            ? 'shadow-lg scale-105' 
                            : 'hover:scale-102'
                        } ${
                          brandSkin === 'waffle' 
                            ? 'border-amber-400/50 bg-yellow-100/50 hover:bg-yellow-200/50' 
                            : 'border-yellow-400/50 bg-purple-800/50 hover:bg-purple-700/50'
                        }`}
                      >
                        <div className="truncate w-full text-center px-1">
                          {item.title.slice(0, 10)}
                        </div>
                        <div className="flex items-center justify-center space-x-1">
                          <div className="text-xs opacity-70">
                            {item.duration}
                          </div>
                          {(item.trimIn !== '00:00' || item.trimOut !== item.duration) && (
                            <div className="text-xs bg-orange-500 text-white px-1 rounded" title={`Trimmed: ${item.trimIn} - ${item.trimOut}`}>
                              ✂
                            </div>
                          )}
                          {item.loop && (
                            <div className="text-xs bg-primary text-primary-foreground px-1 rounded">
                              🔄
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => updateQueueItem(item.id, { loop: !item.loop })}
                          className="absolute -top-1 -left-1 w-4 h-4 bg-blue-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          title={item.loop ? "Disable loop" : "Enable loop"}
                        >
                          🔄
                        </button>
                        <button
                          onClick={() => removeFromQueue(item.id)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <div className={`h-16 w-24 rounded border-2 border-dashed flex items-center justify-center text-xs opacity-50 ${
                  brandSkin === 'waffle' ? 'border-amber-400/30' : 'border-yellow-400/30'
                }`}>
                  + Add
                </div>
              </div>
            )}
          </Droppable>
          </DragDropContext>
          
          {queueItems.length > 0 && (
            <div className="ml-4 flex items-center space-x-2">
              <span className="text-xs font-mono">
                {queueItems.length} clips • {calculateTotalDuration()}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearQueue}
                data-testid="button-clear-queue"
                className="text-xs hover:text-red-600"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}