import { create } from 'zustand';
import { type BrandSkin, type AppState, type VideoResult, type QueueItem, type SearchState, type VideoEffects, type AudioEffects, type WorkspaceLayout, type PanelStates, type FloatingPanelStates, type PanelPosition } from './types';

interface AppStore extends AppState {
  // Theme actions
  setBrandSkin: (skin: BrandSkin) => void;
  
  // Search actions
  setSearchState: (state: Partial<SearchState>) => void;
  setSearchResults: (results: VideoResult[]) => void;
  setTotalResults: (total: number) => void;
  setLoading: (loading: boolean) => void;
  
  // Detail drawer actions
  setSelectedVideo: (video: VideoResult | null) => void;
  setDetailDrawerOpen: (open: boolean) => void;
  
  // Queue actions
  addToQueue: (video: VideoResult, videoUrl: string, addToFront?: boolean) => void;
  removeFromQueue: (id: string) => void;
  updateQueueItem: (id: string, updates: Partial<QueueItem>) => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  clearQueue: () => void;
  
  // Player actions
  setPlaying: (playing: boolean) => void;
  setCurrentQueueIndex: (index: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  
  // Audio reactive
  setAudioReactive: (reactive: boolean) => void;
  setQueueItems: (items: QueueItem[]) => void;
  
  // Timeline loop control
  setTimelineLoop: (loop: boolean) => void;
  
  // Effects
  setVideoEffects: (effects: VideoEffects) => void;
  setAudioEffects: (effects: AudioEffects) => void;
  
  // Panel actions
  togglePanelCollapse: (panel: 'search' | 'player' | 'queue' | 'effects') => void;
  resetPanels: () => void;
  
  // Floating panels
  floatingPanelStates: FloatingPanelStates;
  isFloatingMode: boolean;
  setFloatingMode: (enabled: boolean) => void;
  updatePanelPosition: (panel: keyof FloatingPanelStates, position: Partial<PanelPosition>) => void;
  togglePanelLock: (panel: keyof FloatingPanelStates) => void;
  bringPanelToFront: (panel: keyof FloatingPanelStates) => void;
  
  // Adaptive color actions
  setAdaptiveColorsEnabled: (enabled: boolean) => void;
  setAdaptiveIntensity: (intensity: number) => void;
  setCurrentVideoPalette: (palette: any) => void;

  // Workspace Layout actions
  saveWorkspaceLayout: (name: string, description?: string) => void;
  loadWorkspaceLayout: (layoutId: string) => void;
  deleteWorkspaceLayout: (layoutId: string) => void;
  updateWorkspaceLayout: (layoutId: string, updates: Partial<Pick<WorkspaceLayout, 'name' | 'description' | 'panelStates' | 'layoutMode' | 'panelSizes'>>) => void;
  
  // Layout mode state
  setResizableMode: (mode: boolean) => void;
  setPanelSizes: (sizes: number[]) => void;
  
  // Easter Egg actions
  setHulksterMode: (enabled: boolean) => void;
  isDXMode: boolean;
  setDXMode: (enabled: boolean) => void;
  isAsciiMode: boolean;
  setAsciiMode: (enabled: boolean) => void;
  isMarioMode: boolean;
  setMarioMode: (enabled: boolean) => void;
  isDakotaVanillaMode: boolean;
  setDakotaVanillaMode: (enabled: boolean) => void;
  isBlondieGeometryMode: boolean;
  setBlondieGeometryMode: (enabled: boolean) => void;
}

export const useStore = create<AppStore>((set, get) => ({
  // Initial state
  brandSkin: 'testcard',
  isHulksterMode: false,
  isDXMode: false,
  isAsciiMode: false,
  isMarioMode: false,
  isDakotaVanillaMode: false,
  isBlondieGeometryMode: false,
  isResizableMode: true,
  panelSizes: [30, 40, 30],
  
  // Floating panel states
  isFloatingMode: false,
  floatingPanelStates: {
    search: {
      x: 20,
      y: 100,
      width: 400,
      height: 600,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
    },
    player: {
      x: 440,
      y: 100,
      width: 500,
      height: 400,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
    },
    queue: {
      x: 960,
      y: 100,
      width: 400,
      height: 600,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
    },
    effects: {
      x: 440,
      y: 520,
      width: 500,
      height: 300,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
    },
  },
  
  // Adaptive colors state
  adaptiveColorsEnabled: false,
  adaptiveIntensity: 0.7,
  currentVideoPalette: null,
  searchState: {
    query: '',
    yearFrom: '1950',
    yearTo: '2025',
    duration: 'any',
    license: 'publicdomain',
    sort: 'downloads',
    page: 1,
    sources: ['prelinger', 'fedflix'],
    allowRestrictedLicenses: false,
  },
  searchResults: [],
  selectedVideo: null,
  isDetailDrawerOpen: false,
  queueItems: [],
  isPlaying: false,
  currentQueueIndex: 0,
  isAudioReactive: false,
  isLoading: false,
  totalResults: 0,
  timelineLoop: false,
  
  // Panel state
  panelStates: {
    searchCollapsed: false,
    playerCollapsed: false,
    queueCollapsed: false,
    effectsCollapsed: false,
  },
  
  // Workspace layouts - Load from localStorage or use defaults
  savedWorkspaceLayouts: (() => {
    try {
      const saved = localStorage.getItem('staticBuffetWorkspaceLayouts');
      if (saved) {
        return JSON.parse(saved);
      }
      
      // Default layouts for first-time users
      const defaultLayouts: WorkspaceLayout[] = [
        {
          id: 'default_full_interface',
          name: '🎛️ Full Interface',
          description: '3-panel top row + full-width timeline for complete VJ control',
          panelStates: {
            searchCollapsed: false,
            playerCollapsed: false,
            queueCollapsed: false,
            effectsCollapsed: false,
          },
          layoutMode: 'panels',
          panelSizes: [30, 40, 30],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'default_performance',
          name: '🎬 Performance Mode',
          description: 'Player-focused top + long timeline for live mixing',
          panelStates: {
            searchCollapsed: false,
            playerCollapsed: false,
            queueCollapsed: false,
            effectsCollapsed: false,
          },
          layoutMode: 'panels',
          panelSizes: [20, 60, 20],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'default_preparation',
          name: '📚 Preparation Mode',
          description: 'Search-focused top + timeline for content preparation',
          panelStates: {
            searchCollapsed: false,
            playerCollapsed: false,
            queueCollapsed: false,
            effectsCollapsed: false,
          },
          layoutMode: 'panels',
          panelSizes: [50, 30, 20],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'default_grid_layout',
          name: '⌗ Grid Layout',
          description: 'Traditional grid top + dedicated bottom timeline',
          panelStates: {
            searchCollapsed: false,
            playerCollapsed: false,
            queueCollapsed: false,
            effectsCollapsed: false,
          },
          layoutMode: 'grid',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      // Save defaults to localStorage
      localStorage.setItem('staticBuffetWorkspaceLayouts', JSON.stringify(defaultLayouts));
      return defaultLayouts;
    } catch {
      return [];
    }
  })(),
  
  // Effects state
  videoEffects: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    opacity: 100,
    grayscale: 0,
    invert: 0,
    sepia: 0,
    rotate: 0,
    scaleX: 100,
    scaleY: 100,
    glitchIntensity: 0,
    chromaticAberration: 0,
    scanlines: false,
    datamosh: false,
    pixelate: 0,
  },
  audioEffects: {
    gain: 100,
    bass: 0,
    mid: 0,
    treble: 0,
    distortion: 0,
    reverb: 0,
    delay: 0,
    chorus: 0,
    bitcrush: 0,
    lowpass: 20000,
    highpass: 20,
  },

  // Theme actions
  setBrandSkin: (skin) => set({ brandSkin: skin }),
  
  // Easter Egg actions
  setHulksterMode: (enabled) => set({ isHulksterMode: enabled }),
  setDXMode: (enabled) => set({ isDXMode: enabled }),
  setAsciiMode: (enabled) => set({ isAsciiMode: enabled }),

  // Search actions
  setSearchState: (updates) => set((state) => ({
    searchState: { ...state.searchState, ...updates }
  })),
  
  setSearchResults: (results) => set({ searchResults: results }),
  setTotalResults: (total) => set({ totalResults: total }),
  setLoading: (loading) => set({ isLoading: loading }),

  // Detail drawer actions
  setSelectedVideo: (video) => set({ selectedVideo: video }),
  setDetailDrawerOpen: (open) => set({ isDetailDrawerOpen: open }),

  // Queue actions
  addToQueue: (video, videoUrl, addToFront = false) => {
    console.log('🎯 Store: Adding to queue', {
      identifier: video.identifier,
      videoUrl,
      addToFront
    });
    
    const newItem: QueueItem = {
      id: `${video.identifier}-${Date.now()}`,
      identifier: video.identifier,
      title: video.title,
      creator: video.creator,
      duration: video.duration || '0:00',
      videoUrl,
      trimIn: '00:00',
      trimOut: video.duration || '0:00',
      loop: false,
      loopCount: 0, // 0 = infinite loops
      crossfade: false,
      license: video.licenseurl,
      attribution: video.creator,
    };
    
    set((state) => {
      const newQueue = addToFront 
        ? [newItem, ...state.queueItems]
        : [...state.queueItems, newItem];
      
      console.log('📊 Queue updated:', {
        oldLength: state.queueItems.length,
        newLength: newQueue.length,
        currentIndex: state.currentQueueIndex,
        firstItem: newQueue[0]?.identifier
      });
      
      return {
        queueItems: newQueue,
        // If this is the first item, set current index to 0
        currentQueueIndex: state.queueItems.length === 0 ? 0 : state.currentQueueIndex
      };
    });
  },

  removeFromQueue: (id) => set((state) => ({
    queueItems: state.queueItems.filter(item => item.id !== id)
  })),

  updateQueueItem: (id, updates) => set((state) => ({
    queueItems: state.queueItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    )
  })),

  reorderQueue: (startIndex, endIndex) => set((state) => {
    const result = Array.from(state.queueItems);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return { queueItems: result };
  }),

  clearQueue: () => set({ queueItems: [] }),

  // Player actions
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentQueueIndex: (index) => set({ currentQueueIndex: index }),
  
  nextTrack: () => set((state) => {
    const nextIndex = (state.currentQueueIndex + 1) % state.queueItems.length;
    return { currentQueueIndex: nextIndex };
  }),
  
  previousTrack: () => set((state) => {
    const prevIndex = state.currentQueueIndex === 0 
      ? state.queueItems.length - 1 
      : state.currentQueueIndex - 1;
    return { currentQueueIndex: prevIndex };
  }),

  // Audio reactive
  setAudioReactive: (reactive) => set({ isAudioReactive: reactive }),
  
  // Set entire queue
  setQueueItems: (items) => set({ queueItems: items }),
  
  // Timeline loop control
  setTimelineLoop: (loop) => set({ timelineLoop: loop }),
  
  // Effects actions
  setVideoEffects: (effects) => set({ videoEffects: effects }),
  setAudioEffects: (effects) => set({ audioEffects: effects }),
  
  // Panel actions
  togglePanelCollapse: (panel) => set((state) => ({
    panelStates: {
      ...state.panelStates,
      [`${panel}Collapsed`]: !state.panelStates[`${panel}Collapsed` as keyof typeof state.panelStates]
    }
  })),
  
  resetPanels: () => set(() => ({
    panelStates: {
      searchCollapsed: false,
      playerCollapsed: false,
      queueCollapsed: false,
      effectsCollapsed: false,
    }
  })),
  
  // Adaptive color actions
  setAdaptiveColorsEnabled: (enabled: boolean) => set({ adaptiveColorsEnabled: enabled }),
  setAdaptiveIntensity: (intensity: number) => set({ adaptiveIntensity: intensity }),
  setCurrentVideoPalette: (palette: any) => set({ currentVideoPalette: palette }),

  // Layout mode actions
  setResizableMode: (mode: boolean) => set({ isResizableMode: mode }),
  setPanelSizes: (sizes: number[]) => set({ panelSizes: sizes }),

  // Workspace Layout actions
  saveWorkspaceLayout: (name: string, description?: string) => {
    const currentState = get();
    const newLayout: WorkspaceLayout = {
      id: `layout_${Date.now()}`,
      name,
      description,
      panelStates: { ...currentState.panelStates },
      layoutMode: currentState.isResizableMode ? 'panels' : 'grid',
      panelSizes: currentState.isResizableMode ? [...currentState.panelSizes] : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set((state) => ({
      savedWorkspaceLayouts: [...state.savedWorkspaceLayouts, newLayout]
    }));
    
    // Save to localStorage for persistence
    const updatedLayouts = [...currentState.savedWorkspaceLayouts, newLayout];
    localStorage.setItem('staticBuffetWorkspaceLayouts', JSON.stringify(updatedLayouts));
  },

  loadWorkspaceLayout: (layoutId: string) => {
    const currentState = get();
    const layout = currentState.savedWorkspaceLayouts.find(l => l.id === layoutId);
    if (layout) {
      set({ 
        panelStates: { ...layout.panelStates },
        isResizableMode: layout.layoutMode === 'panels',
        panelSizes: layout.panelSizes || [30, 40, 30]
      });
    }
  },

  deleteWorkspaceLayout: (layoutId: string) => {
    set((state) => {
      const updatedLayouts = state.savedWorkspaceLayouts.filter(l => l.id !== layoutId);
      
      // Update localStorage
      localStorage.setItem('staticBuffetWorkspaceLayouts', JSON.stringify(updatedLayouts));
      
      return { savedWorkspaceLayouts: updatedLayouts };
    });
  },

  updateWorkspaceLayout: (layoutId: string, updates: Partial<Pick<WorkspaceLayout, 'name' | 'description' | 'panelStates' | 'layoutMode' | 'panelSizes'>>) => {
    set((state) => {
      const updatedLayouts = state.savedWorkspaceLayouts.map(layout => 
        layout.id === layoutId 
          ? { ...layout, ...updates, updatedAt: new Date().toISOString() }
          : layout
      );
      
      // Update localStorage
      localStorage.setItem('staticBuffetWorkspaceLayouts', JSON.stringify(updatedLayouts));
      
      return { savedWorkspaceLayouts: updatedLayouts };
    });
  },

  // Mario Mode implementation
  setMarioMode: (enabled) => set({ isMarioMode: enabled }),
  
  // Dakota Vanilla Mode implementation
  setDakotaVanillaMode: (enabled) => set({ isDakotaVanillaMode: enabled }),
  
  // Blondie Geometry Mode implementation
  setBlondieGeometryMode: (enabled) => set({ isBlondieGeometryMode: enabled }),

  // Floating panel actions
  setFloatingMode: (enabled) => set({ isFloatingMode: enabled }),
  
  updatePanelPosition: (panel, position) => set((state) => ({
    floatingPanelStates: {
      ...state.floatingPanelStates,
      [panel]: {
        ...state.floatingPanelStates[panel],
        ...position,
      },
    },
  })),
  
  togglePanelLock: (panel) => set((state) => ({
    floatingPanelStates: {
      ...state.floatingPanelStates,
      [panel]: {
        ...state.floatingPanelStates[panel],
        isLocked: !state.floatingPanelStates[panel].isLocked,
      },
    },
  })),
  
  bringPanelToFront: (panel) => set((state) => {
    const maxZ = Math.max(...Object.values(state.floatingPanelStates).map(p => p.zIndex));
    return {
      floatingPanelStates: {
        ...state.floatingPanelStates,
        [panel]: {
          ...state.floatingPanelStates[panel],
          zIndex: maxZ + 1,
        },
      },
    };
  }),
}));
