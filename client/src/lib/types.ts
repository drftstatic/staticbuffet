export type BrandSkin = 'diner' | 'ebn';

export interface SearchState {
  query: string;
  yearFrom: string;
  yearTo: string;
  duration: string;
  license: string;
  sort: string;
  page: number;
}

export interface VideoResult {
  identifier: string;
  title: string;
  creator?: string;
  year?: string;
  description?: string;
  duration?: string;
  licenseurl?: string;
  downloads?: number;
  date?: string;
  thumbnail?: string;
}

export interface AppState {
  brandSkin: BrandSkin;
  searchState: SearchState;
  searchResults: VideoResult[];
  selectedVideo: VideoResult | null;
  isDetailDrawerOpen: boolean;
  queueItems: QueueItem[];
  isPlaying: boolean;
  currentQueueIndex: number;
  isAudioReactive: boolean;
  isLoading: boolean;
  totalResults: number;
}

export interface QueueItem {
  id: string;
  identifier: string;
  title: string;
  creator?: string;
  duration: string;
  thumbnail?: string;
  videoUrl: string;
  trimIn: string;
  trimOut: string;
  loop: boolean;
  crossfade: boolean;
  license?: string;
  attribution?: string;
}
