import { useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { ResultCard } from './ResultCard';
import { useStore } from '@/lib/store';
import { searchVideos, getVideoMetadata } from '@/lib/archive-api';
import { type VideoResult } from '@/lib/types';

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
    totalResults
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

  const { data: searchData, error } = useQuery({
    queryKey: ['/api/search', searchState],
    enabled: !!searchState.query,
    refetchOnWindowFocus: false,
    queryFn: () => searchVideos(searchState),
  });

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
      const metadata = await getVideoMetadata(video.identifier);
      const videoUrl = metadata.streamUrl || `https://archive.org/download/${video.identifier}`;
      addToQueue(video, videoUrl);
    } catch (error) {
      console.error('Failed to add to queue:', error);
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

      {searchResults.length === 0 && isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="w-full h-32 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : searchResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <p className="text-lg mb-2">No results found</p>
          <p className="text-sm">Try different search terms or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {searchResults.map((video, index) => (
              <div
                key={`${video.identifier}-${index}`}
                ref={index === searchResults.length - 1 ? lastVideoElementRef : null}
              >
                <ResultCard
                  video={video}
                  onSelect={onVideoSelect}
                  onAddToQueue={handleAddToQueue}
                />
              </div>
            ))}
          </div>

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
