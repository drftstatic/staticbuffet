import { create } from 'zustand';
import { type BrandSkin, type AppState, type VideoResult, type QueueItem, type SearchState, type VideoEffects, type AudioEffects, type TextSettings } from './types';

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
  
  
  // Adaptive color actions
  setAdaptiveColorsEnabled: (enabled: boolean) => void;
  setAdaptiveIntensity: (intensity: number) => void;
  setCurrentVideoPalette: (palette: any) => void;

  
  
  // Easter Egg actions
  
  // Live stream actions
  setLiveStream: (stream: MediaStream | null, isActive: boolean, selectedCameraId?: string) => void;
  getLiveStream: () => MediaStream | null;
}

export const useStore = create<AppStore>((set, get) => ({
    // Initial state
    brandSkin: 'ebn',
    
  
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
    trails: 0,
    warp: 0,
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
  
  // Live stream state
  liveStream: {
    isActive: false,
    stream: null,
    selectedCameraId: '',
  },

  // Theme actions
  setBrandSkin: (skin) => set({ brandSkin: skin }),
  
  // Easter Egg actions

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
    console.log('🎵 Next track:', { from: state.currentQueueIndex, to: nextIndex, wasPlaying: state.isPlaying });
    return { 
      currentQueueIndex: nextIndex,
      // Preserve playing state when changing tracks
      isPlaying: state.isPlaying
    };
  }),
  
  previousTrack: () => set((state) => {
    const prevIndex = state.currentQueueIndex === 0 
      ? state.queueItems.length - 1 
      : state.currentQueueIndex - 1;
    console.log('🎵 Previous track:', { from: state.currentQueueIndex, to: prevIndex, wasPlaying: state.isPlaying });
    return { 
      currentQueueIndex: prevIndex,
      // Preserve playing state when changing tracks  
      isPlaying: state.isPlaying
    };
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
      trails: 0,
      warp: 0,
      skewX: 0,
      skewY: 0,
      translateX: 0,
      translateY: 0,
    }
  }),
  resetAudioEffects: () => set({
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
    }
  }),
  
  // Text overlay actions
  setTextOverlay: (settings) => set({ textOverlay: settings }),
  setTextOverlayVisible: (visible) => set({ isTextOverlayVisible: visible }),
  
  
  // Adaptive color actions
  setAdaptiveColorsEnabled: (enabled: boolean) => set({ adaptiveColorsEnabled: enabled }),
  setAdaptiveIntensity: (intensity: number) => set({ adaptiveIntensity: intensity }),
  setCurrentVideoPalette: (palette: any) => set({ currentVideoPalette: palette }),

  // Live stream actions
  setLiveStream: (stream, isActive, selectedCameraId = '') => set({
    liveStream: {
      stream,
      isActive,
      selectedCameraId,
    },
  }),
  
  getLiveStream: () => get().liveStream.stream,
}));
