import { useState, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels';
import { GripVertical, GripHorizontal } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { Filters } from '@/components/Filters';
import { ResultsGrid } from '@/components/ResultsGrid';
import { Player } from '@/components/Player';
import { QueuePanel } from '@/components/QueuePanel';
import { EffectsPanel } from '@/components/EffectsPanel';
import { PanelHeader } from '@/components/PanelHeader';
import { useStore } from '@/lib/store';
import { type VideoResult } from '@/lib/types';

interface ResizablePanelsProps {
  searchResults: VideoResult[];
  totalResults: number;
  isLoading: boolean;
  onSearch: (query: string) => void;
  onVideoSelect: (video: VideoResult) => void;
}

export function ResizablePanels({ 
  searchResults, 
  totalResults, 
  isLoading, 
  onSearch, 
  onVideoSelect 
}: ResizablePanelsProps) {
  const { brandSkin, queueItems, panelSizes, setPanelSizes } = useStore();
  
  const handleLayoutChange = useCallback((sizes: number[]) => {
    setPanelSizes(sizes);
  }, [setPanelSizes]);

  const panelHeaderClass = `sticky top-0 z-10 ${
    brandSkin === 'testcard'
      ? 'glass-testcard border-slate-400/20'
      : brandSkin === 'waffle' 
      ? 'glass border-yellow-400/30' 
      : brandSkin === 'ebn'
      ? 'glass-dark border-lime-500/20'
      : brandSkin === 'ozzy'
      ? 'glass-ozzy border-red-500/30'
      : brandSkin === 'mario'
      ? 'glass-mario border-yellow-400/30'
      : 'glass-hogan border-yellow-400/30'
  }`;

  const resizeHandleClass = `${
    brandSkin === 'testcard'
      ? 'bg-slate-600/20 hover:bg-blue-400/30 border-slate-400/30'
      : brandSkin === 'waffle'
      ? 'bg-amber-600/20 hover:bg-amber-400/30 border-yellow-400/30'
      : brandSkin === 'ebn' 
      ? 'bg-lime-600/20 hover:bg-lime-400/30 border-lime-500/30'
      : brandSkin === 'ozzy'
      ? 'bg-red-600/20 hover:bg-red-400/30 border-red-500/30'
      : brandSkin === 'mario'
      ? 'bg-red-600/20 hover:bg-red-400/30 border-red-500/30'
      : 'bg-yellow-600/20 hover:bg-yellow-400/30 border-yellow-400/30'
  }`;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Row - Search, Preview, Effects */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup 
          direction="horizontal" 
          onLayout={handleLayoutChange}
          className="h-full"
        >
          {/* Search & Results Panel */}
          <Panel 
            defaultSize={panelSizes[0]} 
            minSize={20}
            className="flex flex-col"
          >
            <div className={panelHeaderClass}>
              <PanelHeader 
                title="SEARCH • RESULTS" 
                status={`${totalResults} ITEMS`}
                isCollapsed={false}
                onToggleCollapse={() => {}}
              />
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col p-4 space-y-4">
              <div className="space-y-3">
                <SearchBar onSearch={onSearch} />
                <Filters onFiltersChange={() => {}} />
              </div>
              
              <div className="flex-1 overflow-hidden">
                <ResultsGrid onVideoSelect={onVideoSelect} />
              </div>
            </div>
          </Panel>

          {/* Vertical Resize Handle */}
          <PanelResizeHandle className={`
            w-2 relative group transition-all duration-200
            ${resizeHandleClass}
            border-r border-l
          `}>
            <div className="absolute inset-y-0 left-0 w-full flex items-center justify-center">
              <GripVertical size={16} className={`
                transition-opacity duration-200 opacity-40 group-hover:opacity-80
                ${brandSkin === 'testcard' ? 'text-blue-400' :
                  brandSkin === 'waffle' ? 'text-amber-400' :
                  brandSkin === 'ebn' ? 'text-lime-400' :
                  brandSkin === 'ozzy' ? 'text-red-400' :
                  brandSkin === 'mario' ? 'text-red-400' :
                  'text-yellow-400'}
              `} />
            </div>
            
            {/* Snap Guide Indicators */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-12 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className={`w-full h-full rounded-l border-2 border-dashed ${
                brandSkin === 'testcard' ? 'border-blue-400/50' :
                brandSkin === 'waffle' ? 'border-amber-400/50' :
                brandSkin === 'ebn' ? 'border-lime-400/50' :
                brandSkin === 'ozzy' ? 'border-red-400/50' :
                brandSkin === 'mario' ? 'border-red-400/50' :
                'border-yellow-400/50'
              }`} />
            </div>
          </PanelResizeHandle>

          {/* Preview Panel */}
          <Panel 
            defaultSize={panelSizes[1]} 
            minSize={25}
            className="flex flex-col"
          >
            <div className={panelHeaderClass}>
              <PanelHeader 
                title="PREVIEW • PLAYER" 
                status="LIVE"
                isCollapsed={false}
                onToggleCollapse={() => {}}
              />
            </div>
            
            <div className="flex-1 overflow-hidden">
              <Player />
            </div>
          </Panel>

          {/* Vertical Resize Handle */}
          <PanelResizeHandle className={`
            w-2 relative group transition-all duration-200
            ${resizeHandleClass}
            border-r border-l
          `}>
            <div className="absolute inset-y-0 left-0 w-full flex items-center justify-center">
              <GripVertical size={16} className={`
                transition-opacity duration-200 opacity-40 group-hover:opacity-80
                ${brandSkin === 'testcard' ? 'text-blue-400' :
                  brandSkin === 'waffle' ? 'text-amber-400' :
                  brandSkin === 'ebn' ? 'text-lime-400' :
                  brandSkin === 'ozzy' ? 'text-red-400' :
                  brandSkin === 'mario' ? 'text-red-400' :
                  'text-yellow-400'}
              `} />
            </div>
          </PanelResizeHandle>

          {/* Effects Panel */}
          <Panel 
            defaultSize={panelSizes[2]} 
            minSize={20}
            className="flex flex-col"
          >
            <div className={panelHeaderClass}>
              <PanelHeader 
                title="EFFECTS • MIX" 
                status="ACTIVE"
                isCollapsed={false}
                onToggleCollapse={() => {}}
              />
            </div>
            
            <div className="flex-1 overflow-hidden">
              <EffectsPanel />
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Bottom Timeline Panel - Full Width */}
      <div className={`h-64 ${panelHeaderClass} border-t-2 ${
        brandSkin === 'testcard'
          ? 'border-slate-400/20'
          : brandSkin === 'waffle' 
          ? 'border-yellow-400/30' 
          : brandSkin === 'ebn'
          ? 'border-lime-500/20'
          : brandSkin === 'ozzy'
          ? 'border-red-500/30'
          : brandSkin === 'mario'
          ? 'border-yellow-400/30'
          : 'border-yellow-400/30'
      }`}>
        <PanelHeader 
          title="TIMELINE • QUEUE" 
          status={`${queueItems.length} TRACKS • RESIZABLE LONG`}
          isCollapsed={false}
          onToggleCollapse={() => {}}
        />
        
        <div className="flex-1 overflow-hidden p-4">
          <QueuePanel />
        </div>
      </div>
    </div>
  );
}