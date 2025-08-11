import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LicenseBadge } from './LicenseBadge';
import { type VideoResult } from '@/lib/types';
import { generateThumbnailUrl } from '@/lib/archive-api';
import { useStore } from '@/lib/store';

interface ResultCardProps {
  video: VideoResult;
  onSelect: (video: VideoResult) => void;
  onAddToQueue: (video: VideoResult) => void;
}

export function ResultCard({ video, onSelect, onAddToQueue }: ResultCardProps) {
  const { brandSkin } = useStore();
  const thumbnailUrl = generateThumbnailUrl(video.identifier);

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToQueue(video);
  };

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl group ${
        brandSkin === 'diner' 
          ? 'bg-white/80 backdrop-blur-sm border border-amber-200/50 hover:bg-white/90' 
          : 'bg-gray-800/80 backdrop-blur-sm border border-lime-500/20 hover:bg-gray-800/90'
      }`}
      onClick={() => onSelect(video)}
      data-testid={`card-video-${video.identifier}`}
    >
      <div className="relative">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-32 object-cover bg-gray-200 dark:bg-gray-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x225/e5e7eb/6b7280?text=${encodeURIComponent(video.title)}`;
          }}
        />
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
