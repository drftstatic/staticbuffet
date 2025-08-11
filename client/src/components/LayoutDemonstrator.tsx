import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Tablet, Monitor, Play, X, RotateCcw } from 'lucide-react';
import { useResponsiveLayout } from '@/hooks/use-responsive-layout';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

export function LayoutDemonstrator() {
  const [isOpen, setIsOpen] = useState(false);
  const [demoLayout, setDemoLayout] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isAnimating, setIsAnimating] = useState(false);
  const { setManualLayout, currentLayout } = useResponsiveLayout();
  const { brandSkin } = useStore();
  const { toast } = useToast();

  const layouts = {
    mobile: {
      icon: Smartphone,
      title: 'Mobile Layout',
      description: 'Single column, stacked interface',
      width: '375px',
      features: ['Touch optimized', 'Vertical stack', 'Full width panels'],
      demoClass: 'w-[300px] h-[500px] bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg p-4'
    },
    tablet: {
      icon: Tablet,
      title: 'Tablet Layout',
      description: 'Dual column adaptive interface',
      width: '768px',
      features: ['Side navigation', '2-column grid', 'Medium density'],
      demoClass: 'w-[400px] h-[300px] bg-gradient-to-b from-orange-100 to-orange-200 rounded-lg p-4'
    },
    desktop: {
      icon: Monitor,
      title: 'Desktop Layout',
      description: 'Full multi-panel workspace',
      width: '1024px+',
      features: ['Resizable panels', '3+ columns', 'High density'],
      demoClass: 'w-[500px] h-[350px] bg-gradient-to-b from-green-100 to-green-200 rounded-lg p-4'
    }
  };

  const runLayoutDemo = async () => {
    setIsAnimating(true);
    
    const sequence: ('mobile' | 'tablet' | 'desktop')[] = ['mobile', 'tablet', 'desktop'];
    
    for (const layout of sequence) {
      setDemoLayout(layout);
      setManualLayout(layout);
      
      toast({
        title: `Demonstrating ${layout} layout`,
        description: `Interface adapting to ${layout} breakpoint`,
        duration: 1500,
      });
      
      // Wait 2 seconds before next layout
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Reset to actual layout
    const actualWidth = window.innerWidth;
    const autoLayout = actualWidth < 768 ? 'mobile' : actualWidth < 1024 ? 'tablet' : 'desktop';
    setManualLayout(autoLayout);
    setDemoLayout(autoLayout);
    setIsAnimating(false);
    
    toast({
      title: "Layout demo complete",
      description: "Returned to automatic detection",
      duration: 2000,
    });
  };

  const resetDemo = () => {
    const actualWidth = window.innerWidth;
    const autoLayout = actualWidth < 768 ? 'mobile' : actualWidth < 1024 ? 'tablet' : 'desktop';
    setManualLayout(autoLayout);
    setDemoLayout(autoLayout);
    setIsAnimating(false);
  };

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'testcard':
        return 'bg-slate-900/95 border-blue-400/60 text-blue-100';
      case 'waffle':
        return 'bg-amber-50/95 border-amber-500/60 text-amber-900';
      case 'ebn':
        return 'bg-gray-900/95 border-lime-400/60 text-lime-100';
      case 'ozzy':
        return 'bg-red-950/95 border-red-400/60 text-red-100';
      case 'hogan':
        return 'bg-yellow-950/95 border-yellow-400/60 text-yellow-100';
      case 'dx':
        return 'bg-pink-950/95 border-pink-400/60 text-pink-100';
      case 'maxheadroom':
        return 'bg-green-950/95 border-green-400/60 text-green-100';
      case 'mario':
        return 'bg-red-950/95 border-yellow-400/60 text-yellow-100';
      case 'dakota':
        return 'bg-gray-900/95 border-gray-400/60 text-gray-100';
      case 'blondie':
        return 'bg-amber-950/95 border-amber-400/60 text-amber-100';
      default:
        return 'bg-slate-900/95 border-blue-400/60 text-blue-100';
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-16 left-4 z-40"
        data-testid="button-layout-demo"
      >
        <Play className="w-4 h-4 mr-2" />
        Layout Demo
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={`sm:max-w-4xl ${getThemeClasses()}`}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">Interactive Layout Demonstration</DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Demo Controls */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Layout Demo Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    onClick={runLayoutDemo}
                    disabled={isAnimating}
                    className="flex-1"
                    data-testid="button-run-layout-demo"
                  >
                    {isAnimating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Running Demo...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run Full Demo
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={resetDemo}
                    variant="outline"
                    disabled={isAnimating}
                    data-testid="button-reset-demo"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                <div className="text-sm text-opacity-70 mb-4">
                  Current Layout: <Badge variant="secondary">{demoLayout}</Badge>
                  {isAnimating && <span className="ml-2 text-blue-400">• Demo Running</span>}
                </div>

                {/* Individual Layout Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(layouts) as Array<keyof typeof layouts>).map((layout) => {
                    const config = layouts[layout];
                    const Icon = config.icon;
                    const isActive = demoLayout === layout;
                    
                    return (
                      <Button
                        key={layout}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setDemoLayout(layout);
                          setManualLayout(layout);
                        }}
                        disabled={isAnimating}
                        className="flex flex-col items-center p-3 h-auto"
                        data-testid={`button-demo-${layout}`}
                      >
                        <Icon size={20} className="mb-2" />
                        <div className="text-xs">
                          <div className="font-semibold capitalize">{layout}</div>
                          <div className="opacity-70">{config.width}</div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Current Layout Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Current Preview: {layouts[demoLayout].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Layout Mockup */}
                  <div className="flex-1 flex justify-center">
                    <div className={`${layouts[demoLayout].demoClass} border-2 border-dashed border-gray-400 transition-all duration-500 flex items-center justify-center`}>
                      <div className="text-center text-gray-600">
                        {(() => {
                          const IconComponent = layouts[demoLayout].icon;
                          return <IconComponent size={48} className="mx-auto mb-2" />;
                        })()}
                        <div className="font-semibold">{layouts[demoLayout].title}</div>
                        <div className="text-sm opacity-70">{layouts[demoLayout].width}</div>
                      </div>
                    </div>
                  </div>

                  {/* Layout Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm opacity-80">{layouts[demoLayout].description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Key Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {layouts[demoLayout].features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Breakpoint Range</h4>
                      <div className="text-sm font-mono bg-black/20 rounded px-2 py-1">
                        {demoLayout === 'mobile' && '< 768px'}
                        {demoLayout === 'tablet' && '768px - 1024px'}
                        {demoLayout === 'desktop' && '> 1024px'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">How to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>• <strong>Run Full Demo:</strong> Automatically cycles through all layouts</div>
                  <div>• <strong>Individual Buttons:</strong> Switch to specific layout immediately</div>
                  <div>• <strong>Reset:</strong> Return to automatic screen-size detection</div>
                  <div>• <strong>Live Preview:</strong> See how the interface adapts in real-time</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}