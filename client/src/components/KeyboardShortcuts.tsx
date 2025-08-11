import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { Kbd } from '@/components/ui/kbd';

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Playback',
    shortcuts: [
      { keys: ['Space'], description: 'Play/Pause current video' },
      { keys: ['→'], description: 'Next video in queue' },
      { keys: ['←'], description: 'Previous video in queue' },
      { keys: ['↑'], description: 'Volume up' },
      { keys: ['↓'], description: 'Volume down' },
      { keys: ['M'], description: 'Toggle mute' },
      { keys: ['F'], description: 'Toggle fullscreen' },
    ],
  },
  {
    title: 'Search & Navigation',
    shortcuts: [
      { keys: ['/', 'Cmd', 'K'], description: 'Focus search bar' },
      { keys: ['?'], description: 'Show keyboard shortcuts' },
      { keys: ['L'], description: 'Lucky Dip search' },
      { keys: ['E'], description: 'Generate Emergency Mix' },
      { keys: ['Esc'], description: 'Close dialogs/clear focus' },
    ],
  },
  {
    title: 'Queue Management',
    shortcuts: [
      { keys: ['A'], description: 'Add selected video to queue' },
      { keys: ['Delete'], description: 'Remove selected queue item' },
      { keys: ['C'], description: 'Clear entire queue' },
      { keys: ['S'], description: 'Save current queue' },
      { keys: ['R'], description: 'Start/stop EDL recording' },
    ],
  },
  {
    title: 'Interface',
    shortcuts: [
      { keys: ['1'], description: 'Toggle search panel' },
      { keys: ['2'], description: 'Toggle player panel' },
      { keys: ['3'], description: 'Toggle effects panel' },
      { keys: ['4'], description: 'Toggle queue panel' },
      { keys: ['T'], description: 'Cycle themes' },
    ],
  },
];

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);
  const { brandSkin } = useStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (event.key === '?' && !event.shiftKey) {
        event.preventDefault();
        setIsOpen(true);
      }

      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global keyboard shortcut handler
  useEffect(() => {
    const handleGlobalShortcuts = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs or when dialog is open
      if (
        event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement ||
        isOpen
      ) {
        return;
      }

      // Command palette
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        // TODO: Open command palette
        console.log('Command palette triggered');
      }

      // Search focus
      if (event.key === '/') {
        event.preventDefault();
        const searchInput = document.querySelector('[data-testid="input-search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [isOpen]);

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'waffle':
        return 'bg-yellow-50/95 border-yellow-400/50';
      case 'ebn':
        return 'bg-gray-900/95 border-lime-500/50';
      case 'ozzy':
        return 'bg-red-950/95 border-red-500/50';
      default:
        return 'bg-white/95 dark:bg-gray-900/95 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`max-w-4xl max-h-[80vh] overflow-y-auto ${getThemeClasses()}`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Keyboard Shortcuts</span>
              <Kbd keys={['?']} />
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {shortcutGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <h3 className="font-semibold text-lg">{group.title}</h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between gap-4">
                      <span className="text-sm">{shortcut.description}</span>
                      <Kbd keys={shortcut.keys} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Pro Tip:</strong> Most shortcuts work globally except when typing in search fields. 
              Press <Kbd keys={['Esc']} className="inline-flex mx-1" /> to clear focus and enable shortcuts.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Make shortcuts available globally
window.showShortcuts = () => {
  const event = new KeyboardEvent('keydown', { key: '?' });
  window.dispatchEvent(event);
};