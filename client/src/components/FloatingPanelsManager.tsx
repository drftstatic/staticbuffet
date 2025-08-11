import React from 'react';
import { FloatingPanel } from './FloatingPanel';
import { useStore } from '@/lib/store';

// Import the existing panel components
import { Filters } from './Filters';
import { Player } from './Player';
import { QueuePanel } from './QueuePanel';
import { EffectsPanel } from './EffectsPanel';
import { ResultsGrid } from './ResultsGrid';


export function FloatingPanelsManager() {
  const { brandSkin, isFloatingMode, floatingPanelStates } = useStore();

  if (!isFloatingMode) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Search Results Panel - no duplicate search UI */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="search"
          title="Search Results"
          brandSkin={brandSkin}
        >
          <ResultsGrid onVideoSelect={() => {}} />
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

      {/* No separate results overlay needed - integrated into search panel */}
    </div>
  );
}