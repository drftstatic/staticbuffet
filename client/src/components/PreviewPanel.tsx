import React, { useState, useEffect } from 'react';
import { PreviewWindow } from './PreviewWindow';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Eye, Monitor, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { getVideoMetadata } from '@/lib/archive-api';

export function PreviewPanel() {
  const { 
    searchResults, 
    selectedVideo, 
    queueItems,
    currentQueueIndex 
  } = useStore();

  const [previewSource, setPreviewSource] = useState<'selected' | 'queue' | 'none'>('selected');
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  // Fetch video URL when selected video changes
  useEffect(() => {
    if (selectedVideo && previewSource === 'selected') {
      setIsLoadingUrl(true);
      getVideoMetadata(selectedVideo.identifier)
        .then((metadata) => {
          if (metadata.streamUrl) {
            setSelectedVideoUrl(metadata.streamUrl);
          }
        })
        .catch((error) => {
          console.error('Failed to get video metadata for preview:', error);
          setSelectedVideoUrl(null);
        })
        .finally(() => {
          setIsLoadingUrl(false);
        });
    } else if (previewSource !== 'selected') {
      setSelectedVideoUrl(null);
    }
  }, [selectedVideo, previewSource]);

  // Get preview video based on current source
  const getPreviewVideo = () => {
    switch (previewSource) {
      case 'selected':
        return selectedVideo ? {
          ...selectedVideo,
          videoUrl: selectedVideoUrl
        } : null;
      case 'queue':
        const nextVideo = queueItems[currentQueueIndex + 1];
        return nextVideo ? { 
          ...nextVideo.video, 
          videoUrl: nextVideo.videoUrl 
        } : null;
      default:
        return null;
    }
  };

  const previewVideo = getPreviewVideo();

  return (
    <div className="space-y-3 p-4 max-h-[600px] overflow-y-auto">
      {/* Header with Source Selection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-blue-500" />
          <span className="font-medium text-sm">Preview Window</span>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Source Selection Buttons */}
          <Button
            onClick={() => setPreviewSource('selected')}
            size="sm"
            variant={previewSource === 'selected' ? 'default' : 'ghost'}
            className="h-7 px-2 text-xs"
            title="Preview Selected Video"
          >
            <Monitor size={12} className="mr-1" />
            Selected
          </Button>
          
          <Button
            onClick={() => setPreviewSource('queue')}
            size="sm"
            variant={previewSource === 'queue' ? 'default' : 'ghost'}
            className="h-7 px-2 text-xs"
            title="Preview Next in Queue"
          >
            <Play size={12} className="mr-1" />
            Next
          </Button>

          {/* Expand/Collapse */}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            title={isExpanded ? "Collapse Preview" : "Expand Preview"}
          >
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </Button>
        </div>
      </div>

      {/* Preview Status */}
      <div className="text-xs text-gray-500">
        {previewSource === 'selected' && selectedVideo && (
          <span>
            {isLoadingUrl ? 'Loading preview...' : 'Previewing: Selected video from search results'}
          </span>
        )}
        {previewSource === 'queue' && queueItems[currentQueueIndex + 1] && (
          <span>Previewing: Next video in queue</span>
        )}
        {!previewVideo && !isLoadingUrl && (
          <span>
            {previewSource === 'selected' 
              ? 'No video selected - click a video from search results'
              : 'No next video in queue'
            }
          </span>
        )}
      </div>

      {/* Preview Window */}
      {isExpanded && (
        <PreviewWindow
          videoUrl={previewVideo?.videoUrl}
          video={previewVideo}
          className="w-full"
        />
      )}

      {/* Quick Instructions */}
      {isExpanded && (
        <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400">
          <h4 className="font-medium mb-1">Preview Controls:</h4>
          <ul className="space-y-1 text-xs">
            <li>• <strong>Selected:</strong> Preview videos from search results</li>
            <li>• <strong>Next:</strong> Preview the next video in your queue</li>
            <li>• <strong>Cue:</strong> Send preview video to program output</li>
            <li>• Preview is muted by default - use volume slider to hear audio</li>
          </ul>
        </div>
      )}
    </div>
  );
}