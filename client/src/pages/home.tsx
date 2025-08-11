import { useCallback, useEffect } from 'react';
import { Tv } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '@/components/SearchBar';
import { Filters } from '@/components/Filters';
import { ResultsGrid } from '@/components/ResultsGrid';
import { QueuePanel } from '@/components/QueuePanel';
import { DetailDrawer } from '@/components/DetailDrawer';
import { BottomHUD } from '@/components/BottomHUD';
import { BrandSkinToggle } from '@/components/BrandSkinToggle';
import { EmergencyMix } from '@/components/EmergencyMix';
import { AudioReactive } from '@/components/AudioReactive';
import { useStore } from '@/lib/store';
import { searchVideos } from '@/lib/archive-api';
import { type VideoResult } from '@/lib/types';

export default function Home() {
  const {
    brandSkin,
    searchState,
    setSearchResults,
    setTotalResults,
    setLoading,
    setSelectedVideo,
    setDetailDrawerOpen,
  } = useStore();

  // Perform search when filters change
  const { data: searchData, error, isLoading } = useQuery({
    queryKey: ['/api/search', searchState],
    enabled: !!searchState.query && searchState.query.length > 0,
    refetchOnWindowFocus: false,
    queryFn: () => searchVideos(searchState),
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (searchData) {
      const results = (searchData as any).docs || [];
      if (searchState.page === 1) {
        setSearchResults(results);
      } else {
        // Append for pagination - this will be handled in ResultsGrid
      }
      setTotalResults((searchData as any).numFound || 0);
    }
  }, [searchData, setSearchResults, setTotalResults, searchState.page]);

  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      setLoading(true);
    }
  }, [setLoading]);

  const handleFiltersChange = useCallback(() => {
    if (searchState.query) {
      setLoading(true);
    }
  }, [searchState.query, setLoading]);

  const handleVideoSelect = useCallback((video: VideoResult) => {
    setSelectedVideo(video);
    setDetailDrawerOpen(true);
  }, [setSelectedVideo, setDetailDrawerOpen]);

  // Apply theme classes to body
  useEffect(() => {
    const body = document.body;
    
    if (brandSkin === 'diner') {
      body.className = 'bg-orange-50 dark:bg-gray-900 font-inter transition-colors duration-300';
    } else {
      body.className = 'bg-gray-900 font-mono transition-colors duration-300';
    }

    return () => {
      body.className = '';
    };
  }, [brandSkin]);

  return (
    <div className="min-h-screen transition-all duration-300">
      {/* Top Bar */}
      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        brandSkin === 'diner' 
          ? 'bg-white border-amber-200' 
          : 'bg-gray-800 border-lime-500/20'
      }`}>
        <div className="max-w-full px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`${brandSkin === 'diner' ? 'text-red-600' : 'text-lime-500'}`}>
                  <Tv size={24} />
                </div>
                <div>
                  <h1 className={`font-bold text-lg font-inter ${
                    brandSkin === 'diner' ? 'text-gray-800' : 'text-gray-100'
                  }`}>
                    Static Buffet
                  </h1>
                  <p className={`text-xs ${
                    brandSkin === 'diner' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    All-you-can-eat video chaos
                  </p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} />

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <EmergencyMix />
              <AudioReactive />
              <BrandSkinToggle />
            </div>
          </div>

          {/* Filters Row */}
          <Filters onFiltersChange={handleFiltersChange} />
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex h-[calc(100vh-120px)] overflow-hidden">
        {/* Results Grid */}
        <div className={`flex-1 overflow-y-auto ${
          brandSkin === 'diner' ? 'bg-orange-50' : 'bg-gray-900'
        }`}>
          <ResultsGrid onVideoSelect={handleVideoSelect} />
        </div>

        {/* Queue Panel */}
        <QueuePanel />
      </div>

      {/* Detail Drawer */}
      <DetailDrawer />

      {/* Bottom HUD (EBN mode only) */}
      <BottomHUD />
    </div>
  );
}
