import { useCallback, useEffect, useState } from 'react';
import { Tv, Info, Move, HelpCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/SearchBar';
import { Filters } from '@/components/Filters';
import { DetailDrawer } from '@/components/DetailDrawer';
import { EffectPresetNotification } from '@/components/EffectPresetNotification';
import { BottomHUD } from '@/components/BottomHUD';
import { StatusBar } from '@/components/StatusBar';
import { StreamlinedWelcome } from '@/components/StreamlinedWelcome';
import { ThemeSelector } from '@/components/ThemeSelector';
import { FloatingPanelsManager } from '@/components/FloatingPanelsManager';
import { DevicePrompt } from '@/components/DevicePrompt';
import { MainToolbar } from '@/components/MainToolbar';
import { ToolsPanel } from '@/components/ToolsPanel';
import { AboutDialog } from '@/components/AboutDialog';
import { useStore } from '@/lib/store';
import { getTextClasses, getThemeClasses } from '@/lib/theme-utils';
import { searchVideos } from '@/lib/archive-api';
import { type VideoResult } from '@/lib/types';
import { FirstRunTour } from '@/components/FirstRunTour';
import { ResponsiveLayoutManager } from '@/components/ResponsiveLayoutManager';

import { useResponsiveLayout } from '@/hooks/use-responsive-layout';
import { FadeTransition, SlideTransition, ThemeTransition } from '@/components/AnimatedTransitions';

export default function Home() {
  const {
    brandSkin,
    searchState,
    setSelectedVideo,
    setDetailDrawerOpen,
    queueItems,
    setSearchResults,
    setTotalResults,
    addToQueue,
    
    // Effects modes
    isAsciiMode,
    isBlondieGeometryMode
  } = useStore();

  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  // Search functionality with improved reliability
  const { data: searchData, isLoading, error, refetch } = useQuery({
    queryKey: ['search', searchState.query, searchState.yearFrom, searchState.yearTo, searchState.duration, searchState.license, searchState.sort, searchState.page, searchState.sources],
    queryFn: () => searchVideos(searchState),
    enabled: !!searchState.query && searchState.query.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes (reduced from 5)
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    retry: (failureCount, error) => {
      // Don't retry on specific errors
      if (error instanceof Error) {
        if (error.message.includes('Rate limited') || 
            error.message.includes('AbortError') ||
            error.message.includes('empty')) {
          return false;
        }
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff, max 30s
  });

  const searchResults = searchData ? (searchData as any).docs || [] : [];
  const totalResults = searchData ? (searchData as any).numFound || 0 : 0;

  // Update store with search results and handle errors
  useEffect(() => {
    if (searchResults.length > 0) {
      setSearchResults(searchResults);
      setTotalResults(totalResults);
    }
  }, [searchResults, totalResults, setSearchResults, setTotalResults]);

  // Log search errors for debugging
  useEffect(() => {
    if (error) {
      console.error('Search error:', error);
    }
  }, [error]);

  // Preload default Atari 2600 commercial on first visit
  useEffect(() => {
    // Only add if queue is empty to avoid duplicates
    if (queueItems.length === 0) {
      const defaultVideo: VideoResult = {
        identifier: 'atari-2600-1986-television-commercial-480p',
        title: 'Atari 2600 Television Commercial (1986)',
        creator: 'Atari Corporation',
        year: '1986',
        description: 'Classic Atari 2600 television commercial from 1986',
        duration: '0:30',
        licenseurl: 'https://creativecommons.org/licenses/publicdomain/',
        downloads: 50000,
        date: '1986-01-01'
      };

      const videoUrl = 'https://archive.org/download/atari-2600-1986-television-commercial-480p/atari-2600-1986-television-commercial-480p.mp4';
      
      console.log('🎮 Preloading default Atari 2600 commercial');
      addToQueue(defaultVideo, videoUrl);
    }
  }, []); // Empty dependency array to run only once on mount

  const handleSearch = useCallback((query: string) => {
    console.log('handleSearch called with query:', query);
    // Update search state to trigger React Query
    // Note: setSearchState should be called from SearchBar component directly
  }, []);

  const handleVideoSelect = useCallback((video: VideoResult) => {
    setSelectedVideo(video);
    setDetailDrawerOpen(true);
  }, [setSelectedVideo, setDetailDrawerOpen]);

  const handleFiltersChange = useCallback(() => {
    // Filters change handled by React Query
  }, []);


  // Responsive layout hook
  const { isMobile } = useResponsiveLayout();

  return (
    <ResponsiveLayoutManager>
    <div className={`h-screen w-screen flex flex-col transition-all duration-500 overflow-hidden ${
        isAsciiMode 
        ? 'ascii-terminal-mode bg-black text-green-400 font-mono'
        : brandSkin === 'testcard'
        ? 'testcard-gradient testcard-grid'
        : brandSkin === 'waffle'
        ? 'waffle-gradient waffle-texture'
        : brandSkin === 'ebn'
        ? 'ebn-gradient'
        : brandSkin === 'ozzy'
        ? 'ozzy-gradient'
        : brandSkin === 'hogan'
        ? 'hogan-gradient'
        : brandSkin === 'dx'
        ? 'dx-gradient dx-pulse'
        : brandSkin === 'mario'
        ? 'mario-gradient mario-sparkles mario-powerup'
        : brandSkin === 'maxheadroom'
        ? 'maxheadroom-gradient terminal-flicker'
        : brandSkin === 'dakota'
        ? 'dakota-gradient'
        : brandSkin === 'blondie' && isBlondieGeometryMode
        ? 'blondie-gradient blondie-geometry'
        : brandSkin === 'blondie'
        ? 'blondie-gradient'
        : 'brand-testcard'
    }`}>
      {/* Top Bar */}
      <header className={`flex-shrink-0 border-b transition-all duration-300 relative z-40 ${
        brandSkin === 'testcard'
          ? `${getThemeClasses(brandSkin).bg} ${getThemeClasses(brandSkin).border}`
          : brandSkin === 'waffle' 
          ? `${getThemeClasses(brandSkin).bg} ${getThemeClasses(brandSkin).border}` 
          : brandSkin === 'ebn'
          ? `${getThemeClasses(brandSkin).bg} ${getThemeClasses(brandSkin).border}`
          : brandSkin === 'ozzy'
          ? `${getThemeClasses(brandSkin).bg} ${getThemeClasses(brandSkin).border}`
          : brandSkin === 'hogan'
          ? `${getThemeClasses(brandSkin).bg} ${getThemeClasses(brandSkin).border}`
          : brandSkin === 'dx'
          ? `${getThemeClasses(brandSkin).bg} ${getThemeClasses(brandSkin).border}`
          : brandSkin === 'maxheadroom'
          ? `${getThemeClasses(brandSkin).bg} ${getThemeClasses(brandSkin).border}`
          : brandSkin === 'mario'
          ? `${getThemeClasses(brandSkin).bg} ${getThemeClasses(brandSkin).border}`
          : brandSkin === 'dakota'
          ? `${getThemeClasses(brandSkin).bg} ${getThemeClasses(brandSkin).border}`
          : brandSkin === 'blondie'
          ? `${getThemeClasses(brandSkin).bg} ${getThemeClasses(brandSkin).border}`
          : brandSkin === 'diner'
          ? `${getThemeClasses(brandSkin).bg} ${getThemeClasses(brandSkin).border}`
          : `${getThemeClasses(brandSkin).bg} ${getThemeClasses(brandSkin).border}`
      }`}>
        <div className="w-full px-2 sm:px-4 py-1.5">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section - Search & Filters (Scalable with window) */}
            <div className="flex flex-col items-end space-y-1 min-w-0 flex-1 ml-auto">
              <div className="w-full">
                <SearchBar onSearch={handleSearch} isLoading={isLoading} error={error} />
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2 text-xs w-full">
                <Filters onFiltersChange={handleFiltersChange} />
              </div>
            </div>

            {/* Visual Divider */}
            <div className={`h-12 w-px ${brandSkin === 'testcard' ? 'bg-slate-400/30' : 
              brandSkin === 'waffle' ? 'bg-yellow-600/30' :
              brandSkin === 'ebn' ? 'bg-lime-500/30' :
              brandSkin === 'ozzy' ? 'bg-red-500/30' :
              brandSkin === 'hogan' ? 'bg-yellow-400/30' :
              brandSkin === 'dx' ? 'bg-green-400/30' :
              brandSkin === 'maxheadroom' ? 'bg-cyan-400/30' :
              brandSkin === 'mario' ? 'bg-red-400/30' :
              brandSkin === 'dakota' ? 'bg-gray-400/30' :
              brandSkin === 'blondie' ? 'bg-amber-400/30' :
              'bg-white/20'} mx-3`} />

            {/* Right Section - Branding & Controls (Fixed) */}
            <div className="flex flex-col items-end justify-center space-y-1 flex-shrink-0">
              {/* Branding */}
              <div className="flex flex-col items-end space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h1 className={`font-bold text-lg min-w-[200px] text-right ${getTextClasses(brandSkin, 'primary')}`}>
                    {brandSkin === 'blondie' && isBlondieGeometryMode ? 'PARALLEL BUFFET' :
                    brandSkin === 'testcard' ? 'STATIC BUFFET' :
                    brandSkin === 'waffle' ? 'SYRUP BUFFET' :
                    brandSkin === 'ebn' ? 'HIJACK BUFFET' :
                    brandSkin === 'ozzy' ? 'METAL BUFFET' :
                    brandSkin === 'hogan' ? 'BROTHER BUFFET' :
                    brandSkin === 'dx' ? 'REBEL BUFFET' :
                    brandSkin === 'maxheadroom' ? 'DIGITAL BUFFET' :
                    brandSkin === 'mario' ? 'POWER-UP BUFFET' :
                    brandSkin === 'dakota' ? 'VANILLA BUFFET' :
                    brandSkin === 'blondie' ? 'NO 🎧 NO BUFFET' :
                    'STATIC BUFFET'}
                  </h1>
                  <Tv size={20} className={getThemeClasses(brandSkin).accent} />
                </div>
                <div className="flex items-center space-x-1 text-xs opacity-60">
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
              
              {/* Controls */}
              <div className="flex items-center space-x-2 pt-1">
                <ThemeSelector />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Show welcome modal
                    (window as any).showStaticBuffetWelcome?.();
                  }}
                  className={`p-2 ${getThemeClasses(brandSkin).hover}`}
                  title="Welcome Guide"
                >
                  <Info size={16} className={getThemeClasses(brandSkin).accent} />
                </Button>
                <AboutDialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-2 ${getThemeClasses(brandSkin).hover}`}
                    title="About"
                  >
                    <HelpCircle size={16} className={getThemeClasses(brandSkin).accent} />
                  </Button>
                </AboutDialog>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Panel Workspace - Account for status bar */}
      <div className="flex-1 flex flex-col overflow-hidden pb-6">
        <div className="flex-1 overflow-hidden relative">
          {/* Background workspace - behind panels */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-none">
            <div className="flex items-center justify-center h-full text-white/40">
              <div className="text-center">
                <Move size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg opacity-50">Floating Panel Workspace</p>
                <p className="text-sm opacity-40">Drag panels by their headers • Click lock icons to lock/unlock</p>
              </div>
            </div>
          </div>
          
          {/* Floating panels - above background */}
          <FloatingPanelsManager />
          
          {/* Persistent Tools Panel */}
          <ToolsPanel />
        </div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer />

      {/* Bottom HUD (EBN mode only) */}
      <BottomHUD />
      
      {/* Status Bar - Always visible */}
      <StatusBar />

      {/* Effect Preset Notifications */}
      <EffectPresetNotification />

      {/* Device Prompt - positioned lower to avoid control panel overlap */}
      <div className="absolute top-20 right-4 z-30">
        <DevicePrompt />
      </div>

      {/* Streamlined Modals - consolidated */}
      <StreamlinedWelcome />
      <FirstRunTour />
      
      {/* Mario Pipe Effect */}
    </div>
    </ResponsiveLayoutManager>
  );
}