import { useCallback, useEffect } from 'react';
import { Tv, Info } from 'lucide-react';
import { Link } from 'wouter';
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
import { Button } from '@/components/ui/button';
import { EmergencyMix } from '@/components/EmergencyMix';
import { AudioReactive } from '@/components/AudioReactive';
import { Player } from '@/components/Player';
import { Footer } from '@/components/Footer';
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
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${
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
                      : ''
                  }`}
                  style={brandSkin !== 'waffle' ? { 
                    color: '#FFD300'
                  } : {}}
                >
                  TRASH TEAM
                </a>
                <span className={brandSkin === 'waffle' ? 'text-amber-600' : ''} style={brandSkin !== 'waffle' ? { color: '#FFD300' } : {}}>×</span>
                <a 
                  href="https://nulltone.tv" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`hover:underline transition-colors ${
                    brandSkin === 'waffle' 
                      ? 'text-amber-800 hover:text-red-700' 
                      : ''
                  }`}
                  style={brandSkin !== 'waffle' ? { 
                    color: '#FFD300'
                  } : {}}
                >
                  NULLTONE.TV
                </a>
              </div>
              
              {/* Main Logo */}
              <div className="flex items-center space-x-3">
                <div className={`${brandSkin === 'waffle' ? 'text-amber-600' : 'text-yellow-400'}`} style={brandSkin !== 'waffle' ? { color: '#FFD300' } : {}}>
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
                brandSkin === 'waffle' ? 'text-amber-800' : ''
              }`} style={brandSkin !== 'waffle' ? { color: '#B6FF00' } : {}}>
                All-you-can-eat video chaos, straight from the public domain.
              </p>
            </div>

            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} />

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Link href="/about">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`flex items-center space-x-1 ${
                    brandSkin === 'waffle' 
                      ? 'text-amber-800 hover:text-amber-900 hover:bg-yellow-100/50' 
                      : 'hover:bg-purple-900/50'
                  }`}
                  style={brandSkin !== 'waffle' ? { 
                    color: '#FFD300'
                  } : {}}
                >
                  <Info size={16} />
                  <span>About</span>
                </Button>
              </Link>
              <ThemeSwitcher />
              <EmergencyMix />
              <AudioReactive />
            </div>
          </div>

          {/* Filters Row */}
          <Filters onFiltersChange={handleFiltersChange} />
        </div>
      </header>

      {/* Professional Media Workstation Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 auto-rows-auto lg:grid-rows-12 gap-2 lg:gap-1 p-2 lg:p-1 min-h-0">
        {/* Search/Results Panel - Left Column */}
        <div className={`col-span-1 lg:col-span-4 row-span-1 lg:row-span-8 rounded-lg border-2 ${
          brandSkin === 'waffle' 
            ? 'bg-yellow-50/80 border-yellow-400/50' 
            : 'bg-purple-950/80 border-yellow-400/50'
        } min-h-[300px] lg:min-h-0`}>
          <div className={`h-full flex flex-col ${
            brandSkin === 'waffle' ? 'text-amber-900' : 'text-yellow-300'
          }`}>
            {/* Panel Header */}
            <div className={`px-4 py-2 border-b font-mono text-xs uppercase tracking-wide ${
              brandSkin === 'waffle' 
                ? 'border-yellow-400/30 bg-yellow-100/50' 
                : 'border-yellow-400/30 bg-purple-900/50'
            }`}>
              Search / Results
            </div>
            {/* Results Grid */}
            <div className="flex-1 overflow-y-auto">
              <ResultsGrid onVideoSelect={handleVideoSelect} />
            </div>
          </div>
        </div>

        {/* Preview/Player Panel - Center/Right */}
        <div className={`col-span-1 lg:col-span-8 row-span-1 lg:row-span-8 rounded-lg border-2 ${
          brandSkin === 'waffle' 
            ? 'bg-yellow-50/80 border-yellow-400/50' 
            : 'bg-purple-950/80 border-yellow-400/50'
        } min-h-[400px] lg:min-h-0`}>
          <div className={`h-full flex flex-col ${
            brandSkin === 'waffle' ? 'text-amber-900' : 'text-yellow-300'
          }`}>
            {/* Panel Header */}
            <div className={`px-4 py-2 border-b font-mono text-xs uppercase tracking-wide flex justify-between items-center ${
              brandSkin === 'waffle' 
                ? 'border-yellow-400/30 bg-yellow-100/50' 
                : 'border-yellow-400/30 bg-purple-900/50'
            }`}>
              <span>Preview / Player</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  brandSkin === 'waffle' ? 'bg-red-500' : 'bg-red-400'
                } animate-pulse`}></div>
                <span className="text-xs">LIVE</span>
              </div>
            </div>
            {/* Player Area */}
            <div className="flex-1 bg-black relative">
              <Player />
            </div>
          </div>
        </div>

        {/* Queue/Timeline Panel - Bottom Row */}
        <div className={`col-span-1 lg:col-span-8 row-span-1 lg:row-span-4 rounded-lg border-2 ${
          brandSkin === 'waffle' 
            ? 'bg-yellow-50/80 border-yellow-400/50' 
            : 'bg-purple-950/80 border-yellow-400/50'
        } min-h-[200px] lg:min-h-0`}>
          <div className={`h-full flex flex-col ${
            brandSkin === 'waffle' ? 'text-amber-900' : 'text-yellow-300'
          }`}>
            {/* Panel Header */}
            <div className={`px-4 py-2 border-b font-mono text-xs uppercase tracking-wide ${
              brandSkin === 'waffle' 
                ? 'border-yellow-400/30 bg-yellow-100/50' 
                : 'border-yellow-400/30 bg-purple-900/50'
            }`}>
              Queue / Timeline
            </div>
            {/* Timeline Area */}
            <div className="flex-1 p-4">
              <QueuePanel />
            </div>
          </div>
        </div>

        {/* Effects Panel - Bottom Right */}
        <div className={`col-span-1 lg:col-span-4 row-span-1 lg:row-span-4 rounded-lg border-2 ${
          brandSkin === 'waffle' 
            ? 'bg-yellow-50/80 border-yellow-400/50' 
            : 'bg-purple-950/80 border-yellow-400/50'
        } min-h-[200px] lg:min-h-0`}>
          <div className={`h-full flex flex-col ${
            brandSkin === 'waffle' ? 'text-amber-900' : 'text-yellow-300'
          }`}>
            {/* Panel Header */}
            <div className={`px-4 py-2 border-b font-mono text-xs uppercase tracking-wide ${
              brandSkin === 'waffle' 
                ? 'border-yellow-400/30 bg-yellow-100/50' 
                : 'border-yellow-400/30 bg-purple-900/50'
            }`}>
              Effects / Mix
            </div>
            {/* Effects Content */}
            <div className="flex-1 overflow-y-auto">
              <EffectsPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer />

      {/* Bottom HUD (EBN mode only) */}
      <BottomHUD />

      {/* Effect Preset Notifications */}
      <EffectPresetNotification />

      {/* Footer */}
      <Footer />
    </div>
  );
}
