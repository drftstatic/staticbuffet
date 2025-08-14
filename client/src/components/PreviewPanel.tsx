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
      console.log('🎯 PreviewPanel: Fetching metadata for preview:', selectedVideo.identifier);
      setIsLoadingUrl(true);
      getVideoMetadata(selectedVideo.identifier)
        .then((metadata) => {
          console.log('📺 PreviewPanel: Got metadata:', { 
            identifier: selectedVideo.identifier, 
            hasStreamUrl: !!metadata.streamUrl,
            streamUrl: metadata.streamUrl?.substring(0, 100) + '...'
          });
          if (metadata.streamUrl) {
            setSelectedVideoUrl(metadata.streamUrl);
          } else {
            console.warn('⚠️ PreviewPanel: No streamUrl in metadata');
            setSelectedVideoUrl(null);
          }
        })
        .catch((error) => {
          console.error('❌ PreviewPanel: Failed to get video metadata for preview:', error);
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
        if (nextVideo) {
          // Queue items already have the videoUrl, unlike search results
          return {
            identifier: nextVideo.identifier,
            title: nextVideo.title,
            creator: nextVideo.creator,
            videoUrl: nextVideo.videoUrl
          };
        }
        return null;
      default:
        return null;
    }
  };

  const previewVideo = getPreviewVideo();
  
  // Debug logging
  useEffect(() => {
    console.log('🎯 PreviewPanel state:', {
      previewSource,
      hasSelectedVideo: !!selectedVideo,
      selectedVideoId: selectedVideo?.identifier,
      selectedVideoUrl,
      isLoadingUrl,
      hasPreviewVideo: !!previewVideo,
      previewVideoUrl: previewVideo?.videoUrl?.substring(0, 50) + '...',
      queueLength: queueItems.length,
      currentQueueIndex,
      hasNextInQueue: !!(queueItems[currentQueueIndex + 1])
    });
  }, [previewSource, selectedVideo, selectedVideoUrl, isLoadingUrl, previewVideo, queueItems, currentQueueIndex]);

  return (
    <div className="space-y-1 p-2">
      {/* Header with Source Selection */}
      <div className="flex items-center justify-between">
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


      {isExpanded && (
        <PreviewWindow
          videoUrl={previewVideo?.videoUrl}
          video={previewVideo}
          className="w-full"
        />
      )}

    </div>
  );
}