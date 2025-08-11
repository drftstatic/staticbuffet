export type BrandSkin = 'testcard' | 'waffle' | 'ebn' | 'ozzy' | 'hogan' | 'dx' | 'maxheadroom' | 'mario' | 'dakota' | 'blondie';

export interface SearchState {
  query: string;
  yearFrom: string;
  yearTo: string;
  duration: string;
  license: 'all' | 'publicdomain' | 'cc0' | 'ccby';
  sort: 'downloads' | 'date' | 'relevance';
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

export interface VideoEffects {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  opacity: number;
  grayscale: number;
  invert: number;
  sepia: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  glitchIntensity: number;
  chromaticAberration: number;
  scanlines: boolean;
  datamosh: boolean;
  pixelate: number;
  intensity: number;
  colorShift: number;
  kaleidoscope: boolean;
  plasma: boolean;
  strobe: boolean;
  chromatic: boolean;
}

export interface AudioEffects {
  gain: number;
  bass: number;
  mid: number;
  treble: number;
  distortion: number;
  reverb: number;
  delay: number;
  chorus: number;
  bitcrush: number;
  lowpass: number;
  highpass: number;
}

export interface PanelStates {
  searchCollapsed: boolean;
  playerCollapsed: boolean;
  queueCollapsed: boolean;
  effectsCollapsed: boolean;
}

export interface WorkspaceLayout {
  id: string;
  name: string;
  description?: string;
  panelStates: PanelStates;
  createdAt: string;
  updatedAt: string;
  layoutMode: 'panels' | 'grid';
  panelSizes?: number[]; // For resizable panels mode [leftWidth, centerWidth, rightWidth]
}

export interface AppState {
  brandSkin: BrandSkin;
  isHulksterMode: boolean;
  adaptiveColorsEnabled: boolean;
  adaptiveIntensity: number;
  currentVideoPalette: any | null;
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
  timelineLoop: boolean; // Loop entire timeline
  videoEffects: VideoEffects;
  audioEffects: AudioEffects;
  panelStates: PanelStates;
  savedWorkspaceLayouts: WorkspaceLayout[];
  isResizableMode: boolean;
  panelSizes: number[];
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
  loopCount?: number; // Number of times to loop (0 = infinite)
  crossfade: boolean;
  license?: string;
  attribution?: string;
}
