import { useState } from 'react';
import { Download, FileText, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store';
import { exportPlaylistAsJSON, exportPlaylistAsM3U } from '@/lib/export';
import { useToast } from '@/hooks/use-toast';

export function ExportMenu() {
  const { queueItems } = useStore();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState('Static Buffet Playlist');

  const handleExportJSON = () => {
    if (queueItems.length === 0) {
      toast({
        title: "No clips to export",
        description: "Add videos to the queue first",
        variant: "destructive",
      });
      return;
    }

    try {
      exportPlaylistAsJSON(queueItems, playlistName);
      toast({
        title: "JSON Export Complete",
        description: `Exported ${queueItems.length} clips as JSON playlist`,
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate JSON playlist",
        variant: "destructive",
      });
    }
  };

  const handleExportM3U = () => {
    if (queueItems.length === 0) {
      toast({
        title: "No clips to export",
        description: "Add videos to the queue first",
        variant: "destructive",
      });
      return;
    }

    try {
      exportPlaylistAsM3U(queueItems, playlistName);
      toast({
        title: "M3U Export Complete",
        description: `Exported ${queueItems.length} clips as M3U playlist`,
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate M3U playlist",
        variant: "destructive",
      });
    }
  };

  const handleQuickExportJSON = () => {
    exportPlaylistAsJSON(queueItems);
    toast({
      title: "JSON Export Complete",
      description: `Exported ${queueItems.length} clips`,
    });
  };

  const handleQuickExportM3U = () => {
    exportPlaylistAsM3U(queueItems);
    toast({
      title: "M3U Export Complete",
      description: `Exported ${queueItems.length} clips`,
    });
  };

  if (queueItems.length === 0) {
    return (
      <div className="mb-4 space-y-2 opacity-50">
        <Button
          disabled
          className="w-full px-3 py-2 rounded-lg text-sm font-medium"
          data-testid="button-export-json-disabled"
        >
          <FileText className="mr-2" size={16} />
          Export JSON Playlist
        </Button>
        <Button
          disabled
          className="w-full px-3 py-2 rounded-lg text-sm font-medium"
          data-testid="button-export-m3u-disabled"
        >
          <List className="mr-2" size={16} />
          Export M3U Playlist
        </Button>
      </div>
    );
  }

  return (
    <div className="mb-4 space-y-2">
      {/* Quick Export Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={handleQuickExportJSON}
          data-testid="button-quick-export-json"
          className="px-3 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-black transition-all duration-200"
        >
          <FileText className="mr-1" size={14} />
          JSON
        </Button>
        <Button
          onClick={handleQuickExportM3U}
          data-testid="button-quick-export-m3u"
          className="px-3 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-black transition-all duration-200"
        >
          <List className="mr-1" size={14} />
          M3U
        </Button>
      </div>

      {/* Advanced Export Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full text-sm"
            data-testid="button-export-options"
          >
            <Download className="mr-2" size={16} />
            Export Options
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="playlistName" className="text-sm font-medium">
                Playlist Name
              </Label>
              <Input
                id="playlistName"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="mt-1"
                placeholder="Enter playlist name..."
                data-testid="input-playlist-name"
              />
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Playlist Summary</h4>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Clips:</span>
                  <span>{queueItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Duration:</span>
                  <span>{calculateTotalDuration()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Includes Attribution:</span>
                  <span>Yes</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleExportJSON}
                data-testid="button-export-json"
                className="w-full bg-red-600 hover:bg-red-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-black"
              >
                <FileText className="mr-2" size={16} />
                Export as JSON
              </Button>
              <Button
                onClick={handleExportM3U}
                data-testid="button-export-m3u"
                className="w-full bg-red-600 hover:bg-red-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-black"
              >
                <List className="mr-2" size={16} />
                Export as M3U
              </Button>
            </div>

            <div className="pt-2">
              <p className="text-xs text-gray-500">
                JSON format includes detailed metadata and trim settings. 
                M3U format is compatible with most media players.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  function calculateTotalDuration(): string {
    let totalSeconds = 0;
    queueItems.forEach(item => {
      const startSeconds = parseTimeToSeconds(item.trimIn);
      const endSeconds = parseTimeToSeconds(item.trimOut);
      totalSeconds += Math.max(0, endSeconds - startSeconds);
    });
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  function parseTimeToSeconds(time: string): number {
    const parts = time.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  }
}
