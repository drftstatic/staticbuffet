import { useCallback, useEffect, useState } from 'react';
import { Tv, Info, Layout, Maximize2 } from 'lucide-react';
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
import { WelcomeModal } from '@/components/WelcomeModal';
import { BrandSkinToggle } from '@/components/BrandSkinToggle';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { GroupedControls } from '@/components/GroupedControls';
import { Player } from '@/components/Player';
import { Footer } from '@/components/Footer';
import { DXButton } from '@/components/DXButton';
import { DXSoundboard } from '@/components/DXSoundboard';
import { HulksterButton } from '@/components/HulksterButton';
import { WaffleButton } from '@/components/WaffleButton';
import { OzzyButton } from '@/components/OzzyButton';
import { EBNButton } from '@/components/EBNButton';
import { MaxButton } from '@/components/MaxButton';
import { MarioButton } from '@/components/MarioButton';
import { DakotaButton } from '@/components/DakotaButton';
import { BlondieButton } from '@/components/BlondieButton';
import { MarioPipeEffect } from '@/components/MarioPipeEffect';
import { LiveVideoMode } from '@/components/LiveVideoMode';
import { WorkspaceLayoutSaver } from '@/components/WorkspaceLayoutSaver';
import { ResizablePanels } from '@/components/ResizablePanels';
import { DockingGuides } from '@/components/DockingGuides';
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
    isHulksterMode,
    isDXMode,
    isMarioMode,
    isAsciiMode,
    isDakotaVanillaMode,
    isBlondieGeometryMode,
    isResizableMode,
    setResizableMode,
  } = useStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);

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
    <>
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
        <div className="max-w-full px-4 py-2 space-y-3">
          {/* Top Row - Compact Brand + Controls */}
          <div className="flex items-center justify-between">
            {/* Compact Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Tv size={20} className={
                  brandSkin === 'testcard' ? 'text-blue-400' :
                  brandSkin === 'waffle' ? 'text-amber-600' : 
                  brandSkin === 'ebn' ? 'text-yellow-300' :
                  brandSkin === 'ozzy' ? 'text-red-400' :
                  brandSkin === 'mario' ? 'text-red-500' :
                  brandSkin === 'dakota' ? 'text-gray-400' :
                  brandSkin === 'blondie' ? 'text-amber-400' :
                  'text-yellow-400'
                } />
                <h1 className={`font-bold text-lg ${
                  brandSkin === 'testcard' ? 'text-slate-200' :
                  brandSkin === 'waffle' ? 'text-amber-900' : 
                  brandSkin === 'ebn' ? 'text-yellow-300' :
                  brandSkin === 'ozzy' ? 'text-red-200' :
                  brandSkin === 'mario' ? 'text-yellow-200' :
                  brandSkin === 'dakota' ? 'text-gray-200' :
                  brandSkin === 'blondie' ? 'text-amber-200' :
                  'text-yellow-300'
                }`}>
{brandSkin === 'hogan' && isHulksterMode ? 'HULKSTER BUFFET' : 
                brandSkin === 'dx' && isDXMode ? 'DX BUFFET' : 
                brandSkin === 'mario' && isMarioMode ? 'SEXY MARIO BUFFET' :
                brandSkin === 'dakota' && isDakotaVanillaMode ? 'VANILLA BUFFET' :
                brandSkin === 'dakota' ? 'DAKOTA BUFFET' :
                brandSkin === 'blondie' && isBlondieGeometryMode ? 'GEOMETRIC BUFFET' :
                brandSkin === 'blondie' ? 'BLONDIE BUFFET' :
                'STATIC BUFFET'}
                </h1>
              </div>
              <div className="flex items-center space-x-1 text-xs opacity-75">
                <a href="https://trashteam.tv" target="_blank" rel="noopener noreferrer" 
                   className={`hover:underline ${
                     brandSkin === 'waffle' ? 'text-amber-700' : 
                     brandSkin === 'ebn' ? 'text-yellow-200' :
                     brandSkin === 'ozzy' ? 'text-red-300' :
                     'text-yellow-200'
                   }`}>
                  TRASH TEAM
                </a>
                <span>×</span>
                <a href="https://nulltone.tv" target="_blank" rel="noopener noreferrer"
                   className={`hover:underline ${
                     brandSkin === 'waffle' ? 'text-amber-700' : 
                     brandSkin === 'ebn' ? 'text-yellow-200' :
                     brandSkin === 'ozzy' ? 'text-red-300' :
                     'text-yellow-200'
                   }`}>
                  NULLTONE.TV
                </a>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              <WorkspaceLayoutSaver />
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setResizableMode(!isResizableMode)}
                data-testid="button-toggle-resizable-mode"
                className={`flex items-center space-x-1 ${
                  isResizableMode
                    ? (brandSkin === 'testcard' ? 'text-blue-300 bg-blue-400/20' :
                       brandSkin === 'waffle' ? 'text-amber-800 bg-yellow-100/50' :
                       brandSkin === 'ebn' ? 'text-yellow-300 bg-purple-900/50' :
                       brandSkin === 'ozzy' ? 'text-red-300 bg-red-900/30' :
                       'text-yellow-300 bg-gray-800/50')
                    : (brandSkin === 'testcard' ? 'text-blue-400 hover:bg-blue-400/10' :
                       brandSkin === 'waffle' ? 'text-amber-800 hover:bg-yellow-100/50' :
                       brandSkin === 'ebn' ? 'text-yellow-300 hover:bg-purple-900/50' :
                       brandSkin === 'ozzy' ? 'text-red-300 hover:bg-red-900/30' :
                       'text-yellow-300 hover:bg-gray-800/50')
                }`}
              >
                {isResizableMode ? <Maximize2 size={14} /> : <Layout size={14} />}
                <span>{isResizableMode ? 'Panels' : 'Grid'}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetPanels}
                data-testid="button-reset-panels"
                className={`flex items-center space-x-1 ${
                  brandSkin === 'testcard' ? 'text-blue-400 hover:bg-blue-400/10' :
                  brandSkin === 'waffle' ? 'text-amber-800 hover:bg-yellow-100/50' : 
                  brandSkin === 'ebn' ? 'text-yellow-300 hover:bg-purple-900/50' :
                  brandSkin === 'ozzy' ? 'text-red-300 hover:bg-red-900/30' :
                  'text-yellow-300 hover:bg-gray-800/50'
                }`}
              >
                <Tv size={14} />
                <span>Reset</span>
              </Button>
              <Link href="/about">
                <Button variant="ghost" size="sm" className={`flex items-center space-x-1 ${
                  brandSkin === 'waffle' ? 'text-amber-800 hover:bg-yellow-100/50' : 
                  brandSkin === 'ebn' ? 'text-yellow-300 hover:bg-purple-900/50' :
                  brandSkin === 'ozzy' ? 'text-red-300 hover:bg-red-900/30' :
                  'text-yellow-300 hover:bg-gray-800/50'
                }`}>
                  <Info size={14} />
                  <span>About</span>
                </Button>
              </Link>
              <ThemeSwitcher />
              <DXButton />
              <HulksterButton />
              <WaffleButton />
              <OzzyButton />
              <EBNButton />
              <MaxButton />
              <MarioButton />
              <DakotaButton />
              <BlondieButton />
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

      {/* Main Content - Two-tier layout: Top content + Bottom timeline */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Content Area */}
        <div className="flex-1 overflow-hidden">
          {isResizableMode ? (
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
            <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-1 p-1 overflow-hidden">
              {/* Large Preview/Player Panel - Left Side (8 columns) */}
              <div className={`col-span-1 lg:col-span-8 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
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

              {/* Right Sidebar - 4 columns */}
              <div className="col-span-1 lg:col-span-4 flex flex-col gap-1">
                {/* Search/Results Panel */}
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
        <div className={`${panelStates.queueCollapsed ? 'h-16' : 'h-64'} rounded-lg border-2 mx-1 mb-1 overflow-hidden transition-all duration-300 ${
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

      {/* Device Prompt */}
      <DevicePrompt />

      {/* Footer */}
      <div className="flex-shrink-0">
        <Footer />
      </div>

      {/* DX Soundboard */}
      <DXSoundboard />

      {/* Welcome Modal */}
      <WelcomeModal />
    </div>
    </>
  );
}
