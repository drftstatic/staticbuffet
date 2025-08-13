import { z } from "zod";

// Archive.org video metadata schema
export const videoSchema = z.object({
  identifier: z.string(),
  title: z.string(),
  creator: z.string().optional(),
  year: z.string().optional(),
  description: z.string().optional(),
  duration: z.string().optional(),
  licenseurl: z.string().optional(),
  downloads: z.number().optional(),
  date: z.string().optional(),
  mediatype: z.string(),
  collection: z.string().optional(),
  files: z.array(z.object({
    name: z.string(),
    format: z.string(),
    size: z.string().optional(),
    md5: z.string().optional(),
  })).optional(),
});

export const searchFiltersSchema = z.object({
  query: z.string(),
  yearFrom: z.string().optional(),
  yearTo: z.string().optional(),
  durationMin: z.number().optional(),
  durationMax: z.number().optional(),
  license: z.enum(['all', 'publicdomain', 'cc0', 'ccby', 'restricted']).default('all'),
  sort: z.enum(['downloads', 'date', 'relevance']).default('downloads'),
  page: z.number().default(1),
  rows: z.number().default(50),
  sources: z.array(z.string()).optional(),
  allowRestrictedLicenses: z.boolean().default(false),
});

export const queueItemSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  title: z.string(),
  creator: z.string().optional(),
  duration: z.string(),
  thumbnail: z.string().optional(),
  videoUrl: z.string(),
  trimIn: z.string().default('00:00'),
  trimOut: z.string(),
  loop: z.boolean().default(false),
  crossfade: z.boolean().default(false),
  license: z.string().optional(),
  attribution: z.string().optional(),
});

export const playlistExportSchema = z.object({
  name: z.string(),
  items: z.array(z.object({
    src: z.string(),
    identifier: z.string(),
    title: z.string(),
    start: z.string(),
    end: z.string(),
    license: z.string().optional(),
    attribution: z.string().optional(),
  })),
  totalDuration: z.string(),
  exportedAt: z.string(),
});

// EDL (Edit Decision List) schemas for recording sets
export const edlEventSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  timestamp: z.string(), // ISO timestamp when event occurred
  eventType: z.enum(['play', 'pause', 'cut', 'seek', 'crossfade', 'effect_change', 'loop_toggle', 'volume_change']),
  clipId: z.string(), // Queue item identifier
  clipTitle: z.string(),
  timecode: z.string(), // Current playback time in video
  trimIn: z.string(),
  trimOut: z.string(),
  parameters: z.record(z.any()).optional(), // Effect values, volume levels, etc.
  notes: z.string().optional(),
});

export const edlSessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  startTime: z.string(),
  endTime: z.string().optional(),
  totalDuration: z.string().optional(),
  venue: z.string().optional(),
  description: z.string().optional(),
  events: z.array(edlEventSchema),
  metadata: z.object({
    bpm: z.number().optional(),
    theme: z.string().optional(),
    audioReactive: z.boolean().default(false),
    totalClips: z.number().default(0),
    totalCuts: z.number().default(0),
  }).optional(),
});

export type Video = z.infer<typeof videoSchema>;
export type SearchFilters = z.infer<typeof searchFiltersSchema>;
export type QueueItem = z.infer<typeof queueItemSchema>;
export type PlaylistExport = z.infer<typeof playlistExportSchema>;
export type EDLEvent = z.infer<typeof edlEventSchema>;
export type EDLSession = z.infer<typeof edlSessionSchema>;

// Metadata cache schema for database storage
export const metadataCacheSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  metadata: z.record(z.any()),
  files: z.array(z.object({
    name: z.string(),
    format: z.string(),
    size: z.string().optional(),
    md5: z.string().optional(),
  })),
  selectedFile: z.object({
    name: z.string(),
    format: z.string(),
    size: z.string().optional(),
    md5: z.string().optional(),
    checksum: z.string().optional(),
  }),
  streamUrl: z.string(),
  cachedAt: z.string(),
  expiresAt: z.string(),
});

export type MetadataCache = z.infer<typeof metadataCacheSchema>;
