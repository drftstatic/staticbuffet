import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Smartphone, Tablet, Monitor, Layout, Info, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useResponsiveLayout } from '@/hooks/use-responsive-layout';
import { useToast } from '@/hooks/use-toast';

export function LayoutControls() {
  const [showInfo, setShowInfo] = useState(false);
  const { currentLayout, setManualLayout } = useResponsiveLayout();
  const { toast } = useToast();

  const layouts = [
    { id: 'mobile', icon: Smartphone, label: 'Mobile', width: '< 768px' },
    { id: 'tablet', icon: Tablet, label: 'Tablet', width: '768-1024px' },
    { id: 'desktop', icon: Monitor, label: 'Desktop', width: '> 1024px' }
  ] as const;

  const switchLayout = (layoutId: typeof layouts[number]['id']) => {
    setManualLayout(layoutId);
    toast({
      title: `Switched to ${layoutId} layout`,
      description: `Interface adapted for ${layoutId} view`,
      duration: 2000,
    });
  };

  const resetToAuto = () => {
    const width = window.innerWidth;
    const autoLayout = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
    setManualLayout(autoLayout);
    
    toast({
      title: "Layout reset to automatic",
      description: "Now responding to actual screen size",
      duration: 2000,
    });
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <Card className="p-2 bg-black/80 backdrop-blur-sm border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Layout size={16} className="text-white/80" />
            <Badge variant="secondary" className="text-xs bg-white/20 text-white">
              {currentLayout}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInfo(true)}
              className="h-6 px-2 text-white/60 hover:text-white"
              data-testid="button-layout-info"
            >
              <Info size={12} />
            </Button>
          </div>
          
          <div className="flex gap-1">
            {layouts.map(({ id, icon: Icon }) => (
              <Button
                key={id}
                variant={currentLayout === id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => switchLayout(id)}
                className="h-7 px-2 text-white/80 hover:text-white hover:bg-white/20"
                data-testid={`button-layout-${id}`}
              >
                <Icon size={12} />
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToAuto}
              className="h-7 px-2 text-white/60 hover:text-white"
              data-testid="button-layout-auto"
            >
              <Settings size={12} />
            </Button>
          </div>
        </Card>
      </div>

      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="sm:max-w-md bg-black/90 border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Responsive Layout</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-white/80">
              The interface automatically adapts to your screen size. Use these controls to test different layouts.
            </p>
            
            <div className="space-y-2">
              {layouts.map(({ id, icon: Icon, label, width }) => (
                <div key={id} className="flex items-center gap-3 p-2 rounded bg-white/10">
                  <Icon size={16} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{label}</div>
                    <div className="text-xs text-white/60">{width}</div>
                  </div>
                  {currentLayout === id && (
                    <Badge variant="secondary" className="text-xs">Current</Badge>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-xs text-white/60 space-y-1">
              <div>• Layout changes auto-revert after 8 seconds</div>
              <div>• Use Settings button to return to auto-detection</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}