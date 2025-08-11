import { create } from 'zustand';
import { type BrandSkin, type AppState, type VideoResult, type QueueItem, type SearchState, type VideoEffects, type AudioEffects } from './types';

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
  addToQueue: (video: VideoResult, videoUrl: string) => void;
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
  
  // Effects
  setVideoEffects: (effects: VideoEffects) => void;
  setAudioEffects: (effects: AudioEffects) => void;
}

export const useStore = create<AppStore>((set, get) => ({
  // Initial state
  brandSkin: 'waffle',
  searchState: {
    query: '',
    yearFrom: '1950',
    yearTo: '2020',
    duration: 'any',
    license: 'publicdomain',
    sort: 'downloads',
    page: 1,
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
  addToQueue: (video, videoUrl) => {
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
      crossfade: false,
      license: video.licenseurl,
      attribution: video.creator,
    };
    
    set((state) => ({
      queueItems: [...state.queueItems, newItem]
    }));
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
  
  // Effects actions
  setVideoEffects: (effects) => set({ videoEffects: effects }),
  setAudioEffects: (effects) => set({ audioEffects: effects }),
}));
