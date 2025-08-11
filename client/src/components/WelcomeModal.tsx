import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Volume2, Play, Search, Zap, Tv, MousePointer, Headphones, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { brandSkin } = useStore();

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem('staticBuffetWelcomeSeen');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('staticBuffetWelcomeSeen', 'true');
    setIsOpen(false);
  };

  const handleGetStarted = () => {
    localStorage.setItem('staticBuffetWelcomeSeen', 'true');
    setIsOpen(false);
    // Optionally trigger a demo search or feature tour
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${
        brandSkin === 'testcard' 
          ? 'bg-slate-900/95 border-blue-400/50 text-blue-100' 
          : brandSkin === 'waffle'
          ? 'bg-yellow-50/95 border-amber-400/50 text-amber-900'
          : brandSkin === 'ebn'
          ? 'bg-purple-950/95 border-lime-400/50 text-lime-100'
          : brandSkin === 'ozzy'
          ? 'bg-black/95 border-red-500/50 text-red-100'
          : brandSkin === 'mario'
          ? 'bg-red-900/95 border-yellow-400/50 text-yellow-100'
          : 'bg-purple-950/95 border-yellow-400/50 text-yellow-100'
      }`}>
        <DialogHeader>
          <DialogTitle className={`text-2xl font-bold text-center ${
            brandSkin === 'testcard' ? 'text-blue-300' :
            brandSkin === 'waffle' ? 'text-amber-800' :
            brandSkin === 'ebn' ? 'text-lime-300' :
            brandSkin === 'ozzy' ? 'text-red-300' :
            brandSkin === 'mario' ? 'text-yellow-300' :
            'text-yellow-300'
          }`}>
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Tv className="w-8 h-8" />
              <span>STATIC BUFFET</span>
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-sm font-mono opacity-80">
              Trash Team × Nulltone.TV
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Description */}
          <div className="text-center space-y-2">
            <h3 className={`text-xl font-bold ${
              brandSkin === 'waffle' ? 'text-amber-800' : 'text-yellow-300'
            }`}>
              All-You-Can-Eat Video Chaos
            </h3>
            <p className="text-base opacity-90">
              The ultimate VJ buffet for mixing free public domain and Creative Commons video content from Archive.org. 
              Turn discarded culture into something new with real-time audio-reactive mixing.
            </p>
          </div>

          {/* Volume Alert */}
          <div className={`p-4 rounded-lg border-2 ${
            brandSkin === 'testcard' 
              ? 'bg-blue-400/20 border-blue-400/50' 
              : brandSkin === 'waffle'
              ? 'bg-amber-200/50 border-amber-400/50'
              : brandSkin === 'ebn'
              ? 'bg-lime-400/20 border-lime-400/50'
              : brandSkin === 'ozzy'
              ? 'bg-red-400/20 border-red-400/50'
              : brandSkin === 'mario'
              ? 'bg-yellow-400/20 border-yellow-400/50'
              : 'bg-yellow-400/20 border-yellow-400/50'
          }`}>
            <div className="flex items-center justify-center space-x-3">
              <Volume2 className="w-6 h-6 animate-pulse" />
              <span className="text-lg font-bold">TURN UP THE VOLUME!</span>
              <Headphones className="w-6 h-6" />
            </div>
            <p className="text-center text-sm mt-2 opacity-90">
              Static Buffet includes audio-reactive features, soundboards, and live mixing capabilities.
            </p>
          </div>

          <Separator className="opacity-30" />

          {/* Quick Start Guide */}
          <div className="space-y-4">
            <h4 className={`text-lg font-bold text-center ${
              brandSkin === 'waffle' ? 'text-amber-800' : 'text-yellow-300'
            }`}>
              Quick Start Guide
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search & Queue */}
              <div className={`p-4 rounded border ${
                brandSkin === 'waffle' 
                  ? 'bg-amber-100/30 border-amber-400/30' 
                  : 'bg-purple-800/30 border-yellow-400/30'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Search className="w-5 h-5" />
                  <span className="font-bold">1. Search & Queue</span>
                </div>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• Search Archive.org for videos</li>
                  <li>• Filter by license (Public Domain, CC)</li>
                  <li>• Click videos to preview</li>
                  <li>• Add to timeline queue</li>
                </ul>
              </div>

              {/* Mix & Effects */}
              <div className={`p-4 rounded border ${
                brandSkin === 'waffle' 
                  ? 'bg-amber-100/30 border-amber-400/30' 
                  : 'bg-purple-800/30 border-yellow-400/30'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5" />
                  <span className="font-bold">2. Mix & Effects</span>
                </div>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• Apply video/audio effects</li>
                  <li>• Enable audio-reactive mode</li>
                  <li>• Use Emergency Mix generator</li>
                  <li>• Export playlists with licensing</li>
                </ul>
              </div>

              {/* Themes & Features */}
              <div className={`p-4 rounded border ${
                brandSkin === 'waffle' 
                  ? 'bg-amber-100/30 border-amber-400/30' 
                  : 'bg-purple-800/30 border-yellow-400/30'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <MousePointer className="w-5 h-5" />
                  <span className="font-bold">3. Special Features</span>
                </div>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• 8 visual themes with easter eggs</li>
                  <li>• Triple-click theme buttons for surprises</li>
                  <li>• Resizable panel workspace</li>
                  <li>• Save custom layouts</li>
                </ul>
              </div>

              {/* Pro Tips */}
              <div className={`p-4 rounded border ${
                brandSkin === 'waffle' 
                  ? 'bg-amber-100/30 border-amber-400/30' 
                  : 'bg-purple-800/30 border-yellow-400/30'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Play className="w-5 h-5" />
                  <span className="font-bold">4. Pro Tips</span>
                </div>
                <ul className="text-sm space-y-1 opacity-90">
                  <li>• Use keyboard shortcuts for live VJ</li>
                  <li>• Try "Waffle House" theme 🧇</li>
                  <li>• Enable webcam for live mixing</li>
                  <li>• Check out the long timeline!</li>
                </ul>
              </div>
            </div>
          </div>

          <Separator className="opacity-30" />

          {/* Themes Preview */}
          <div className="space-y-3">
            <h4 className={`text-lg font-bold text-center ${
              brandSkin === 'waffle' ? 'text-amber-800' : 'text-yellow-300'
            }`}>
              Choose Your Vibe
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="border-blue-400/50 text-blue-300">Test Card</Badge>
              <Badge variant="outline" className="border-amber-400/50 text-amber-600">Waffle House 🧇</Badge>
              <Badge variant="outline" className="border-lime-400/50 text-lime-300">EBN Hijack</Badge>
              <Badge variant="outline" className="border-red-400/50 text-red-300">Heavy Metal 🤘</Badge>
              <Badge variant="outline" className="border-yellow-400/50 text-yellow-300">NWO Hollywood</Badge>
              <Badge variant="outline" className="border-purple-400/50 text-purple-300">D-Generation X</Badge>
              <Badge variant="outline" className="border-cyan-400/50 text-cyan-300">Max Headroom</Badge>
              <Badge variant="outline" className="border-red-400/50 text-red-300">Sexy Mario 🍄</Badge>
            </div>
            <p className="text-center text-sm opacity-75">
              Each theme has unique easter eggs, soundboards, and visual effects!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleGetStarted}
              className={`flex-1 text-lg py-3 ${
                brandSkin === 'testcard' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : brandSkin === 'waffle'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : brandSkin === 'ebn'
                  ? 'bg-lime-600 hover:bg-lime-700 text-black'
                  : brandSkin === 'ozzy'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : brandSkin === 'mario'
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-black'
                  : 'bg-yellow-600 hover:bg-yellow-700 text-black'
              }`}
              data-testid="button-get-started"
            >
              <Play className="w-5 h-5 mr-2" />
              Let's Go! Start Mixing
            </Button>
            <Button 
              onClick={handleClose}
              variant="outline"
              className={`flex-1 ${
                brandSkin === 'waffle' 
                  ? 'border-amber-400/50 text-amber-800 hover:bg-amber-100/50' 
                  : 'border-yellow-400/50 text-yellow-300 hover:bg-yellow-400/10'
              }`}
              data-testid="button-skip-intro"
            >
              Skip Intro
            </Button>
          </div>

          {/* Footer Note */}
          <div className="text-center text-xs opacity-60 pt-2">
            <p>
              All content sourced from Archive.org • Respecting Creative Commons & Public Domain licensing
            </p>
            <p className="mt-1">
              Built for VJs, by VJs • Open source alternative programming
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}