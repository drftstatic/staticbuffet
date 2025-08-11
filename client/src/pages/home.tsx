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
import { PanelHeader } from '@/components/PanelHeader';

export default function Home() {
  const {
    brandSkin,
    searchState,
    setSearchResults,
    setTotalResults,
    setLoading,
    setSelectedVideo,
    setDetailDrawerOpen,
    panelStates,
    togglePanelCollapse,
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
    <div className={`h-screen flex flex-col overflow-hidden transition-all duration-300 ${
      brandSkin === 'waffle' ? 'waffle-gradient' : 'ebn-gradient'
    }`}>
      {/* Top Bar */}
      <header className={`flex-shrink-0 border-b transition-all duration-300 ${
        brandSkin === 'waffle' 
          ? 'glass border-yellow-400/50' 
          : 'glass-dark border-lime-500/30'
      }`}>
        <div className="max-w-full px-4 py-3">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-4 lg:gap-8 items-center">
            {/* Brand Information */}
            <div className="flex flex-col space-y-3">
              {/* Attribution Links */}
              <div className="flex items-center space-x-2 text-sm">
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

            {/* Search Bar - Center, Much Bigger */}
            <div className="w-full">
              <SearchBar onSearch={handleSearch} />
            </div>

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
          <div className="mt-4">
            <Filters onFiltersChange={handleFiltersChange} />
          </div>
        </div>
      </header>

      {/* Professional Media Workstation Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-1 p-1 overflow-hidden" style={{
        gridTemplateRows: `repeat(${
          12 - 
          (panelStates.searchCollapsed ? 7 : 0) - 
          (panelStates.playerCollapsed ? 7 : 0) - 
          (panelStates.queueCollapsed ? 3 : 0) - 
          (panelStates.effectsCollapsed ? 3 : 0)
        }, minmax(0, 1fr))`
      }}>
        {/* Search/Results Panel - Left Column */}
        <div className={`col-span-1 lg:col-span-4 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
          panelStates.searchCollapsed ? 'lg:row-span-1' : 'lg:row-span-8'
        } ${
          brandSkin === 'waffle' 
            ? 'bg-yellow-50/80 border-yellow-400/50' 
            : 'bg-purple-950/80 border-yellow-400/50'
        }`}>
          <div className={`h-full flex flex-col ${
            brandSkin === 'waffle' ? 'text-amber-900' : 'text-yellow-300'
          }`}>
            <PanelHeader
              title="SEARCH / RESULTS"
              status={`${searchData?.numFound || 0} ITEMS`}
              isCollapsed={panelStates.searchCollapsed}
              onToggleCollapse={() => togglePanelCollapse('search')}
            />
            {!panelStates.searchCollapsed && (
              <div className="flex-1 overflow-y-auto">
                <ResultsGrid onVideoSelect={handleVideoSelect} />
              </div>
            )}
          </div>
        </div>

        {/* Preview/Player Panel - Center/Right */}
        <div className={`col-span-1 lg:col-span-8 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
          panelStates.playerCollapsed ? 'lg:row-span-1' : 'lg:row-span-8'
        } ${
          brandSkin === 'waffle' 
            ? 'bg-yellow-50/80 border-yellow-400/50' 
            : 'bg-purple-950/80 border-yellow-400/50'
        }`}>
          <div className={`h-full flex flex-col ${
            brandSkin === 'waffle' ? 'text-amber-900' : 'text-yellow-300'
          }`}>
            <PanelHeader
              title="PREVIEW / PLAYER"
              status="LIVE"
              isCollapsed={panelStates.playerCollapsed}
              onToggleCollapse={() => togglePanelCollapse('player')}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  brandSkin === 'waffle' ? 'bg-red-500' : 'bg-red-400'
                } animate-pulse`}></div>
              </div>
            </PanelHeader>
            {!panelStates.playerCollapsed && (
              <div className="flex-1 bg-black relative min-h-0">
                <Player />
              </div>
            )}
          </div>
        </div>

        {/* Queue/Timeline Panel - Bottom Row */}
        <div className={`col-span-1 lg:col-span-8 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
          panelStates.queueCollapsed ? 'lg:row-span-1' : 'lg:row-span-4'
        } ${
          brandSkin === 'waffle' 
            ? 'bg-yellow-50/80 border-yellow-400/50' 
            : 'bg-purple-950/80 border-yellow-400/50'
        }`}>
          <div className={`h-full flex flex-col ${
            brandSkin === 'waffle' ? 'text-amber-900' : 'text-yellow-300'
          }`}>
            <PanelHeader
              title="QUEUE / TIMELINE"
              status={`${searchState?.query ? 'ACTIVE' : 'IDLE'}`}
              isCollapsed={panelStates.queueCollapsed}
              onToggleCollapse={() => togglePanelCollapse('queue')}
            />
            {!panelStates.queueCollapsed && (
              <div className="flex-1 p-4">
                <QueuePanel />
              </div>
            )}
          </div>
        </div>

        {/* Effects Panel - Bottom Right */}
        <div className={`col-span-1 lg:col-span-4 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
          panelStates.effectsCollapsed ? 'lg:row-span-1' : 'lg:row-span-4'
        } ${
          brandSkin === 'waffle' 
            ? 'bg-yellow-50/80 border-yellow-400/50' 
            : 'bg-purple-950/80 border-yellow-400/50'
        }`}>
          <div className={`h-full flex flex-col ${
            brandSkin === 'waffle' ? 'text-amber-900' : 'text-yellow-300'
          }`}>
            <PanelHeader
              title="EFFECTS / MIX"
              status="READY"
              isCollapsed={panelStates.effectsCollapsed}
              onToggleCollapse={() => togglePanelCollapse('effects')}
            />
            {!panelStates.effectsCollapsed && (
              <div className="flex-1 overflow-y-auto">
                <EffectsPanel />
              </div>
            )}
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
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  );
}
