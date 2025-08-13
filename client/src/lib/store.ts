import { create } from 'zustand';
import { type BrandSkin, type AppState, type VideoResult, type QueueItem, type SearchState, type VideoEffects, type AudioEffects, type FloatingPanelStates, type PanelPosition, type TextSettings } from './types';

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
  resetVideoEffects: () => void;
  resetAudioEffects: () => void;
  
  // Text overlay actions
  setTextOverlay: (settings: TextSettings | null) => void;
  setTextOverlayVisible: (visible: boolean) => void;
  
  
  // Floating panels
  floatingPanelStates: FloatingPanelStates;
  defaultFloatingPanelStates: FloatingPanelStates;
  isFloatingMode: boolean;
  setFloatingMode: (enabled: boolean) => void;
  updatePanelPosition: (panel: keyof FloatingPanelStates, position: Partial<PanelPosition>) => void;
  togglePanelLock: (panel: keyof FloatingPanelStates) => void;
  togglePanelMinimize: (panel: keyof FloatingPanelStates) => void;
  bringPanelToFront: (panel: keyof FloatingPanelStates) => void;
  setFloatingPanelVisible: (panel: keyof FloatingPanelStates, visible: boolean) => void;
  setFloatingPanelMinimized: (panel: keyof FloatingPanelStates, minimized: boolean) => void;
  resetToDefaultLayout: () => void;
  
  // Adaptive color actions
  setAdaptiveColorsEnabled: (enabled: boolean) => void;
  setAdaptiveIntensity: (intensity: number) => void;
  setCurrentVideoPalette: (palette: any) => void;

  
  // Layout mode state
  setResizableMode: (mode: boolean) => void;
  setPanelSizes: (sizes: number[]) => void;
  
  // Easter Egg actions
  isAsciiMode: boolean;
  setAsciiMode: (enabled: boolean) => void;
  isBlondieGeometryMode: boolean;
  setBlondieGeometryMode: (enabled: boolean) => void;
}

