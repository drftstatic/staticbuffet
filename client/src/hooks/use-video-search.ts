import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/lib/store';
import { searchVideos } from '@/lib/archive-api';

interface UseVideoSearchOptions {
  syncToStore?: boolean;
}

// Every observer uses the same query key, so React Query dedupes requests. Only
// one observer should sync the shared query back into Zustand; otherwise each
// mounted ResultsGrid appends the same page again.
export function useVideoSearch({ syncToStore = false }: UseVideoSearchOptions = {}) {
  const { searchState, setSearchResults, setTotalResults, setLoading } = useStore();
  const requestedPage = searchState.page || 1;

  const query = useQuery({
    queryKey: [
      'video-search',
      searchState.query,
      searchState.yearFrom,
      searchState.yearTo,
      searchState.duration,
      searchState.license,
      searchState.sort,
      searchState.page,
      searchState.sources.join(','),
      searchState.allowRestrictedLicenses,
    ],
    queryFn: ({ signal }) => searchVideos(searchState, signal),
    enabled: !!searchState.query && searchState.query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.name === 'AbortError') return false;
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data, error, isFetching } = query;

  // Keep store-backed loading UI in step with React Query for the full request.
  // Reset on teardown so the global flag can't stay stuck at true if the
  // syncing observer unmounts while a request is in flight.
  useEffect(() => {
    if (!syncToStore) return;
    setLoading(isFetching);
    return () => setLoading(false);
  }, [isFetching, setLoading, syncToStore]);

  // Sync results into the store: replace on page 1, append on later pages.
  // The server only returns docs with identifiers, but cached or hand-edited
  // payloads may not honor that, so drop identifier-less entries before keying.
  useEffect(() => {
    if (!syncToStore || !data) return;
    const docs = (((data as any).docs || []) as any[]).filter((video) => video?.identifier);
    if (requestedPage > 1) {
      const resultsByIdentifier = new Map(
        useStore
          .getState()
          .searchResults.filter((video) => video?.identifier)
          .map((video) => [video.identifier, video]),
      );
      docs.forEach((video: any) => resultsByIdentifier.set(video.identifier, video));
      setSearchResults(Array.from(resultsByIdentifier.values()));
    } else {
      setSearchResults(docs);
    }
    setTotalResults((data as any).numFound || 0);
  }, [data, requestedPage, setSearchResults, setTotalResults, syncToStore]);

  useEffect(() => {
    if (syncToStore && error) {
      console.error('Search error:', error);
    }
  }, [error, syncToStore]);

  return query;
}
