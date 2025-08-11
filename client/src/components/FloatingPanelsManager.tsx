import React from 'react';
import { FloatingPanel } from './FloatingPanel';
import { useStore } from '@/lib/store';

// Import the existing panel components
import { Filters } from './Filters';
import { Player } from './Player';
import { QueuePanel } from './QueuePanel';
import { EffectsPanel } from './EffectsPanel';
import { ResultsGrid } from './ResultsGrid';
import { SearchBar } from './SearchBar';

export function FloatingPanelsManager() {
  const { brandSkin, isFloatingMode, floatingPanelStates } = useStore();

  if (!isFloatingMode) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Search Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="search"
          title="Search & Filters"
          brandSkin={brandSkin}
        >
          <div className="space-y-4">
            <SearchBar />
            <Filters />
          </div>
        </FloatingPanel>
      </div>

      {/* Player Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="player"
          title="Video Player"
          brandSkin={brandSkin}
        >
          <Player />
        </FloatingPanel>
      </div>

      {/* Queue Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="queue"
          title="Queue Manager"
          brandSkin={brandSkin}
        >
          <QueuePanel />
        </FloatingPanel>
      </div>

      {/* Effects Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="effects"
          title="Effects Studio"
          brandSkin={brandSkin}
        >
          <EffectsPanel />
        </FloatingPanel>
      </div>

      {/* Results overlay - positioned next to search panel */}
      <div className="pointer-events-auto fixed bg-black/80 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-600"
           style={{
             left: Math.min(floatingPanelStates.search.x + floatingPanelStates.search.width + 10, window.innerWidth - 620),
             top: floatingPanelStates.search.y,
             width: Math.max(600, Math.min(800, window.innerWidth - floatingPanelStates.search.x - floatingPanelStates.search.width - 30)),
             height: floatingPanelStates.search.height,
             zIndex: 35,
           }}>
        <div className="p-4 h-full overflow-auto">
          <h3 className="text-lg font-semibold mb-4 text-white">Search Results</h3>
          <ResultsGrid />
        </div>
      </div>
    </div>
  );
}