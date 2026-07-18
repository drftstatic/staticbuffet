import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/lib/store';
import { searchVideos } from '@/lib/archive-api';

// Single owner of the search query. Every component that needs search data uses
// this hook with the same query key, so React Query dedupes to one request and
// one component tree can't cancel another's fetch.
export function useVideoSearch() {
  const { searchState, setSearchResults, setTotalResults, setLoading } = useStore();

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

  const { data, error } = query;

  // Sync results into the store: replace on page 1, append on later pages
  useEffect(() => {
    if (!data) return;
    const docs = (data as any).docs || [];
    if ((searchState.page || 1) > 1) {
      setSearchResults([...useStore.getState().searchResults, ...docs]);
    } else {
      setSearchResults(docs);
    }
    setTotalResults((data as any).numFound || 0);
    setLoading(false);
  }, [data]);

  useEffect(() => {
    if (error) {
      setLoading(false);
      console.error('Search error:', error);
    }
  }, [error]);

  return query;
}
