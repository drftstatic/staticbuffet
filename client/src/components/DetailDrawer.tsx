import { useEffect, useState } from 'react';
import { X, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { getVideoMetadata } from '@/lib/archive-api';
import { LicenseBadge } from './LicenseBadge';

export function DetailDrawer() {
  const { 
    selectedVideo, 
    isDetailDrawerOpen, 
    setDetailDrawerOpen, 
    addToQueue 
  } = useStore();
  
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedVideo && isDetailDrawerOpen) {
      setLoading(true);
      getVideoMetadata(selectedVideo.identifier)
        .then(setMetadata)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedVideo, isDetailDrawerOpen]);

  const handleAddToQueue = async () => {
    if (selectedVideo && metadata) {
      const videoUrl = metadata.streamUrl || `https://archive.org/download/${selectedVideo.identifier}`;
      addToQueue(selectedVideo, videoUrl);
      setDetailDrawerOpen(false);
    }
  };

  const handleDownload = () => {
    if (selectedVideo && metadata?.streamUrl) {
      window.open(metadata.streamUrl, '_blank');
    }
  };

  if (!isDetailDrawerOpen || !selectedVideo) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50"
      data-testid="drawer-video-detail"
      onClick={() => setDetailDrawerOpen(false)}
    >
      <div 
        className="absolute right-0 top-0 bottom-0 w-96 bg-white dark:bg-gray-900 shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 font-inter">
              Video Details
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDetailDrawerOpen(false)}
              data-testid="button-close-drawer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </Button>
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <>
              {/* Video Preview */}
              <div className="mb-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  {metadata?.streamUrl ? (
                    <video 
                      className="w-full aspect-video" 
                      controls 
                      preload="metadata"
                      poster={`https://archive.org/services/img/${selectedVideo.identifier}`}
                    >
                      <source src={metadata.streamUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full aspect-video bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-400">Video not available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 font-inter mb-2">
                    {selectedVideo.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <LicenseBadge license={selectedVideo.licenseurl} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedVideo.year}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedVideo.creator || 'Unknown creator'}
                  </p>
                </div>

                {selectedVideo.description && (
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-100 font-inter mb-2">
                      Description
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {selectedVideo.description}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 font-inter mb-2">
                    Technical Details
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{selectedVideo.duration || 'Unknown'}</span>
                    </div>
                    {metadata?.videoFile && (
                      <>
                        <div className="flex justify-between">
                          <span>Format:</span>
                          <span>{metadata.videoFile.format}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>File Size:</span>
                          <span>{metadata.videoFile.size || 'Unknown'}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span>Downloads:</span>
                      <span>{selectedVideo.downloads?.toLocaleString() || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                {/* Attribution */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 font-inter mb-2">
                    Attribution
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    This work is available under an open license. Original source: Internet Archive.{' '}
                    <a 
                      href={`https://archive.org/details/${selectedVideo.identifier}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 dark:text-lime-500 hover:underline"
                    >
                      View original →
                    </a>
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={handleAddToQueue}
                    disabled={!metadata?.streamUrl}
                    data-testid="button-add-to-queue"
                    className="w-full bg-red-600 hover:bg-red-700 dark:bg-lime-500 dark:hover:bg-lime-400 text-white dark:text-black font-medium"
                  >
                    <Plus className="mr-2" size={16} />
                    Add to Queue
                  </Button>
                  <Button
                    onClick={handleDownload}
                    disabled={!metadata?.streamUrl}
                    variant="outline"
                    data-testid="button-download"
                    className="w-full border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Download className="mr-2" size={16} />
                    Download Original
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
