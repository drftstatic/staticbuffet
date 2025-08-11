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

export type Video = z.infer<typeof videoSchema>;
export type SearchFilters = z.infer<typeof searchFiltersSchema>;
export type QueueItem = z.infer<typeof queueItemSchema>;
export type PlaylistExport = z.infer<typeof playlistExportSchema>;
