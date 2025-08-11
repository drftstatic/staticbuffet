import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  Play, 
  Scissors, 
  Plus, 
  Zap, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  X,
  Target,
  Timer,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

interface TourStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  target: string;
  action?: string;
  tip?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: "Search for Content",
    description: "Start by searching for public domain video footage. Try searching for 'vintage cartoon' or click a Smart Query chip.",
    icon: <Search className="w-6 h-6" />,
    target: "search-section",
    action: "search",
    tip: "Use Smart Query chips for instant content discovery!"
  },
  {
    id: 2,
    title: "Preview & Trim",
    description: "Click any video to preview it. Use the trim controls to set your in/out points for the perfect clip length.",
    icon: <Scissors className="w-6 h-6" />,
    target: "player-section",
    action: "preview",
    tip: "Double-click the player to go fullscreen for better preview."
  },
  {
    id: 3,
    title: "Add to Queue",
    description: "Found the perfect clip? Click 'Add to Queue' to build your video timeline for mixing and playback.",
    icon: <Plus className="w-6 h-6" />,
    target: "queue-section",
    action: "queue",
    tip: "Drag clips in the queue to reorder them for your set."
  },
  {
    id: 4,
    title: "Emergency Mix",
    description: "Need content fast? Hit Emergency Mix to instantly fill your queue with diverse, legally-safe clips ready for live mixing.",
    icon: <Zap className="w-6 h-6" />,
    target: "emergency-mix",
    action: "emergency",
    tip: "Perfect for when you need backup content during live sets!"
  }
];

interface FirstRunTourProps {}

