import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';
import { Download, FileText, Music } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function ExportMenu() {
  const [playlistName, setPlaylistName] = useState('VJ Mix');
  const [isExporting, setIsExporting] = useState(false);
  const { queueItems } = useStore();

  const calculateTotalDuration = () => {
    return queueItems.reduce((total, item) => {
      // Simple duration calculation - in real app would parse duration properly
      const duration = item.duration || '0:00';
      const [minutes, seconds] = duration.split(':').map(Number);
      return total + (minutes * 60) + (seconds || 0);
    }, 0);
  };

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const exportAsJSON = async () => {
    setIsExporting(true);
    
    const playlist = {
      name: playlistName,
      items: queueItems.map(item => ({
        src: item.videoUrl,
        identifier: item.identifier,
        title: item.title,
        creator: item.creator,
        start: item.trimIn,
        end: item.trimOut,
        license: item.license,
        attribution: item.attribution,
        loop: item.loop,
        crossfade: item.crossfade,
        archiveUrl: `https://archive.org/details/${item.identifier}`,
      })),
      totalDuration: formatDuration(calculateTotalDuration()),
      exportedAt: new Date().toISOString(),
      generatedBy: 'Static Buffet VJ Tool',
    };

    const blob = new Blob([JSON.stringify(playlist, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playlistName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  const exportAsM3U = async () => {
    setIsExporting(true);
    
    let m3uContent = '#EXTM3U\n';
    m3uContent += `#PLAYLIST:${playlistName}\n\n`;
    
    queueItems.forEach(item => {
      // Estimate duration in seconds for M3U format
      const duration = item.duration || '0:00';
      const [minutes, seconds] = duration.split(':').map(Number);
      const totalSeconds = (minutes * 60) + (seconds || 0);
      
      m3uContent += `#EXTINF:${totalSeconds},${item.creator} - ${item.title}\n`;
      m3uContent += `${item.videoUrl}\n\n`;
    });

    const blob = new Blob([m3uContent], { type: 'audio/x-mpegurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${playlistName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.m3u`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsExporting(false);
  };

  const copyPlaylistInfo = () => {
    const info = queueItems.map(item => 
      `${item.title} by ${item.creator} - https://archive.org/details/${item.identifier}`
    ).join('\n');
    
    navigator.clipboard.writeText(info);
  };

  if (queueItems.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        <p>No videos in queue to export</p>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Export Playlist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Playlist</DialogTitle>
          <DialogDescription>
            Export your VJ queue as a playlist file with full attribution data
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="playlist-name">Playlist Name</Label>
            <Input
              id="playlist-name"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
            />
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>{queueItems.length}</strong> videos</p>
            <p><strong>{formatDuration(calculateTotalDuration())}</strong> total duration</p>
          </div>

          <Separator />

          <div className="space-y-2">
            <Button 
              onClick={exportAsJSON} 
              disabled={isExporting}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export as JSON
            </Button>
            
            <Button 
              onClick={exportAsM3U} 
              disabled={isExporting}
              variant="outline"
              className="w-full"
            >
              <Music className="h-4 w-4 mr-2" />
              Export as M3U Playlist
            </Button>
            
            <Button 
              onClick={copyPlaylistInfo} 
              variant="outline"
              className="w-full"
            >
              Copy Attribution Info
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            <p>Exported playlists include full licensing and attribution information for all public domain content.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}