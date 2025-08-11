import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getVideoMetadata } from '@/lib/archive-api';
import { type VideoResult } from '@/lib/types';

interface QueueDropZoneProps {
  className?: string;
}

export function QueueDropZone({ className = '' }: QueueDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const { addToQueue, brandSkin } = useStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only hide if we're leaving the drop zone itself, not a child element
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setIsDropping(true);

    try {
      const dragData = e.dataTransfer.getData('application/json');
      if (!dragData) return;

      const { video, type, sourceType } = JSON.parse(dragData);
      
      if (type === 'video' && sourceType === 'search') {
        console.log('🎬 Adding dropped video to queue:', video.identifier);
        
        // Get metadata and add to queue
        const metadata = await getVideoMetadata(video.identifier);
        let videoUrl = metadata.streamUrl;
        if (!videoUrl && metadata.videoFile) {
          videoUrl = `https://archive.org/download/${video.identifier}/${metadata.videoFile.name}`;
        } else if (!videoUrl) {
          videoUrl = `https://archive.org/download/${video.identifier}/${video.identifier}.mp4`;
          console.warn(`⚠️ Using fallback URL for ${video.identifier}: ${videoUrl}`);
        }
        
        addToQueue(video, videoUrl);
        console.log('✅ Video added to queue via drag-and-drop');
      }
    } catch (error) {
      console.error('❌ Failed to add dropped video to queue:', error);
    } finally {
      setIsDropping(false);
    }
  };

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'waffle':
        return {
          base: 'border-yellow-400/50 bg-yellow-50/30',
          active: 'border-yellow-500 bg-yellow-100/50',
          text: 'text-yellow-700'
        };
      case 'ebn':
        return {
          base: 'border-lime-500/50 bg-lime-900/20',
          active: 'border-lime-400 bg-lime-900/40',
          text: 'text-lime-400'
        };
      default:
        return {
          base: 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800',
          active: 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20',
          text: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div
      className={`
        min-h-[120px] border-2 border-dashed rounded-lg 
        flex items-center justify-center transition-all duration-200
        ${isDragOver ? theme.active : theme.base}
        ${isDropping ? 'animate-pulse' : ''}
        ${className}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid="queue-drop-zone"
    >
      <div className={`text-center p-4 ${theme.text}`}>
        {isDropping ? (
          <>
            <div className="animate-spin w-6 h-6 border-2 border-current border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm">Adding to queue...</p>
          </>
        ) : isDragOver ? (
          <>
            <Plus className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Drop video here to add to queue</p>
          </>
        ) : (
          <>
            <Plus className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Drag videos from search results</p>
            <p className="text-xs opacity-75 mt-1">or use the + button</p>
          </>
        )}
      </div>
    </div>
  );
}