export const useStore = create<AppStore>((set, get) => ({
  // Initial state
  brandSkin: 'testcard',
  isAsciiMode: false,
  isBlondieGeometryMode: false,
  isResizableMode: true,
  panelSizes: [30, 40, 30],
  
  // Floating panel states
  isFloatingMode: true,
  
  // Define default layout for reset functionality
  defaultFloatingPanelStates: {
    // === VISIBLE BY DEFAULT PANELS ===
    
    // Core Search & Browse
    search: {
      x: 165,
      y: 120,
      width: 380,
      height: 480,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
      visible: true,
    },
    
    // Main Player & Timeline
    player: {
      x: 580,
      y: 120,
      width: 500,
      height: 350,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
      visible: true,
    },
    queue: {
      x: 165,
      y: 620,
      width: 900,
      height: 160,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
      visible: true,
    },
    
    // Preview & Monitoring
    preview: {
      x: 1120,
      y: 120,
      width: 320,
      height: 240,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: true,
    },

    // === HIDDEN PANELS ===
    
    // Video Input & Recording
    liveVideo: {
      x: 1120,
      y: 380,
      width: 300,
      height: 270,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
      visible: false,
    },
    recordSet: {
      x: 50,
      y: 400,
      width: 240,
      height: 140,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
      isMinimized: true,
      visible: false,
    },
    
    // Playback Controls
    loopControls: {
      x: 310,
      y: 400,
      width: 200,
      height: 120,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
      isMinimized: true,
      visible: false,
    },
    mediaControls: {
      x: 580,
      y: 500,
      width: 280,
      height: 180,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    popOutPlayer: {
      x: 300,
      y: 150,
      width: 400,
      height: 300,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    
    // Effects & Processing
    presetEffects: {
      x: 50,
      y: 120,
      width: 320,
      height: 260,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    videoEffects: {
      x: 1460,
      y: 120,
      width: 380,
      height: 450,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    audioEffects: {
      x: 1460,
      y: 590,
      width: 360,
      height: 400,
      zIndex: 5,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    geometry: {
      x: 800,
      y: 200,
      width: 320,
      height: 480,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    
    // Browse & Search Tools
    resultsGrid: {
      x: 400,
      y: 200,
      width: 600,
      height: 500,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    
    // Creative Tools
    emergencyMix: {
      x: 50,
      y: 560,
      width: 320,
      height: 220,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    luckyDip: {
      x: 890,
      y: 500,
      width: 280,
      height: 160,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    
    // Help & Settings
    keyboardShortcuts: {
      x: 1200,
      y: 400,
      width: 380,
      height: 320,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
  },
  
  floatingPanelStates: {
    // === VISIBLE BY DEFAULT PANELS ===
    
    // Core Search & Browse
    search: {
      x: 165,
      y: 120,
      width: 380,
      height: 480,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
      visible: true,
    },
    
    // Main Player & Timeline
    player: {
      x: 580,
      y: 120,
      width: 500,
      height: 350,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
      visible: true,
    },
    queue: {
      x: 165,
      y: 620,
      width: 900,
      height: 160,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
      visible: true,
    },
    
    // Preview & Monitoring
    preview: {
      x: 1120,
      y: 120,
      width: 320,
      height: 240,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: true,
    },

    // === HIDDEN PANELS ===
    
    // Video Input & Recording
    liveVideo: {
      x: 1120,
      y: 380,
      width: 300,
      height: 270,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
      visible: false,
    },
    recordSet: {
      x: 50,
      y: 400,
      width: 240,
      height: 140,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
      isMinimized: true,
      visible: false,
    },
    
    // Playback Controls
    loopControls: {
      x: 310,
      y: 400,
      width: 200,
      height: 120,
      zIndex: 1,
      isLocked: false,
      isDocked: true,
      isMinimized: true,
      visible: false,
    },
    mediaControls: {
      x: 580,
      y: 500,
      width: 280,
      height: 180,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    popOutPlayer: {
      x: 300,
      y: 150,
      width: 400,
      height: 300,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    
    // Effects & Processing
    presetEffects: {
      x: 50,
      y: 120,
      width: 320,
      height: 260,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    videoEffects: {
      x: 1460,
      y: 120,
      width: 380,
      height: 450,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    audioEffects: {
      x: 1460,
      y: 590,
      width: 360,
      height: 400,
      zIndex: 5,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    geometry: {
      x: 800,
      y: 200,
      width: 320,
      height: 480,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    
    // Browse & Search Tools
    resultsGrid: {
      x: 400,
      y: 200,
      width: 600,
      height: 500,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    
    // Creative Tools
    emergencyMix: {
      x: 50,
      y: 560,
      width: 320,
      height: 220,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    luckyDip: {
      x: 890,
      y: 500,
      width: 280,
      height: 160,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
    },
    
    // Help & Settings
    keyboardShortcuts: {
      x: 1200,
      y: 400,
      width: 380,
      height: 320,
      zIndex: 1,
      isLocked: false,
      isDocked: false,
      visible: false,
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
    sources: ['prelinger', 'fedflix', 'nasa', 'loc', 'wikimedia'],
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
    intensity: 0,
    gamma: 100,
    exposure: 0,
    temperature: 0,
    tint: 0,
    vignette: 0,
    sharpen: 0,
    noise: 0,
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
  
  // Text overlay state
  textOverlay: null,
  isTextOverlayVisible: false,

  // Theme actions
  setBrandSkin: (skin) => set({ brandSkin: skin }),
  
  // Easter Egg actions
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
  resetVideoEffects: () => set({ 
    videoEffects: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      blur: 0,
      sharpness: 0,
      opacity: 100,
      invert: false,
      grayscale: 0,
      sepia: 0,
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
      flipH: false,
      flipV: false,
      pixelate: 0,
      edgeDetection: false,
      emboss: false,
      glitchIntensity: 0,
      chromaticAberration: 0,
      filmGrain: 0,
      vignette: 0,
      motionBlur: 0,
      zoom: 1,
      kaleidoscope: 0,
      mirror: false,
      thermal: false,
      night: false,
      xray: false
    }
  }),
  resetAudioEffects: () => set({
    audioEffects: {
      volume: 100,
      bass: 0,
      mid: 0,
      treble: 0,
      reverb: 0,
      delay: 0,
      distortion: 0,
      compressor: false,
      limiter: false,
      normalize: false,
      pitch: 0,
      speed: 1,
      echo: 0,
      chorus: 0,
      flanger: 0,
      phaser: 0,
      bitcrush: 0,
      filter: 0,
      stereoWidth: 100
    }
  }),
  
  // Text overlay actions
  setTextOverlay: (settings) => set({ textOverlay: settings }),
  setTextOverlayVisible: (visible) => set({ isTextOverlayVisible: visible }),
  
  
  // Adaptive color actions
  setAdaptiveColorsEnabled: (enabled: boolean) => set({ adaptiveColorsEnabled: enabled }),
  setAdaptiveIntensity: (intensity: number) => set({ adaptiveIntensity: intensity }),
  setCurrentVideoPalette: (palette: any) => set({ currentVideoPalette: palette }),

  // Layout mode actions
  setResizableMode: (mode: boolean) => set({ isResizableMode: mode }),
  setPanelSizes: (sizes: number[]) => set({ panelSizes: sizes }),
  
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

  togglePanelMinimize: (panel) => set((state) => ({
    floatingPanelStates: {
      ...state.floatingPanelStates,
      [panel]: {
        ...state.floatingPanelStates[panel],
        isMinimized: !state.floatingPanelStates[panel].isMinimized,
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

  setFloatingPanelVisible: (panel, visible) => set((state) => ({
    floatingPanelStates: {
      ...state.floatingPanelStates,
      [panel]: {
        ...state.floatingPanelStates[panel],
        visible,
      },
    },
  })),

  setFloatingPanelMinimized: (panel, minimized) => set((state) => ({
    floatingPanelStates: {
      ...state.floatingPanelStates,
      [panel]: {
        ...state.floatingPanelStates[panel],
        isMinimized: minimized,
      },
    },
  })),

  resetToDefaultLayout: () => set((state) => ({
    floatingPanelStates: JSON.parse(JSON.stringify(state.defaultFloatingPanelStates)),
  })),
}));
