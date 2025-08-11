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
import { DevicePrompt } from '@/components/DevicePrompt';
import { BrandSkinToggle } from '@/components/BrandSkinToggle';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { GroupedControls } from '@/components/GroupedControls';
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
    resetPanels,
    queueItems,
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
        <div className="max-w-full px-4 py-2 space-y-3">
          {/* Top Row - Compact Brand + Controls */}
          <div className="flex items-center justify-between">
            {/* Compact Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Tv size={20} className={brandSkin === 'waffle' ? 'text-amber-600' : 'text-yellow-300'} />
                <h1 className={`font-bold text-lg ${brandSkin === 'waffle' ? 'text-amber-900' : 'text-yellow-300'}`}>
                  STATIC BUFFET
                </h1>
              </div>
              <div className="flex items-center space-x-1 text-xs opacity-75">
                <a href="https://trashteam.tv" target="_blank" rel="noopener noreferrer" 
                   className={`hover:underline ${brandSkin === 'waffle' ? 'text-amber-700' : 'text-yellow-200'}`}>
                  TRASH TEAM
                </a>
                <span>×</span>
                <a href="https://nulltone.tv" target="_blank" rel="noopener noreferrer"
                   className={`hover:underline ${brandSkin === 'waffle' ? 'text-amber-700' : 'text-yellow-200'}`}>
                  NULLTONE.TV
                </a>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetPanels}
                data-testid="button-reset-panels"
                className={`flex items-center space-x-1 ${
                  brandSkin === 'waffle' ? 'text-amber-800 hover:bg-yellow-100/50' : 'text-yellow-300 hover:bg-purple-900/50'
                }`}
              >
                <Tv size={14} />
                <span>Reset</span>
              </Button>
              <Link href="/about">
                <Button variant="ghost" size="sm" className={`flex items-center space-x-1 ${
                  brandSkin === 'waffle' ? 'text-amber-800 hover:bg-yellow-100/50' : 'text-yellow-300 hover:bg-purple-900/50'
                }`}>
                  <Info size={14} />
                  <span>About</span>
                </Button>
              </Link>
              <ThemeSwitcher />
              <GroupedControls />
            </div>
          </div>

          {/* Search Bar Row - Full Width */}
          <div>
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Filters Row */}
          <div>
            <Filters onFiltersChange={handleFiltersChange} />
          </div>
        </div>
      </header>

      {/* Dominant Player with Sidebar Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-1 p-1 overflow-hidden">
        {/* Large Preview/Player Panel - Left Side (9 columns) */}
        <div className={`col-span-1 lg:col-span-9 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
          panelStates.playerCollapsed ? 'h-12' : 'h-full'
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
              <div className="flex-1 overflow-hidden">
                <Player />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Right Side (3 columns) */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-1">
          {/* Search/Results Panel - Top of Sidebar */}
          <div className={`rounded-lg border-2 overflow-hidden transition-all duration-300 ${
            panelStates.searchCollapsed ? 'h-12' : 'flex-1'
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

          {/* Queue Panel - Middle of Sidebar */}
          <div className={`rounded-lg border-2 overflow-hidden transition-all duration-300 ${
            panelStates.queueCollapsed ? 'h-12' : 'flex-1'
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
                status={`${queueItems.length} CLIPS`}
                isCollapsed={panelStates.queueCollapsed}
                onToggleCollapse={() => togglePanelCollapse('queue')}
              />
              {!panelStates.queueCollapsed && (
                <div className="flex-1 overflow-y-auto">
                  <QueuePanel />
                </div>
              )}
            </div>
          </div>

          {/* Effects Panel - Bottom of Sidebar */}
          <div className={`rounded-lg border-2 overflow-hidden transition-all duration-300 ${
            panelStates.effectsCollapsed ? 'h-12' : 'flex-1'
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
      </div>

      {/* Detail Drawer */}
      <DetailDrawer />

      {/* Bottom HUD (EBN mode only) */}
      <BottomHUD />

      {/* Effect Preset Notifications */}
      <EffectPresetNotification />

      {/* Device Prompt */}
      <DevicePrompt />

      {/* Footer */}
      <div className="flex-shrink-0">
        <Footer />
      </div>
    </div>
  );
}
