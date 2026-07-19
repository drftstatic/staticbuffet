import { useState, useEffect, useMemo } from 'react';
import { Search, Play, Plus, Settings, Zap, Download, Info, Palette, Video, Music, Grid, List } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { getVideoMetadata } from '@/lib/archive-api';
import { type BrandSkin } from '@/lib/types';

const BRAND_SKINS: BrandSkin[] = ['testcard', 'waffle', 'ebn', 'ozzy', 'hogan', 'dx', 'maxheadroom', 'mario', 'dakota', 'blondie', 'diner'];

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandAction {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  keywords: string[];
  action: () => void;
  group: string;
  shortcut?: string;
  badge?: string;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const {
    setSearchState,
    searchState,
    queueItems, 
    clearQueue, 
    setDetailDrawerOpen, 
    selectedVideo,
    addToQueue,
    searchResults,
    setBrandSkin,
    brandSkin
  } = useStore();
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState('');

  // Command actions
  const commands: CommandAction[] = useMemo(() => [
    // Search & Navigation
    {
      id: 'search-focus',
      title: 'Focus Search Bar',
      description: 'Jump to the main search input',
      icon: <Search className="w-4 h-4" />,
      keywords: ['search', 'find', 'query', 'focus', '/'],
      action: () => {
        onClose();
        setTimeout(() => {
          const searchInput = document.querySelector('[data-testid="input-search"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        }, 100);
      },
      group: 'Navigation',
      shortcut: '/',
    },
    {
      id: 'clear-search',
      title: 'Clear Search',
      description: 'Clear current search query',
      icon: <Search className="w-4 h-4" />,
      keywords: ['clear', 'reset', 'empty', 'search'],
      action: () => {
        setSearchState({ query: '', page: 1 });
        onClose();
        toast({ title: 'Search cleared' });
      },
      group: 'Search',
    },
    
    // Queue Management
    {
      id: 'clear-queue',
      title: 'Clear Queue',
      description: `Remove all ${queueItems.length} items from queue`,
      icon: <List className="w-4 h-4" />,
      keywords: ['clear', 'queue', 'remove', 'empty', 'delete'],
      action: () => {
        clearQueue();
        onClose();
        toast({ title: 'Queue cleared', description: 'All items removed from queue' });
      },
      group: 'Queue',
      badge: queueItems.length > 0 ? `${queueItems.length} items` : undefined,
    },
    {
      id: 'play-queue',
      title: 'Play Queue',
      description: 'Start playing the queue from the beginning',
      icon: <Play className="w-4 h-4" />,
      keywords: ['play', 'start', 'queue', 'begin'],
      action: () => {
        if (queueItems.length > 0) {
          // Trigger queue playback
          const firstItem = queueItems[0];
          if (firstItem) {
            // You could implement a play queue action here
            toast({ title: 'Playing queue', description: `Starting with "${firstItem.title}"` });
          }
        } else {
          toast({ title: 'Queue is empty', description: 'Add videos to queue first', variant: 'destructive' });
        }
        onClose();
      },
      group: 'Queue',
      badge: queueItems.length > 0 ? 'Ready' : 'Empty',
    },

    // Video Actions
    {
      id: 'add-current-video',
      title: 'Add Current Video to Queue',
      description: selectedVideo ? `Add "${selectedVideo.title}" to queue` : 'No video selected',
      icon: <Plus className="w-4 h-4" />,
      keywords: ['add', 'queue', 'current', 'video', 'plus'],
      action: async () => {
        if (selectedVideo) {
          try {
            const metadata = await getVideoMetadata(selectedVideo.identifier);
            if (!metadata.streamUrl) {
              throw new Error('No playable stream URL');
            }
            addToQueue(selectedVideo, metadata.streamUrl);
            toast({ title: 'Added to queue', description: selectedVideo.title });
          } catch {
            toast({ title: 'Could not add video', description: 'No playable stream found', variant: 'destructive' });
          }
        } else {
          toast({ title: 'No video selected', variant: 'destructive' });
        }
        onClose();
      },
      group: 'Video',
      badge: selectedVideo ? 'Available' : 'None selected',
    },
    {
      id: 'show-video-details',
      title: 'Show Video Details',
      description: selectedVideo ? `View details for "${selectedVideo.title}"` : 'No video selected',
      icon: <Info className="w-4 h-4" />,
      keywords: ['details', 'info', 'video', 'metadata', 'show'],
      action: () => {
        if (selectedVideo) {
          setDetailDrawerOpen(true);
        } else {
          toast({ title: 'No video selected', variant: 'destructive' });
        }
        onClose();
      },
      group: 'Video',
    },

    // Quick Searches
    {
      id: 'search-public-domain',
      title: 'Search Public Domain Videos',
      description: 'Find freely usable content',
      icon: <Video className="w-4 h-4" />,
      keywords: ['public', 'domain', 'free', 'creative', 'commons'],
      action: () => {
        setSearchState({ query: 'collection:(prelinger OR communitytexts OR opensource_movies)', page: 1 });
        onClose();
        toast({ title: 'Searching public domain videos' });
      },
      group: 'Quick Search',
    },
    {
      id: 'search-music',
      title: 'Search Audio/Music',
      description: 'Find audio content and music',
      icon: <Music className="w-4 h-4" />,
      keywords: ['music', 'audio', 'sound', 'songs'],
      action: () => {
        setSearchState({ query: 'mediatype:audio', page: 1 });
        onClose();
        toast({ title: 'Searching audio content' });
      },
      group: 'Quick Search',
    },

    // Theme & UI
    {
      id: 'toggle-theme',
      title: 'Cycle Brand Skin',
      description: 'Switch to the next theme',
      icon: <Palette className="w-4 h-4" />,
      keywords: ['theme', 'skin', 'brand', 'toggle', 'switch', 'cycle'],
      action: () => {
        const nextSkin = BRAND_SKINS[(BRAND_SKINS.indexOf(brandSkin) + 1) % BRAND_SKINS.length];
        setBrandSkin(nextSkin);
        onClose();
        toast({
          title: 'Theme changed',
          description: `Switched to ${nextSkin} theme`
        });
      },
      group: 'Appearance',
      badge: brandSkin,
    },

    // Export & Tools
    {
      id: 'export-queue',
      title: 'Export Queue as JSON',
      description: 'Download queue as JSON playlist',
      icon: <Download className="w-4 h-4" />,
      keywords: ['export', 'download', 'json', 'playlist', 'save'],
      action: () => {
        if (queueItems.length > 0) {
          // Trigger export functionality
          const playlist = {
            name: 'VJ Mix',
            items: queueItems,
            exportedAt: new Date().toISOString(),
            generatedBy: 'Static Buffet VJ Tool',
          };
          
          const blob = new Blob([JSON.stringify(playlist, null, 2)], {
            type: 'application/json'
          });
          
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'static_buffet_queue.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast({ title: 'Queue exported', description: 'Downloaded as JSON file' });
        } else {
          toast({ title: 'Queue is empty', description: 'Add videos to queue first', variant: 'destructive' });
        }
        onClose();
      },
      group: 'Export',
      badge: queueItems.length > 0 ? `${queueItems.length} items` : 'Empty',
    },
    {
      id: 'cache-stats',
      title: 'View Cache Statistics',
      description: 'Check performance and cache hit rates',
      icon: <Settings className="w-4 h-4" />,
      keywords: ['cache', 'stats', 'performance', 'monitor'],
      action: async () => {
        try {
          const response = await fetch('/api/cache-stats');
          const stats = await response.json();
          console.log('Cache Statistics:', stats);
          toast({ 
            title: 'Cache Statistics', 
            description: `Search: ${stats.searchCache?.memoryEntries || 0} in memory, Transcode: ${stats.transcode?.totalFiles || 0} files` 
          });
        } catch (error) {
          toast({ title: 'Failed to fetch cache stats', variant: 'destructive' });
        }
        onClose();
      },
      group: 'Tools',
    },
    {
      id: 'emergency-mix',
      title: 'Generate Emergency Mix',
      description: 'Auto-generate a quick mix from search results',
      icon: <Zap className="w-4 h-4" />,
      keywords: ['emergency', 'mix', 'auto', 'generate', 'quick'],
      action: () => {
        if (searchResults.length > 0) {
          // Trigger emergency mix generation
          toast({ title: 'Generating emergency mix...', description: 'This feature requires the EmergencyMix component' });
        } else {
          toast({ title: 'No search results', description: 'Search for videos first', variant: 'destructive' });
        }
        onClose();
      },
      group: 'Tools',
      badge: searchResults.length > 0 ? `${searchResults.length} results` : 'No results',
    },
  ], [queueItems, selectedVideo, searchResults, brandSkin, onClose, setSearchState, clearQueue, addToQueue, setDetailDrawerOpen, setBrandSkin, toast]);

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!searchValue.trim()) return commands;
    
    const query = searchValue.toLowerCase();
    return commands.filter(command => 
      command.title.toLowerCase().includes(query) ||
      command.description?.toLowerCase().includes(query) ||
      command.keywords.some(keyword => keyword.toLowerCase().includes(query))
    );
  }, [commands, searchValue]);

  // Group filtered commands
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandAction[]> = {};
    filteredCommands.forEach(command => {
      if (!groups[command.group]) {
        groups[command.group] = [];
      }
      groups[command.group].push(command);
    });
    return groups;
  }, [filteredCommands]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Type a command or search..." 
            value={searchValue}
            onValueChange={setSearchValue}
            className="border-0 shadow-none"
          />
          <CommandList className="max-h-96">
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <Search className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No commands found for "{searchValue}"
                </p>
              </div>
            </CommandEmpty>
            
            {Object.entries(groupedCommands).map(([group, commands]) => (
              <CommandGroup heading={group} key={group}>
                {commands.map((command) => (
                  <CommandItem
                    key={command.id}
                    onSelect={() => command.action()}
                    className="flex items-center gap-3 px-3 py-2"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {command.icon}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{command.title}</span>
                          {command.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {command.badge}
                            </Badge>
                          )}
                        </div>
                        {command.description && (
                          <p className="text-sm text-muted-foreground">
                            {command.description}
                          </p>
                        )}
                      </div>
                      {command.shortcut && (
                        <Badge variant="outline" className="text-xs font-mono">
                          {command.shortcut}
                        </Badge>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}