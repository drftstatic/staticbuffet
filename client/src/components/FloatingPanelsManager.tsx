import React from 'react';
import { FloatingPanel } from './FloatingPanel';
import { useStore } from '@/lib/store';

// Import the existing panel components
import { Filters } from './Filters';
import { Player } from './Player';
import { QueuePanel } from './QueuePanel';
import { ResultsGrid } from './ResultsGrid';
import { LiveVideoMode } from './LiveVideoMode';
import { RecordSetPanel } from './RecordSetPanel';
import { LoopControlsPanel } from './LoopControlsPanel';
import { PresetEffectsPanel } from './PresetEffectsPanel';
import { MediaControls } from './MediaControls';
import { EmergencyMix } from './EmergencyMix';
import { LuckyDip } from './LuckyDip';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { PreviewPanel } from './PreviewPanel';
import { VideoEffectsPanel } from './VideoEffectsPanel';
import { AudioEffectsPanel } from './AudioEffectsPanel';


export function FloatingPanelsManager() {
  const { brandSkin, isFloatingMode, floatingPanelStates } = useStore();

  if (!isFloatingMode) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
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
          title="📺 Program Output"
          brandSkin={brandSkin}
        >
          <Player />
        </FloatingPanel>
      </div>

      {/* Timeline Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="queue"
          title="🎬 Timeline"
          brandSkin={brandSkin}
        >
          <QueuePanel />
        </FloatingPanel>
      </div>


      {/* Live Video Input Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="liveVideo"
          title="📹 Live Video Input"
          brandSkin={brandSkin}
        >
          <LiveVideoMode />
        </FloatingPanel>
      </div>

      {/* Record Set Micro Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="recordSet"
          title="📝 Record Set"
          brandSkin={brandSkin}
        >
          <RecordSetPanel />
        </FloatingPanel>
      </div>

      {/* Loop Controls Micro Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="loopControls"
          title="🔄 Loop Controls"
          brandSkin={brandSkin}
        >
          <LoopControlsPanel />
        </FloatingPanel>
      </div>


      {/* Preset Effects Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="presetEffects"
          title="✨ Quick Effects"
          brandSkin={brandSkin}
        >
          <PresetEffectsPanel />
        </FloatingPanel>
      </div>

      {/* Results Grid Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="resultsGrid"
          title="📺 Browse Results"
          brandSkin={brandSkin}
        >
          <ResultsGrid onVideoSelect={() => {}} />
        </FloatingPanel>
      </div>

      {/* Media Controls Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="mediaControls"
          title="🎮 Media Controls"
          brandSkin={brandSkin}
        >
          <MediaControls />
        </FloatingPanel>
      </div>


      {/* Emergency Mix Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="emergencyMix"
          title="🚨 Emergency Mix"
          brandSkin={brandSkin}
        >
          <EmergencyMix />
        </FloatingPanel>
      </div>

      {/* Lucky Dip Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="luckyDip"
          title="🎲 Lucky Dip"
          brandSkin={brandSkin}
        >
          <LuckyDip onDipResults={() => {}} />
        </FloatingPanel>
      </div>

      {/* Keyboard Shortcuts Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="keyboardShortcuts"
          title="⌨️ Keyboard Shortcuts"
          brandSkin={brandSkin}
        >
          <KeyboardShortcuts />
        </FloatingPanel>
      </div>

      {/* Preview Panel */}
      {floatingPanelStates.preview?.visible && (
        <div className="pointer-events-auto">
          <FloatingPanel
            id="preview"
            title="👁️ Preview"
            brandSkin={brandSkin}
          >
            <PreviewPanel />
          </FloatingPanel>
        </div>
      )}

      {/* Video Effects Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="videoEffects"
          title="🎨 Video Effects"
          brandSkin={brandSkin}
        >
          <VideoEffectsPanel />
        </FloatingPanel>
      </div>

      {/* Audio Effects Panel */}
      <div className="pointer-events-auto">
        <FloatingPanel
          id="audioEffects"
          title="🎵 Audio Effects"
          brandSkin={brandSkin}
        >
          <AudioEffectsPanel />
        </FloatingPanel>
      </div>
    </div>
  );
}