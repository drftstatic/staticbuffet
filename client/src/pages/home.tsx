import { useCallback, useEffect, useState } from 'react';
import { Tv, Info, Layout, Maximize2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { SearchBar } from '@/components/SearchBar';
import { Filters } from '@/components/Filters';
import { SavedSearches } from '@/components/SavedSearches';
import { ResultsGrid } from '@/components/ResultsGrid';
import { QueuePanel } from '@/components/QueuePanel';
import { DetailDrawer } from '@/components/DetailDrawer';
import { EffectsPanel } from '@/components/EffectsPanel';
import { EffectPresetNotification } from '@/components/EffectPresetNotification';
import { BottomHUD } from '@/components/BottomHUD';
import { StreamlinedWelcome } from '@/components/StreamlinedWelcome';
import { ThemeSelector } from '@/components/ThemeSelector';
import { MediaControls } from '@/components/MediaControls';
import { Player } from '@/components/Player';
import { Footer } from '@/components/Footer';
import { MarioPipeEffect } from '@/components/MarioPipeEffect';
import { ResizablePanels } from '@/components/ResizablePanels';
import { FloatingPanelsManager } from '@/components/FloatingPanelsManager';
import { MasterControlPanel } from '@/components/MasterControlPanel';
import { DockingGuides } from '@/components/DockingGuides';
import { DevicePrompt } from '@/components/DevicePrompt';
import { useStore } from '@/lib/store';
import { getTextClasses, getThemeClasses } from '@/lib/theme-utils';
import { searchVideos } from '@/lib/archive-api';
import { type VideoResult } from '@/lib/types';
import { PanelHeader } from '@/components/PanelHeader';
import { FirstRunTour } from '@/components/FirstRunTour';
import { ResponsiveLayoutManager } from '@/components/ResponsiveLayoutManager';
import { CoreSoundboards } from '@/components/CoreSoundboards';
import { LayoutControls } from '@/components/LayoutControls';
import { ResponsiveLayoutHints } from '@/components/ResponsiveLayoutHints';
import { useResponsiveLayout } from '@/hooks/use-responsive-layout';

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
    isHulksterMode,
    isDXMode,
    isMarioMode,
    isAsciiMode,
    isDakotaVanillaMode,
    isBlondieGeometryMode,
    isResizableMode,
    setResizableMode,
    isFloatingMode,
    setFloatingMode,
  } = useStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  
  // Responsive layout management
  const { currentLayout, panelConfig, isTransitioning } = useResponsiveLayout();

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
    } else if (brandSkin === 'testcard') {
      body.className = 'bg-slate-900 font-mono transition-colors duration-300';
    } else {
      body.className = 'bg-gray-900 font-mono transition-colors duration-300';
    }

    return () => {
      body.className = '';
    };
  }, [brandSkin]);

  return (
    <ResponsiveLayoutManager>
      {/* First Run Tour */}
      <FirstRunTour />
      
      {/* Mario Pipe Effect Overlay */}
      <MarioPipeEffect />
      
      <div className={`h-screen flex flex-col overflow-hidden transition-all duration-300 relative ${
      brandSkin === 'testcard'
        ? 'testcard-gradient testcard-grid'
        : brandSkin === 'waffle' 
        ? 'waffle-gradient waffle-texture' 
        : brandSkin === 'ebn'
        ? 'ebn-gradient scanlines'
        : brandSkin === 'ozzy'
        ? 'ozzy-gradient metal-texture'
        : brandSkin === 'hogan' && isHulksterMode
        ? 'hogan-gradient nwo-stripes hulkster-mode'
        : brandSkin === 'hogan'
        ? 'hogan-gradient nwo-stripes'
        : brandSkin === 'mario' && isMarioMode
        ? 'mario-gradient mario-sparkles mario-powerup mario-mode mario-pipe-effect'
        : brandSkin === 'mario'
        ? 'mario-gradient mario-sparkles mario-powerup'
        : brandSkin === 'dx' && isDXMode
        ? 'dx-gradient dx-pulse dx-mode'
        : brandSkin === 'dx'
        ? 'dx-gradient dx-pulse'
        : brandSkin === 'maxheadroom' && isAsciiMode
        ? 'maxheadroom-gradient terminal-flicker ascii-mode'
        : brandSkin === 'maxheadroom'
        ? 'maxheadroom-gradient terminal-flicker'
        : brandSkin === 'dakota' && isDakotaVanillaMode
        ? 'brand-dakota dakota-vanilla-filter'
        : brandSkin === 'dakota'
        ? 'brand-dakota'
        : brandSkin === 'blondie' && isBlondieGeometryMode
        ? 'brand-blondie blondie-geometry'
        : brandSkin === 'blondie'
        ? 'brand-blondie'
        : 'brand-testcard'
    }`}>
      {/* Top Bar */}
      <header className={`flex-shrink-0 border-b transition-all duration-300 ${
        brandSkin === 'testcard'
          ? 'glass-testcard border-slate-400/30'
          : brandSkin === 'waffle' 
          ? 'glass border-yellow-400/50' 
          : brandSkin === 'ebn'
          ? 'glass-dark border-lime-500/30'
          : brandSkin === 'ozzy'
          ? 'glass-ozzy border-red-500/50'
          : brandSkin === 'mario'
          ? 'glass-mario border-yellow-400/50'
          : brandSkin === 'dakota'
          ? 'glass border-gray-400/50'
          : brandSkin === 'blondie'
          ? 'glass border-amber-400/50'
          : 'glass-hogan border-yellow-400/50'
      }`}>
        <div className="max-w-full px-4 py-1.5 space-y-2">
          {/* Top Row - Compact Brand + Controls */}
          <div className="flex items-center justify-between">
            {/* Compact Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Tv size={20} className={getThemeClasses(brandSkin).accent} />
                <h1 className={`font-bold text-lg ${getTextClasses(brandSkin, 'primary')}`}>
{brandSkin === 'hogan' && isHulksterMode ? 'HULKSTER BUFFET' : 
                brandSkin === 'dx' && isDXMode ? 'DX BUFFET' : 
                brandSkin === 'mario' && isMarioMode ? 'SEXY MARIO BUFFET' :
                brandSkin === 'dakota' && isDakotaVanillaMode ? 'VANILLA BUFFET' :
                brandSkin === 'blondie' && isBlondieGeometryMode ? 'PARALLEL BUFFET' :
                brandSkin === 'testcard' ? 'STATIC BUFFET' :
                brandSkin === 'waffle' ? 'SYRUP BUFFET' :
                brandSkin === 'ebn' ? 'HIJACK BUFFET' :
                brandSkin === 'ozzy' ? 'METAL BUFFET' :
                brandSkin === 'hogan' ? 'BROTHER BUFFET' :
                brandSkin === 'dx' ? 'REBEL BUFFET' :
                brandSkin === 'maxheadroom' ? 'DIGITAL BUFFET' :
                brandSkin === 'mario' ? 'POWER-UP BUFFET' :
                brandSkin === 'dakota' ? 'VANILLA BUFFET' :
                brandSkin === 'blondie' ? 'ATOMIC BUFFET' :
                'STATIC BUFFET'}
                </h1>
              </div>
              <div className="flex items-center space-x-1 text-xs opacity-75">
                <a href="https://trashteam.tv" target="_blank" rel="noopener noreferrer" 
                   className={`hover:underline ${getTextClasses(brandSkin, 'secondary')}`}>
                  TRASH TEAM
                </a>
                <span>×</span>
                <a href="https://nulltone.tv" target="_blank" rel="noopener noreferrer"
                   className={`hover:underline ${getTextClasses(brandSkin, 'secondary')}`}>
                  NULLTONE.TV
                </a>
              </div>
            </div>

            {/* Compact Media Controls */}
            <div className="flex items-center">
              <MediaControls />
            </div>
          </div>

          {/* Ultra-compact Search Row */}
          <div className="flex gap-1 items-center text-sm">
            <div className="flex-1 max-w-sm">
              <SearchBar onSearch={handleSearch} />
            </div>
            <SavedSearches />
            <Filters onFiltersChange={handleFiltersChange} />
          </div>
        </div>
      </header>

      {/* Main Content - Two-tier layout: Top content + Bottom timeline */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Content Area */}
        <div className="flex-1 overflow-hidden">
          {isFloatingMode ? (
            <>
              <FloatingPanelsManager />
              <div className="h-full w-full bg-black/20 backdrop-blur-sm">
                <div className="flex items-center justify-center h-full text-white/60">
                  <div className="text-center">
                    <Move size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Floating Panel Mode</p>
                    <p className="text-sm opacity-75">Drag panels by their headers • Click lock icons to lock/unlock</p>
                  </div>
                </div>
              </div>
            </>
          ) : isResizableMode ? (
            <>
              <DockingGuides isDragging={isDragging} dragPosition={dragPosition} />
              <ResizablePanels
                searchResults={searchData ? (searchData as any).docs || [] : []}
                totalResults={searchData ? (searchData as any).numFound || 0 : 0}
                isLoading={isLoading}
                onSearch={handleSearch}
                onVideoSelect={handleVideoSelect}
              />
            </>
          ) : (
            /* Grid Layout - Top Row Only (Search, Player, Effects) */
            <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-1 p-1 overflow-hidden"
                 style={{ gridTemplateRows: 'minmax(0, 1fr)' }}>
              {/* Large Preview/Player Panel - Left Side (8 columns) */}
              <div 
                data-tour-target="player-section"
                className={`col-span-1 lg:col-span-8 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
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
                    title="PREVIEW • PLAYER"
                    status="LIVE"
                    isCollapsed={panelStates.playerCollapsed}
                    onToggleCollapse={() => togglePanelCollapse('player')}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                    </div>
                  </PanelHeader>
                  {!panelStates.playerCollapsed && (
                    <div className="flex-1 overflow-hidden">
                      <Player />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar - 4 columns */}
              <div className="col-span-1 lg:col-span-4 flex flex-col gap-1">
                {/* Search/Results Panel */}
                <div 
                  data-tour-target="search-section"
                  className={`rounded-lg border-2 overflow-hidden transition-all duration-300 ${
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
                      title="SEARCH • RESULTS"
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

                {/* Effects Panel */}
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
                      title="EFFECTS • MIX"
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
          )}
        </div>

        {/* Bottom Timeline Panel - Full Width */}
        <div 
          data-tour-target="queue-section"
          className={`${panelStates.queueCollapsed ? 'h-16' : 'h-64'} rounded-lg border-2 mx-1 mb-1 overflow-hidden transition-all duration-300 ${
          brandSkin === 'waffle' 
            ? 'bg-yellow-50/80 border-yellow-400/50' 
            : 'bg-purple-950/80 border-yellow-400/50'
        }`}>
          <div className={`h-full flex flex-col ${
            brandSkin === 'waffle' ? 'text-amber-900' : 'text-yellow-300'
          }`}>
            <PanelHeader
              title="TIMELINE • QUEUE"
              status={`${queueItems.length} CLIPS • FULL WIDTH`}
              isCollapsed={panelStates.queueCollapsed}
              onToggleCollapse={() => togglePanelCollapse('queue')}
            >
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded text-xs font-mono ${
                  brandSkin === 'waffle' ? 'bg-amber-200 text-amber-800' : 'bg-yellow-400/20 text-yellow-300'
                }`}>
                  LONG
                </div>
              </div>
            </PanelHeader>
            {!panelStates.queueCollapsed && (
              <div className="flex-1 overflow-hidden p-4">
                <QueuePanel />
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

      {/* Device Prompt - positioned lower to avoid control panel overlap */}
      <div className="absolute top-20 right-4 z-30">
        <DevicePrompt />
      </div>

      {/* Streamlined Modals - consolidated */}
      <StreamlinedWelcome />
      <FirstRunTour />
      <CoreSoundboards />
      
      {/* Master Control Panel - consolidates theme, layout, and help controls */}
      <MasterControlPanel />
    </div>
    </ResponsiveLayoutManager>
  );
}
