export type BrandSkin = 'ebn';

export interface SearchState {
  query: string;
  yearFrom: string;
  yearTo: string;
  duration: string;
  license: 'all' | 'publicdomain' | 'cc0' | 'ccby' | 'restricted';
  sort: 'downloads' | 'date' | 'relevance';
  page: number;
  sources: string[];
  allowRestrictedLicenses: boolean;
}

export interface SmartQuery {
  id: string;
  label: string;
  query: string;
  description: string;
}

export interface SearchSource {
  id: string;
  name: string;
  collection: string;
  enabled: boolean;
  description: string;
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
  gamma: number;
  exposure: number;
  temperature: number;
  tint: number;
  vignette: number;
  sharpen: number;
  noise: number;
  // Geometry effects
  skewX?: number;
  skewY?: number;
  translateX?: number;
  translateY?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
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


export interface PanelPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isLocked: boolean;
  isDocked: boolean;
  isMinimized?: boolean;
  visible?: boolean;
}

export interface FloatingPanelStates {
  search: PanelPosition;
  player: PanelPosition;
  queue: PanelPosition;
  effects: PanelPosition;
  liveVideo: PanelPosition;
  recordSet: PanelPosition;
  loopControls: PanelPosition;
  videoEffects: PanelPosition;
  audioEffects: PanelPosition;
  presetEffects: PanelPosition;
  resultsGrid: PanelPosition;
  mediaControls: PanelPosition;
  popOutPlayer: PanelPosition;
  emergencyMix: PanelPosition;
  luckyDip: PanelPosition;
  keyboardShortcuts: PanelPosition;
  preview: PanelPosition;
  geometry: PanelPosition;
}


export interface LiveStreamState {
  isActive: boolean;
  stream: MediaStream | null;
  selectedCameraId: string;
}

export interface AppState {
  brandSkin: BrandSkin;
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
  isResizableMode: boolean;
  panelSizes: number[];
  floatingPanelStates: FloatingPanelStates;
  isFloatingMode: boolean;
  // Text overlay state
  textOverlay: TextSettings | null;
  isTextOverlayVisible: boolean;
  // Live stream state
  liveStream: LiveStreamState;
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

// EDL (Edit Decision List) types for recording sets
export interface EDLEvent {
  id: string;
  sessionId: string;
  timestamp: string; // ISO timestamp when event occurred
  eventType: 'play' | 'pause' | 'cut' | 'seek' | 'crossfade' | 'effect_change' | 'loop_toggle' | 'volume_change';
  clipId: string; // Queue item identifier
  clipTitle: string;
  timecode: string; // Current playback time in video
  trimIn: string;
  trimOut: string;
  parameters?: Record<string, any>; // Effect values, volume levels, etc.
  notes?: string;
}

export interface EDLSession {
  id: string;
  name: string;
  startTime: string;
  endTime?: string;
  totalDuration?: string;
  venue?: string;
  description?: string;
  events: EDLEvent[];
  metadata?: {
    bpm?: number;
    theme?: string;
    audioReactive?: boolean;
    totalClips?: number;
    totalCuts?: number;
  };
}

export interface TextSettings {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  color: string;
  backgroundColor: string;
  textAlign: string;
  positionX: number;
  positionY: number;
  rotation: number;
  opacity: number;
  strokeWidth: number;
  strokeColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowColor: string;
  animation: string;
  animationDuration: number;
}
