import { type QueueItem } from '@shared/schema';
import { type PlaylistExport } from '@shared/schema';

export function exportPlaylistAsJSON(queueItems: QueueItem[], name: string = 'Static Buffet Playlist'): void {
  const playlist: PlaylistExport = {
    name,
    items: queueItems.map(item => ({
      src: item.videoUrl,
      identifier: item.identifier,
      title: item.title,
      start: item.trimIn,
      end: item.trimOut,
      license: item.license || 'Unknown',
      attribution: item.attribution || item.creator || 'Unknown',
    })),
    totalDuration: calculateTotalDuration(queueItems),
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(playlist, null, 2)], { 
    type: 'application/json' 
  });
  
  downloadBlob(blob, `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`);
}

export function exportPlaylistAsM3U(queueItems: QueueItem[], name: string = 'Static Buffet Playlist'): void {
  let m3uContent = '#EXTM3U\n';
  m3uContent += `# ${name}\n`;
  m3uContent += `# Exported from Static Buffet - ${new Date().toLocaleString()}\n\n`;

  queueItems.forEach(item => {
    const durationSeconds = parseDurationToSeconds(item.duration);
    m3uContent += `#EXTINF:${durationSeconds},${item.title}${item.creator ? ' - ' + item.creator : ''}\n`;
    m3uContent += `# License: ${item.license || 'Unknown'}\n`;
    m3uContent += `# Attribution: ${item.attribution || item.creator || 'Unknown'}\n`;
    m3uContent += `# Trim: ${item.trimIn} - ${item.trimOut}\n`;
    m3uContent += `${item.videoUrl}\n\n`;
  });

  const blob = new Blob([m3uContent], { type: 'audio/x-mpegurl' });
  downloadBlob(blob, `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.m3u`);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function calculateTotalDuration(queueItems: QueueItem[]): string {
  let totalSeconds = 0;
  
  queueItems.forEach(item => {
    const startSeconds = parseTimeToSeconds(item.trimIn);
    const endSeconds = parseTimeToSeconds(item.trimOut);
    totalSeconds += Math.max(0, endSeconds - startSeconds);
  });

  return formatSecondsToTime(totalSeconds);
}

function parseTimeToSeconds(time: string): number {
  const parts = time.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]; // MM:SS
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
  }
  return 0;
}

function parseDurationToSeconds(duration: string): number {
  const parts = duration.split(':').map(Number);
  
  if (parts.length === 1) {
    return parts[0];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  
  return 0;
}

function formatSecondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
