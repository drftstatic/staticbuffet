import { useCallback, useEffect } from 'react';
import { Tv } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '@/components/SearchBar';
import { Filters } from '@/components/Filters';
import { ResultsGrid } from '@/components/ResultsGrid';
import { QueuePanel } from '@/components/QueuePanel';
import { DetailDrawer } from '@/components/DetailDrawer';
import { EffectsPanel } from '@/components/EffectsPanel';
import { EffectPresetNotification } from '@/components/EffectPresetNotification';
import { BottomHUD } from '@/components/BottomHUD';
import { BrandSkinToggle } from '@/components/BrandSkinToggle';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
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
    
    if (brandSkin === 'waffle') {
      body.className = 'bg-yellow-50 dark:bg-gray-900 font-inter transition-colors duration-300';
    } else {
      body.className = 'bg-gray-900 font-mono transition-colors duration-300';
    }

    return () => {
      body.className = '';
    };
  }, [brandSkin]);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      brandSkin === 'waffle' ? 'waffle-gradient' : 'ebn-gradient'
    }`}>
      {/* Top Bar */}
      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        brandSkin === 'waffle' 
          ? 'glass border-yellow-400/50' 
          : 'glass-dark border-lime-500/30'
      }`}>
        <div className="max-w-full px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex flex-col space-y-1">
              {/* Brand Attribution */}
              <div className="flex items-center space-x-2 text-xs font-medium tracking-wider">
                <a 
                  href="https://trashteam.tv" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`hover:underline transition-colors ${
                    brandSkin === 'waffle' 
                      ? 'text-amber-800 hover:text-red-700' 
                      : 'text-gray-400 hover:text-lime-400'
                  }`}
                >
                  TRASH TEAM
                </a>
                <span className={brandSkin === 'waffle' ? 'text-amber-600' : 'text-gray-500'}>×</span>
                <a 
                  href="https://nulltone.tv" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`hover:underline transition-colors ${
                    brandSkin === 'waffle' 
                      ? 'text-amber-800 hover:text-red-700' 
                      : 'text-gray-400 hover:text-lime-400'
                  }`}
                >
                  NULLTONE.TV
                </a>
              </div>
              
              {/* Main Logo */}
              <div className="flex items-center space-x-3">
                <div className={`${brandSkin === 'waffle' ? 'text-amber-600' : 'text-lime-500'}`}>
                  <Tv size={28} />
                </div>
                <div>
                  <h1 className={`font-black text-2xl font-inter tracking-tight leading-none ${
                    brandSkin === 'waffle' ? 'text-amber-900 logo-text' : 'text-gray-100 logo-text-dark'
                  }`}>
                    STATIC<br/>BUFFET
                  </h1>
                </div>
              </div>
              
              {/* Tagline */}
              <p className={`text-sm font-medium ${
                brandSkin === 'waffle' ? 'text-amber-800' : 'text-gray-400'
              }`}>
                All-you-can-eat video chaos, straight from the public domain.
              </p>
            </div>

            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} />

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <ThemeSwitcher />
              <EmergencyMix />
              <AudioReactive />
            </div>
          </div>

          {/* Filters Row */}
          <Filters onFiltersChange={handleFiltersChange} />
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex h-[calc(100vh-120px)] overflow-hidden gap-2 p-2">
        {/* Results Grid */}
        <div className={`flex-1 overflow-y-auto rounded-xl shadow-lg ${
          brandSkin === 'waffle' ? 'glass' : 'glass-dark'
        }`}>
          <ResultsGrid onVideoSelect={handleVideoSelect} />
        </div>

        {/* Effects Panel */}
        <div className={`w-80 overflow-y-auto rounded-xl shadow-lg ${
          brandSkin === 'waffle' ? 'glass' : 'glass-dark'
        }`}>
          <EffectsPanel />
        </div>

        {/* Queue Panel */}
        <div className="w-80">
          <QueuePanel />
        </div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer />

      {/* Bottom HUD (EBN mode only) */}
      <BottomHUD />

      {/* Effect Preset Notifications */}
      <EffectPresetNotification />
    </div>
  );
}
