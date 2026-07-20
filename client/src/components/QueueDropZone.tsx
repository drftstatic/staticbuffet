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
            if (!dragData)
                return;
            const { video, type, sourceType } = JSON.parse(dragData);
            if (type === 'video' && sourceType === 'search') {
                console.log('🎬 Adding dropped video to queue:', video.identifier);
                // Get metadata and add to queue
                const metadata = await getVideoMetadata(video.identifier);
                let videoUrl = metadata.streamUrl;
                if (!videoUrl && metadata.videoFile) {
                    videoUrl = `/api/video/${video.identifier}/${encodeURIComponent(metadata.videoFile.name)}`;
                }
                else if (!videoUrl) {
                    console.error(`❌ No streamUrl available for ${video.identifier}`);
                    throw new Error(`Video ${video.identifier} has no playable stream URL. Please try a different video.`);
                }
                addToQueue(video, videoUrl);
                console.log('✅ Video added to queue via drag-and-drop');
            }
        }
        catch (error) {
            console.error('❌ Failed to add dropped video to queue:', error);
        }
        finally {
            setIsDropping(false);
        }
    };
    const getThemeClasses = () => {
        {
            return {
                base: 'border-lime-500/50 bg-lime-500/10',
                active: 'border-lime-400 bg-lime-500/20',
                text: 'text-lime-300'
            };
        }
    };
    const theme = getThemeClasses();
    return (<div className={`
        min-h-[140px] border-2 border-dashed rounded-lg 
        flex items-center justify-center transition-all duration-200
        ${isDragOver ? theme.active : theme.base}
        ${isDropping ? 'animate-pulse' : ''}
        ${className}
      `} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} data-testid="queue-drop-zone">
      <div className={`text-center p-6 ${theme.text} space-y-2`}>
        {isDropping ? (<>
            <div className="animate-spin w-6 h-6 border-2 border-current border-t-transparent rounded-full mx-auto"/>
            <p className="text-sm font-medium">Adding to queue...</p>
          </>) : isDragOver ? (<>
            <Plus className="w-8 h-8 mx-auto"/>
            <p className="text-sm font-medium">Drop video here to add to queue</p>
          </>) : (<>
            <Plus className="w-6 h-6 mx-auto opacity-60"/>
            <p className="text-sm font-medium">Drag videos from search results</p>
            <p className="text-xs opacity-75">or use the + button</p>
          </>)}
      </div>
    </div>);
}
