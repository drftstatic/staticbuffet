import { useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { ResultCard } from './ResultCard';
import { useStore } from '@/lib/store';
import { searchVideos, getVideoMetadata, cancelCurrentSearch } from '@/lib/archive-api';
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
    setSearchResults,
    setTotalResults,
    setLoading,
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

  const { data: searchData, error, isLoading: isQueryLoading } = useQuery({
    queryKey: ['/api/search', searchState],
    enabled: !!searchState.query,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: () => searchVideos(searchState),
  });

  // Cancel search on unmount
  useEffect(() => {
    return () => {
      cancelCurrentSearch();
    };
  }, []);

  useEffect(() => {
    if (searchData) {
      const newResults = (searchData as any).docs || [];
      if (searchState.page === 1) {
        setSearchResults(newResults);
      } else {
        setSearchResults([...searchResults, ...newResults]);
      }
      setTotalResults((searchData as any).numFound || 0);
      setLoading(false);
    }
  }, [searchData]);

  useEffect(() => {
    if (error) {
      setLoading(false);
      console.error('Search error:', error);
    }
  }, [error]);

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
      
      // If no streamUrl from metadata, try to construct a better fallback
      if (!videoUrl) {
        console.warn(`⚠️ No streamUrl from metadata for ${video.identifier}, constructing fallback`);
        // Try common video file patterns as fallback
        const commonFormats = [
          `${video.identifier}.mp4`,
          `${video.identifier}.ogv`,
          `${video.identifier}_512kb.mp4`,
          `${video.identifier}.mov`
        ];
        // Use the first common format as fallback, but mark it as potentially problematic
        videoUrl = `https://archive.org/download/${video.identifier}/${commonFormats[0]}`;
        console.warn(`🔧 Using fallback URL: ${videoUrl}`);
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
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p className="text-lg mb-2">Enter a search term to get started</p>
        <p className="text-sm">Try: "public domain psa", "educational film", "newsreel"</p>
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
                    onAddToQueue={handleAddToQueue}
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
