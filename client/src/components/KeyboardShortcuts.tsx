import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { Kbd } from '@/components/ui/kbd';

declare global {
  interface Window {
    showShortcuts: () => void;
  }
}

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Video Playback',
    shortcuts: [
      { keys: ['Space'], description: 'Play/Pause current video' },
      { keys: ['F'], description: 'Toggle fullscreen' },
      { keys: ['T'], description: 'Toggle text overlay' },
      { keys: ['Esc'], description: 'Exit fullscreen' },
    ],
  },
  {
    title: 'Quick Effect Presets',
    shortcuts: [
      { keys: ['1'], description: 'Apply Cyberpunk preset' },
      { keys: ['2'], description: 'Apply Vintage preset' },
      { keys: ['3'], description: 'Apply Glitch preset' },
      { keys: ['4'], description: 'Apply Film Noir preset' },
      { keys: ['5'], description: 'Apply Video Vortex preset' },
      { keys: ['6'], description: 'Apply Demonic Portal preset' },
      { keys: ['7'], description: 'Apply Fractal Storm preset' },
      { keys: ['8'], description: 'Apply Time Warp preset' },
    ],
  },
  {
    title: 'Navigation & Help',
    shortcuts: [
      { keys: ['?'], description: 'Show this keyboard shortcuts panel' },
      { keys: ['Esc'], description: 'Close dialogs and panels' },
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
        <DialogContent className={`max-w-3xl max-h-[85vh] overflow-y-auto ${getThemeClasses()}`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <span>⌨️ Keyboard Shortcuts</span>
              <Kbd keys={['?']} />
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {shortcutGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <h3 className="font-semibold text-lg">{group.title}</h3>
                <div className="space-y-3">
                  {group.shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between gap-4 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <span className="text-sm font-medium">{shortcut.description}</span>
                      <Kbd keys={shortcut.keys} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Pro Tip:</strong> Effect presets (1-8) work globally and show confirmation toasts. 
              Video controls (Space, F) work when a video is loaded. Press <Kbd keys={['Esc']} className="inline-flex mx-1" /> to close dialogs.
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