export function FirstRunTour({}: FirstRunTourProps) {
  const { brandSkin } = useStore();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [hasShownTour, setHasShownTour] = useState(false);

  // Check if this is the user's first visit
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('staticBuffetHasSeenTour');
    if (!hasSeenTour && !hasShownTour) {
      // Small delay to let the interface load
      setTimeout(() => {
        setIsOpen(true);
        setHasShownTour(true);
      }, 1500);
    }
  }, [hasShownTour]);

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'testcard':
        return {
          accent: 'text-blue-400 border-blue-400 bg-blue-50',
          button: 'bg-blue-600 hover:bg-blue-700',
          progress: 'bg-blue-600'
        };
      case 'waffle':
        return {
          accent: 'text-amber-800 border-amber-600 bg-yellow-50',
          button: 'bg-amber-600 hover:bg-amber-700',
          progress: 'bg-amber-600'
        };
      case 'ebn':
        return {
          accent: 'text-lime-400 border-lime-400 bg-lime-50',
          button: 'bg-lime-600 hover:bg-lime-700',
          progress: 'bg-lime-600'
        };
      case 'ozzy':
        return {
          accent: 'text-red-300 border-red-400 bg-red-50',
          button: 'bg-red-600 hover:bg-red-700',
          progress: 'bg-red-600'
        };
      case 'hogan':
        return {
          accent: 'text-yellow-300 border-yellow-400 bg-yellow-50',
          button: 'bg-yellow-600 hover:bg-yellow-700',
          progress: 'bg-yellow-600'
        };
      default:
        return {
          accent: 'text-blue-400 border-blue-400 bg-blue-50',
          button: 'bg-blue-600 hover:bg-blue-700',
          progress: 'bg-blue-600'
        };
    }
  };

  const theme = getThemeClasses();
  const currentTourStep = tourSteps[currentStep - 1];
  const progress = (currentStep / tourSteps.length) * 100;

  const nextStep = () => {
    if (currentStep < tourSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const markStepCompleted = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
      
      toast({
        title: "Step Completed!",
        description: `Step ${stepId}: ${tourSteps[stepId - 1].title}`,
      });

      // Auto-advance to next step
      if (stepId === currentStep && stepId < tourSteps.length) {
        setTimeout(nextStep, 1000);
      }
    }
  };

  const skipTour = () => {
    localStorage.setItem('staticBuffetHasSeenTour', 'true');
    setIsOpen(false);
    
    toast({
      title: "Tour Skipped",
      description: "You can restart the tour anytime from the help menu.",
    });
  };

  const completeTour = () => {
    localStorage.setItem('staticBuffetHasSeenTour', 'true');
    setIsOpen(false);
    
    toast({
      title: "Welcome to Static Buffet!",
      description: "You're ready to start mixing public domain video content like a pro.",
    });
  };

  const restartTour = () => {
    setCurrentStep(1);
    setCompletedSteps([]);
    setIsOpen(true);
  };

  // Add spotlight effect for current target
  const addSpotlight = (targetId: string) => {
    // Remove existing spotlights
    document.querySelectorAll('.tour-spotlight').forEach(el => {
      el.classList.remove('tour-spotlight');
    });

    // Add spotlight to current target
    const target = document.querySelector(`[data-tour-target="${targetId}"]`);
    if (target) {
      target.classList.add('tour-spotlight');
    }
  };

  useEffect(() => {
    if (isOpen && currentTourStep) {
      addSpotlight(currentTourStep.target);
    }

    return () => {
      // Cleanup spotlights when component unmounts
      document.querySelectorAll('.tour-spotlight').forEach(el => {
        el.classList.remove('tour-spotlight');
      });
    };
  }, [isOpen, currentStep, currentTourStep]);

  // Public method to start tour (can be called from other components)
  const startTour = () => {
    restartTour();
  };

  // Attach restart function to window for external access
  useEffect(() => {
    (window as any).startStaticBuffetTour = startTour;
    return () => {
      delete (window as any).startStaticBuffetTour;
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay with spotlight effect */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), 
              transparent 150px, 
              rgba(0, 0, 0, 0.7) 300px
            )
          `
        }}
      />

      {/* Tour Dialog */}
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent 
          className="max-w-md z-50"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Static Buffet Tour</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {currentStep} of {tourSteps.length}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${theme.progress}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Current Step */}
            <Card className={`border-2 ${theme.accent.split(' ')[1]} ${theme.accent.split(' ')[2]}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-3 text-lg">
                  <div className={`p-2 rounded-lg ${theme.accent.split(' ')[2]}`}>
                    {currentTourStep.icon}
                  </div>
                  <div>
                    <div className="font-bold">{currentTourStep.title}</div>
                    <Badge variant="outline" className="text-xs mt-1">
                      Step {currentStep}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">
                  {currentTourStep.description}
                </p>
                
                {currentTourStep.tip && (
                  <div className={`p-3 rounded-lg ${theme.accent.split(' ')[2]} border-l-4 ${theme.accent.split(' ')[1]}`}>
                    <div className="flex items-start space-x-2">
                      <Timer className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-xs font-medium">
                        <strong>Pro Tip:</strong> {currentTourStep.tip}
                      </p>
                    </div>
                  </div>
                )}

                {/* Step completion indicator */}
                {completedSteps.includes(currentStep) && (
                  <div className="flex items-center space-x-2 text-green-600 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    <span>Step completed!</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  variant="outline"
                  size="sm"
                  data-testid="button-tour-prev"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                
                {currentStep < tourSteps.length ? (
                  <Button
                    onClick={nextStep}
                    className={`text-white ${theme.button}`}
                    size="sm"
                    data-testid="button-tour-next"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={completeTour}
                    className={`text-white ${theme.button}`}
                    size="sm"
                    data-testid="button-tour-complete"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Get Started
                  </Button>
                )}
              </div>

              <Button
                onClick={skipTour}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
                data-testid="button-tour-skip"
              >
                <X className="w-4 h-4 mr-1" />
                Skip Tour
              </Button>
            </div>

            {/* Step indicators */}
            <div className="flex justify-center space-x-2">
              {tourSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step.id === currentStep
                      ? theme.button.split(' ')[0]
                      : completedSteps.includes(step.id)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                  title={step.title}
                  data-testid={`button-tour-step-${step.id}`}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CSS for spotlight effect */}
      <style>{`
        .tour-spotlight {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 2px ${theme.accent.split(' ')[1].replace('border-', '').replace('-', '')}, 
                      0 0 0 4px rgba(255, 255, 255, 0.5),
                      0 0 20px rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          animation: tourPulse 2s infinite;
        }
        
        @keyframes tourPulse {
          0%, 100% { 
            box-shadow: 0 0 0 2px ${theme.accent.split(' ')[1].replace('border-', '').replace('-', '')}, 
                        0 0 0 4px rgba(255, 255, 255, 0.5),
                        0 0 20px rgba(0, 0, 0, 0.3);
          }
          50% { 
            box-shadow: 0 0 0 2px ${theme.accent.split(' ')[1].replace('border-', '').replace('-', '')}, 
                        0 0 0 8px rgba(255, 255, 255, 0.8),
                        0 0 30px rgba(0, 0, 0, 0.4);
          }
        }
      `}</style>
    </>
  );
}

// Export the start tour function for external use
export const startTour = () => {
  if ((window as any).startStaticBuffetTour) {
    (window as any).startStaticBuffetTour();
  }
};