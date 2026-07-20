import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { Kbd } from '@/components/ui/kbd';
import { toast } from '@/hooks/use-toast';
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
            { keys: ['Esc'], description: 'Exit fullscreen' },
            { keys: ['←'], description: 'Skip back 10 seconds' },
            { keys: ['→'], description: 'Skip forward 10 seconds' },
            { keys: ['↑'], description: 'Increase volume' },
            { keys: ['↓'], description: 'Decrease volume' },
        ],
    },
    {
        title: 'Trim Controls',
        shortcuts: [
            { keys: ['Ctrl', 'T'], description: 'Toggle trim controls visibility (⌘+T on Mac)' },
            { keys: ['I'], description: 'Set trim in point' },
            { keys: ['O'], description: 'Set trim out point' },
            { keys: ['Ctrl', 'R'], description: 'Reset trim points' },
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
            { keys: ['/'], description: 'Focus search input' },
            { keys: ['Ctrl', 'K'], description: 'Open command palette' },
            { keys: ['Ctrl', 'P'], description: 'Pop-out player window' },
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
            if (event.target instanceof HTMLInputElement ||
                event.target instanceof HTMLTextAreaElement ||
                isOpen) {
                return;
            }
            // Command palette - handled by useCommandPalette hook in App component
            // No need to handle here as it's managed globally
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
        {
            return 'bg-gray-900/95 border-lime-500/50';
        }
    };
    return (<>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`max-w-3xl max-h-[85vh] overflow-y-auto ${getThemeClasses()}`}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <span>⌨️ Keyboard Shortcuts</span>
              <Kbd keys={['?']}/>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {shortcutGroups.map((group) => (<div key={group.title} className="space-y-3">
                <h3 className="font-semibold text-lg">{group.title}</h3>
                <div className="space-y-3">
                  {group.shortcuts.map((shortcut, index) => (<div key={index} className="flex items-center justify-between gap-4 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <span className="text-sm font-medium">{shortcut.description}</span>
                      <Kbd keys={shortcut.keys}/>
                    </div>))}
                </div>
              </div>))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Pro Tip:</strong> Effect presets (1-8) work globally and show confirmation toasts. 
              Video controls work when a video is loaded. Trim controls (Ctrl+T, I, O) help set precise in/out points. 
              Press <Kbd keys={['Esc']} className="inline-flex mx-1"/> to close dialogs. Shortcuts are disabled while typing in form inputs.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>);
}
// Make shortcuts available globally
window.showShortcuts = () => {
    const event = new KeyboardEvent('keydown', { key: '?' });
    window.dispatchEvent(event);
};
