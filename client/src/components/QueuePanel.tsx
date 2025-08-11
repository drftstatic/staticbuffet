import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Trash2, GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useStore } from '@/lib/store';
import { Player } from './Player';
import { ExportMenu } from './ExportMenu';

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
    <div className={`h-full overflow-y-auto rounded-xl shadow-lg ${
      brandSkin === 'diner' ? 'glass' : 'glass-dark'
    }`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold font-inter ${
            brandSkin === 'diner' ? 'text-gray-800' : 'text-gray-100'
          }`}>
            Queue
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {queueItems.length} clips • {calculateTotalDuration()}
            </span>
            {queueItems.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={clearQueue}
                data-testid="button-clear-queue"
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-red-600"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Export Controls */}
        <ExportMenu />

        {/* Queue Items */}
        {queueItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No clips in queue</p>
            <p className="text-xs mt-1">Add videos from search results</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="queue">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {queueItems.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                          data-testid={`queue-item-${item.id}`}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              {...provided.dragHandleProps}
                              className="flex-shrink-0 mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                              <GripVertical size={16} />
                            </div>
                            <div className="flex-shrink-0">
                              <img
                                src={`https://archive.org/services/img/${item.identifier}`}
                                alt={item.title}
                                className="w-12 h-8 object-cover rounded bg-gray-200 dark:bg-gray-700"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/60x40/e5e7eb/6b7280?text=${encodeURIComponent(item.title.slice(0, 2))}`;
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-100 font-inter truncate">
                                {item.title}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {item.duration}
                              </p>
                              
                              {/* Trim Controls */}
                              <div className="mt-2 space-y-1">
                                <div className="flex items-center space-x-2 text-xs">
                                  <span className="text-gray-600 dark:text-gray-400">In:</span>
                                  <Input
                                    type="text"
                                    value={item.trimIn}
                                    onChange={(e) => updateQueueItem(item.id, { trimIn: e.target.value })}
                                    className="w-16 px-1 py-0.5 text-xs h-6 border-gray-300 dark:border-gray-600"
                                    data-testid={`input-trim-in-${item.id}`}
                                  />
                                  <span className="text-gray-600 dark:text-gray-400">Out:</span>
                                  <Input
                                    type="text"
                                    value={item.trimOut}
                                    onChange={(e) => updateQueueItem(item.id, { trimOut: e.target.value })}
                                    className="w-16 px-1 py-0.5 text-xs h-6 border-gray-300 dark:border-gray-600"
                                    data-testid={`input-trim-out-${item.id}`}
                                  />
                                </div>
                                <div className="flex items-center space-x-3">
                                  <label className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                    <Checkbox
                                      checked={item.loop}
                                      onCheckedChange={(checked) => updateQueueItem(item.id, { loop: !!checked })}
                                      className="mr-1 h-3 w-3"
                                      data-testid={`checkbox-loop-${item.id}`}
                                    />
                                    Loop
                                  </label>
                                  <label className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                    <Checkbox
                                      checked={item.crossfade}
                                      onCheckedChange={(checked) => updateQueueItem(item.id, { crossfade: !!checked })}
                                      className="mr-1 h-3 w-3"
                                      data-testid={`checkbox-crossfade-${item.id}`}
                                    />
                                    Crossfade
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromQueue(item.id)}
                                data-testid={`button-remove-${item.id}`}
                                className="p-1 text-gray-400 hover:text-red-600"
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {/* Player Controls */}
        <Player />
      </div>
    </div>
  );
}
