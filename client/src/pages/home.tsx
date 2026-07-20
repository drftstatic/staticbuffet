import { useCallback, useEffect } from 'react';
import { Tv, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/SearchBar';
import { Filters } from '@/components/Filters';
import { DetailDrawer } from '@/components/DetailDrawer';
import { ServiceStatus } from '@/components/ServiceStatus';
import { EffectPresetNotification } from '@/components/EffectPresetNotification';
import { BottomHUD } from '@/components/BottomHUD';
import { StatusBar } from '@/components/StatusBar';
import { AboutDialog } from '@/components/AboutDialog';
import { ResultsGrid } from '@/components/ResultsGrid';
import { Player } from '@/components/Player';
import { QueuePanel } from '@/components/QueuePanel';
import { MediaControls } from '@/components/MediaControls';
import { TrimControlsPanel } from '@/components/TrimControlsPanel';
import { LoopControlsPanel } from '@/components/LoopControlsPanel';
import { VideoEffectsPanel } from '@/components/VideoEffectsPanel';
import { PresetEffectsPanel } from '@/components/PresetEffectsPanel';
import { GeometryPanel } from '@/components/GeometryPanel';
import { EmergencyMix } from '@/components/EmergencyMix';
import { RackPanel } from '@/components/RackPanel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useStore } from '@/lib/store';
import { getTextClasses, getThemeClasses } from '@/lib/theme-utils';
import { useVideoSearch } from '@/hooks/use-video-search';
import { type VideoResult } from '@/lib/types';

export default function Home() {
  const { brandSkin, setSelectedVideo, setDetailDrawerOpen, queueItems, addToQueue } = useStore();
  const theme = getThemeClasses(brandSkin);

  // Home is the single observer that syncs the shared query into the store.
  const { isLoading, error, refetch } = useVideoSearch({ syncToStore: true });

  // Preload local video on first visit
  useEffect(() => {
    if (queueItems.length === 0) {
      const defaultVideo: VideoResult = {
        identifier: 'static-buffet-load-video',
        title: 'Static Buffet - Load Video',
        creator: 'Static Buffet VJ Tool',
        year: new Date().getFullYear().toString(),
        description: 'Local video file for Static Buffet VJ application - ready for mixing and live performance.',
        duration: '00:00',
        licenseurl: 'https://creativecommons.org/licenses/publicdomain/',
        downloads: 1,
        date: new Date().toISOString().split('T')[0]
      };
      addToQueue(defaultVideo, '/load_video.mp4');
      setTimeout(() => {
        const items = useStore.getState().queueItems;
        if (items.length > 0) {
          useStore.getState().updateQueueItem(items[0].id, { loop: true });
        }
      }, 100);
    }
  }, []);

  const handleVideoSelect = useCallback((video: VideoResult) => {
    setSelectedVideo(video);
    setDetailDrawerOpen(true);
  }, [setSelectedVideo, setDetailDrawerOpen]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden ebn-gradient">
      {/* Top Bar */}
      <header className={`flex-shrink-0 border-b relative z-40 ${theme.bg} ${theme.border}`}>
        <div className="w-full px-2 sm:px-4 py-1.5">
          <div className="flex items-center justify-between gap-4">
            {/* Search & Filters */}
            <div className="flex flex-col items-end space-y-1 min-w-0 flex-1 ml-auto">
              <div className="w-full">
                <SearchBar onSearch={() => {}} isLoading={isLoading} error={error} onRetry={() => refetch()} />
              </div>
              <div className="w-full flex justify-end">
                <ServiceStatus compact className="mr-2" />
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2 text-xs w-full">
                <Filters onFiltersChange={() => {}} />
              </div>
            </div>

            <div className="h-12 w-px bg-lime-500/30 mx-3" />

            {/* Branding & Controls */}
            <div className="flex flex-col items-end justify-center space-y-1 flex-shrink-0">
              <div className="flex flex-col items-end space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h1 className={`font-bold text-lg min-w-[200px] text-right ${getTextClasses(brandSkin, 'primary')}`}>
                    STATIC BUFFET
                  </h1>
                  <Tv size={20} className={theme.accent} />
                </div>
                <div className="flex items-center space-x-1 text-xs opacity-60">
                  <a href="https://trashteam.tv" target="_blank" rel="noopener noreferrer" className={`hover:underline ${getTextClasses(brandSkin, 'secondary')}`}>
                    TRASH TEAM
                  </a>
                  <span>×</span>
                  <a href="https://nulltone.tv" target="_blank" rel="noopener noreferrer" className={`hover:underline ${getTextClasses(brandSkin, 'secondary')}`}>
                    NULLTONE.TV
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <AboutDialog>
                  <Button variant="ghost" size="sm" className={`p-2 ${theme.hover}`} title="About">
                    <HelpCircle size={16} className={theme.accent} />
                  </Button>
                </AboutDialog>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Fixed three-zone workspace: Crate | Signal | Timeline */}
      <div className="flex-1 grid grid-cols-[minmax(300px,360px)_minmax(0,1fr)_minmax(320px,400px)] gap-2 p-2 pb-8 min-h-0">
        {/* The Crate — search results */}
        <aside className={`min-h-0 flex flex-col rounded-lg border ${theme.border} ${theme.bg} overflow-hidden`}>
          <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b ${theme.border} ${getTextClasses(brandSkin, 'secondary')}`}>
            The Crate
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ResultsGrid onVideoSelect={handleVideoSelect} />
          </div>
        </aside>

        {/* The Signal — program output and playback controls */}
        <main className="min-h-0 flex flex-col gap-2 overflow-hidden">
          <div className={`flex-1 min-h-0 rounded-lg border ${theme.border} ${theme.bg} overflow-hidden flex flex-col`}>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <Player />
            </div>
          </div>
          <div className={`flex-shrink-0 rounded-lg border ${theme.border} ${theme.bg}`}>
            <MediaControls />
          </div>
        </main>

        {/* The Timeline — queue and effects */}
        <aside className={`min-h-0 flex flex-col rounded-lg border ${theme.border} ${theme.bg} overflow-hidden`}>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <QueuePanel />
          </div>
          <div className={`flex-shrink-0 max-h-[45%] overflow-y-auto border-t ${theme.border}`}>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="rack" className="border-b-0">
                <AccordionTrigger className={`px-3 py-2 text-xs uppercase tracking-wider ${getTextClasses(brandSkin, 'secondary')}`}>
                  Rack
                </AccordionTrigger>
                <AccordionContent>
                  <RackPanel />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="effects" className="border-b-0">
                <AccordionTrigger className={`px-3 py-2 text-xs uppercase tracking-wider ${getTextClasses(brandSkin, 'secondary')}`}>
                  Effects
                </AccordionTrigger>
                <AccordionContent>
                  <VideoEffectsPanel />
                  <PresetEffectsPanel />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="geometry" className="border-b-0">
                <AccordionTrigger className={`px-3 py-2 text-xs uppercase tracking-wider ${getTextClasses(brandSkin, 'secondary')}`}>
                  Geometry
                </AccordionTrigger>
                <AccordionContent>
                  <GeometryPanel />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="trim" className="border-b-0">
                <AccordionTrigger className={`px-3 py-2 text-xs uppercase tracking-wider ${getTextClasses(brandSkin, 'secondary')}`}>
                  Trim &amp; Loop
                </AccordionTrigger>
                <AccordionContent>
                  <TrimControlsPanel />
                  <LoopControlsPanel />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="emergency" className="border-b-0">
                <AccordionTrigger className={`px-3 py-2 text-xs uppercase tracking-wider ${getTextClasses(brandSkin, 'secondary')}`}>
                  Emergency Mix
                </AccordionTrigger>
                <AccordionContent>
                  <EmergencyMix />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </aside>
      </div>

      <DetailDrawer />
      <BottomHUD />
      <StatusBar />
      <EffectPresetNotification />
    </div>
  );
}
