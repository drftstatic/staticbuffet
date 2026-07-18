import { useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { ResultCard } from './ResultCard';
import { useStore } from '@/lib/store';
import { getVideoMetadata } from '@/lib/archive-api';
import { useVideoSearch } from '@/hooks/use-video-search';
import { type VideoResult } from '@/lib/types';
import { SearchResultsSkeleton } from './SkeletonLoader';
import { StaggerContainer, StaggerItem } from './AnimatedTransitions';

interface ResultsGridProps {
  onVideoSelect: (video: VideoResult) => void;
}

export function ResultsGrid({ onVideoSelect }: ResultsGridProps) {
  const {
    searchState,
    searchResults,
    addToQueue,
    isLoading,
    totalResults,
    brandSkin
  } = useStore();

  const observerRef = useRef<IntersectionObserver>();
  const lastVideoElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && searchResults.length < totalResults) {
        // Load more results - this will be handled by pagination logic
      }
    });
    if (node) observerRef.current.observe(node);
  }, [isLoading, searchResults.length, totalResults]);

  const { error, isLoading: isQueryLoading } = useVideoSearch();

  const handleAddToQueue = async (video: VideoResult) => {
    try {
      console.log('🎬 Adding video to queue:', video.identifier);
      const metadata = await getVideoMetadata(video.identifier);
      console.log('📋 Metadata received:', {
        hasStreamUrl: !!metadata.streamUrl,
        streamUrl: metadata.streamUrl,
        videoFile: metadata.videoFile?.name,
        totalFiles: metadata.videoFiles?.length
      });
      
      let videoUrl = metadata.streamUrl;
      
      // If no streamUrl from metadata, this is a server-side issue that should be fixed
      if (!videoUrl) {
        console.error(`❌ No streamUrl from metadata for ${video.identifier}. This video cannot be played.`);
        throw new Error(`Video ${video.identifier} has no playable stream URL. Please try a different video.`);
      }
      
      console.log('🎥 Final video URL:', videoUrl);
      
      addToQueue(video, videoUrl);
      console.log('✅ Video added to queue successfully');
    } catch (error) {
      console.error('❌ Failed to add to queue:', error);
    }
  };

  if (!searchState.query) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Ready to Mix
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Search the archive for videos to add to your timeline
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              VJ Search Ideas:
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-2">
                <div className="font-medium text-gray-800 dark:text-gray-200">Visual:</div>
                <div className="space-y-1 text-gray-600 dark:text-gray-400">
                  <div>"abstract film"</div>
                  <div>"kaleidoscope"</div>
                  <div>"liquid motion"</div>
                  <div>"geometric"</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-gray-800 dark:text-gray-200">Content:</div>
                <div className="space-y-1 text-gray-600 dark:text-gray-400">
                  <div>"vintage commercial"</div>
                  <div>"space documentary"</div>
                  <div>"industrial film"</div>
                  <div>"experimental"</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              All content from Internet Archive • Public Domain
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p className="text-lg mb-2">Search failed</p>
        <p className="text-sm">Please try again with different terms</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 font-inter mb-2">
          Search Results{' '}
          <span className="text-sm text-gray-600 dark:text-gray-400 font-normal">
            {totalResults > 0 && `(${totalResults.toLocaleString()} items)`}
          </span>
        </h2>
      </div>

      {searchResults.length === 0 && (isLoading || isQueryLoading) ? (
        <SearchResultsSkeleton count={8} />
      ) : searchResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">No results found</p>
          <p className="text-sm">Try different search terms or filters</p>
        </div>
      ) : (
        <>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {searchResults.map((video, index) => (
              <StaggerItem 
                key={`${video.identifier}-${index}`}
                className={index === searchResults.length - 1 ? 'ref-element' : ''}
              >
                <div ref={index === searchResults.length - 1 ? lastVideoElementRef : null}>
                  <ResultCard
                    video={video}
                    onSelect={onVideoSelect}
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {isLoading && searchResults.length > 0 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center text-gray-600 dark:text-gray-400">
                <Loader2 className="animate-spin mr-2" size={16} />
                Loading more results...
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
