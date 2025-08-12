import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Play, List, Zap, Tv, Archive } from 'lucide-react';
import { useStore } from '@/lib/store';

export function StreamlinedWelcome() {
  const [isOpen, setIsOpen] = useState(false);
  const { brandSkin } = useStore();

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
    { icon: Search, title: 'Search Archive.org', desc: 'Find public domain videos' },
    { icon: Play, title: 'Preview & Queue', desc: 'Test clips before adding to set' },
    { icon: List, title: 'Live Mixing', desc: 'Real-time video transitions' },
    { icon: Zap, title: 'Audio Reactive', desc: 'Sync to microphone input' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={`max-w-md ${
        brandSkin === 'testcard' ? 'bg-slate-900/95 border-blue-400/50 text-blue-100' :
        brandSkin === 'waffle' ? 'bg-yellow-50/95 border-amber-400/50 text-amber-900' :
        'bg-slate-900/95 border-blue-400/50 text-blue-100'
      }`}>
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
            Search, preview, and mix public domain video content from Archive.org for live performances.
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

          <div className="flex items-center justify-between pt-2">
            <Badge variant="outline" className="text-xs">
              <Archive size={12} className="mr-1" />
              Free Archive.org content
            </Badge>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClose}>
                Skip
              </Button>
              <Button size="sm" onClick={handleClose}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}