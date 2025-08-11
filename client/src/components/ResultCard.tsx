import { useState, useEffect, useCallback } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LicenseBadge } from './LicenseBadge';
import { type VideoResult } from '@/lib/types';
import { generateThumbnailUrl, preloadThumbnail } from '@/lib/archive-api';
import { useStore } from '@/lib/store';
import { ThumbnailSkeleton } from './SkeletonLoader';

interface ResultCardProps {
  video: VideoResult;
  onSelect: (video: VideoResult) => void;
  onAddToQueue: (video: VideoResult) => void;
}

export function ResultCard({ video, onSelect, onAddToQueue }: ResultCardProps) {
  const { brandSkin } = useStore();
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showHoverInfo, setShowHoverInfo] = useState(false);
  const maxRetries = 3;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToQueue(video);
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'video',
      video: video,
      sourceType: 'search'
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Preload thumbnail with retry logic
  const loadThumbnail = useCallback(async () => {
    if (retryCount >= maxRetries) return;

    try {
      setThumbnailError(false);
      const url = await preloadThumbnail(video.identifier);
      setThumbnailUrl(url);
      setThumbnailLoaded(true);
    } catch (error) {
      console.warn(`Thumbnail load failed for ${video.identifier}:`, error);
      setThumbnailError(true);
      
      // Retry with exponential backoff
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, Math.pow(2, retryCount) * 1000);
      }
    }
  }, [video.identifier, retryCount, maxRetries]);

  useEffect(() => {
    loadThumbnail();
  }, [loadThumbnail]);

  // Fallback URL generation
  const fallbackUrl = generateThumbnailUrl(video.identifier);

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl group relative ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${
        brandSkin === 'waffle' 
          ? 'bg-yellow-50/90 backdrop-blur-sm border-2 border-yellow-400/40 hover:bg-yellow-50/95 hover:border-yellow-500/60' 
          : 'bg-gray-800/80 backdrop-blur-sm border border-lime-500/20 hover:bg-gray-800/90'
      }`}
      onClick={() => onSelect(video)}
      onMouseEnter={() => setShowHoverInfo(true)}
      onMouseLeave={() => setShowHoverInfo(false)}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-testid={`card-video-${video.identifier}`}
    >
      {/* Hover info overlay */}
      {showHoverInfo && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 transition-opacity duration-200">
          <div className="text-center text-white p-4">
            <div className="text-sm font-medium mb-2">Drag to Queue</div>
            <div className="flex items-center justify-center gap-3 text-xs">
              <LicenseBadge license={video.licenseurl} showTooltip={false} />
              <span className="bg-white/20 px-2 py-1 rounded">
                {video.duration || 'Unknown duration'}
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="relative">
        {!thumbnailLoaded && !thumbnailError ? (
          <ThumbnailSkeleton className="w-full h-32" />
        ) : (
          <img
            src={thumbnailUrl || fallbackUrl}
            alt={video.title}
            className="w-full h-32 object-cover bg-gray-200 dark:bg-gray-700"
            onLoad={() => setThumbnailLoaded(true)}
            onError={(e) => {
              if (retryCount < maxRetries) {
                setRetryCount(prev => prev + 1);
              } else {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x225/e5e7eb/6b7280?text=${encodeURIComponent(video.title)}`;
              }
            }}
          />
        )}
        <div className="absolute top-2 left-2">
          <LicenseBadge license={video.licenseurl} />
        </div>
        <div className="absolute bottom-2 right-2">
          <span className="px-2 py-1 text-xs rounded bg-gray-800 text-white dark:bg-lime-500 dark:text-black">
            {video.duration || 'Unknown'}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/40">
          <Play className="text-2xl text-white" size={32} />
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-800 dark:text-gray-100 font-inter text-sm mb-1 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          {video.creator && `${video.creator} • `}{video.year || 'Unknown'}
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">
            {video.downloads ? `${(video.downloads / 1000).toFixed(1)}k downloads` : 'No stats'}
          </span>
          <Button
            size="sm"
            onClick={handleAddClick}
            data-testid={`button-add-${video.identifier}`}
            className="px-2 py-1 rounded transition-all duration-200 bg-red-600 hover:bg-red-700 dark:bg-lime-500 dark:hover:bg-lime-400 text-white dark:text-black text-xs"
          >
            <span className="text-xs">+ Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
