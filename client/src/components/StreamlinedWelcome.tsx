import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, Play, List, Zap, Tv } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getThemeClasses } from '@/lib/theme-utils';

export function StreamlinedWelcome() {
  const [isOpen, setIsOpen] = useState(false);
  const { brandSkin } = useStore();
  const themeClasses = getThemeClasses(brandSkin);

  // Public method to show welcome (can be called from other components)
  const showWelcome = () => setIsOpen(true);

  // Attach function to window for external access
  useEffect(() => {
    (window as any).showStaticBuffetWelcome = showWelcome;
    return () => {
      delete (window as any).showStaticBuffetWelcome;
    };
  }, []);

  // Auto-start welcome disabled - now only accessible through menu
  // useEffect(() => {
  //   const hasSeenWelcome = localStorage.getItem('staticBuffetWelcomeSeen');
  //   if (!hasSeenWelcome) {
  //     setIsOpen(true);
  //   }
  // }, []);

  const handleClose = () => {
    localStorage.setItem('staticBuffetWelcomeSeen', 'true');
    setIsOpen(false);
  };

  const features = [
    { icon: Search, title: 'Content Discovery', desc: 'Search thousands of public domain videos' },
    { icon: Play, title: 'Preview & Queue', desc: 'Test and trim clips before performance' },
    { icon: List, title: 'Live Mixing', desc: 'Real-time video playback and transitions' },
    { icon: Zap, title: 'Professional Effects', desc: 'Video and audio processing pipeline' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={`max-w-md ${themeClasses.bg} ${themeClasses.border} ${themeClasses.text}`}>
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Tv className="w-6 h-6" />
              <span className="text-lg font-bold">STATIC BUFFET</span>
            </div>
            <div className="text-xs font-mono opacity-60">
              Professional VJ Tool
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-center opacity-80">
            Professional VJ tool for discovering, previewing, and mixing public domain video content for live performances.
          </p>

          <div className="grid gap-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 p-2 rounded bg-white/10">
                <Icon size={16} className="flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">{title}</div>
                  <div className="text-xs opacity-70">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <Button variant="outline" size="sm" onClick={handleClose}>
              Close
            </Button>
            <Button 
              size="sm" 
              onClick={() => {
                handleClose();
                // Start the tour
                setTimeout(() => {
                  (window as any).startStaticBuffetTour?.();
                }, 300);
              }}
              className={`${themeClasses.accentBg} text-white hover:opacity-90`}
            >
              Take Interactive Tour
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}