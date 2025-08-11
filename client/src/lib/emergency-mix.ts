import { type VideoResult } from './types';
import { type QueueItem } from '@shared/schema';

export interface EmergencyMixOptions {
  duration: number; // Total mix duration in seconds (default: 150 = 2.5 minutes)
  segmentLength: [number, number]; // Min/max segment length in seconds [2, 5]
  crossfadeDuration: number; // Crossfade duration in seconds (default: 0.5)
  maxClips: number; // Maximum number of clips to use (default: 10)
}

const DEFAULT_OPTIONS: EmergencyMixOptions = {
  duration: 150, // 2.5 minutes
  segmentLength: [2, 5],
  crossfadeDuration: 0.5,
  maxClips: 10,
};

export function generateEmergencyMix(
  searchResults: VideoResult[], 
  options: Partial<EmergencyMixOptions> = {}
): QueueItem[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Filter results to prefer shorter videos (< 30-90 seconds ideally)
  const filteredResults = searchResults
    .filter(result => {
      if (!result.duration) return true;
      const durationSeconds = parseDurationToSeconds(result.duration);
      return durationSeconds <= 90; // Prefer videos under 90 seconds
    })
    .slice(0, opts.maxClips);

  if (filteredResults.length === 0) {
    throw new Error('No suitable videos found for emergency mix');
  }

  const queueItems: QueueItem[] = [];
  let totalDuration = 0;
  let clipIndex = 0;

  while (totalDuration < opts.duration && clipIndex < filteredResults.length) {
    const video = filteredResults[clipIndex % filteredResults.length];
    const videoDuration = parseDurationToSeconds(video.duration || '30');
    
    // Calculate random segment length within bounds
    const [minSeg, maxSeg] = opts.segmentLength;
    const segmentDuration = Math.min(
      videoDuration,
      Math.random() * (maxSeg - minSeg) + minSeg
    );
    
    // Random start time within the video
    const maxStartTime = Math.max(0, videoDuration - segmentDuration);
    const startTime = Math.random() * maxStartTime;
    const endTime = startTime + segmentDuration;
    
    const queueItem: QueueItem = {
      id: `emergency-${video.identifier}-${Date.now()}-${clipIndex}`,
      identifier: video.identifier,
      title: video.title,
      creator: video.creator,
      duration: video.duration || '0:00',
      videoUrl: `https://archive.org/download/${video.identifier}`, // Will be resolved later
      trimIn: formatSecondsToTime(startTime),
      trimOut: formatSecondsToTime(endTime),
      loop: false,
      crossfade: clipIndex > 0, // Crossfade all except first clip
      license: video.licenseurl,
      attribution: video.creator,
    };
    
    queueItems.push(queueItem);
    totalDuration += segmentDuration;
    clipIndex++;
  }

  return queueItems;
}

function parseDurationToSeconds(duration: string): number {
  // Parse formats like "12:34", "1:23:45", or just "123"
  const parts = duration.split(':').map(Number);
  
  if (parts.length === 1) {
    return parts[0]; // Assume seconds
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1]; // MM:SS
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
  }
  
  return 0;
}

function formatSecondsToTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
