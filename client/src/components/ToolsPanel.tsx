import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Play, 
  Users, 
  Camera,
  Sparkles, 
  Layers, 
  Palette, 
  Music, 
  Video, 
  Zap, 
  Dice6, 
  Settings,
  Grid3X3,
  RotateCcw,
  Save,
  Monitor,
  Pause,
  Square,
  Circle,
  RefreshCw,
  Eye,
  Type,
  Lock,
  Unlock,
  Move
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { getThemeClasses } from '@/lib/theme-utils';
import { MediaControls } from '@/components/MediaControls';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { searchVideos } from '@/lib/archive-api';
import { generateEmergencyMix } from '@/lib/emergency-mix';
import { TextGenerator } from '@/components/TextGenerator';

export function ToolsPanel() {
  const { 
    brandSkin, 
    floatingPanelStates, 
    setFloatingPanelVisible,
    togglePanelLock,
    bringPanelToFront,
    searchResults,
    queueItems,
    setQueueItems,
    setSearchState,
    setSearchResults,
    addToQueue,
    setTotalResults,
    setLoading,
    resetToDefaultLayout
  } = useStore();
  
  const { toast } = useToast();
  
  const themeClasses = getThemeClasses(brandSkin);
  const [testCardOpen, setTestCardOpen] = useState(false);
  const [textToolOpen, setTextToolOpen] = useState(false);
  
  // Toolbar drag state
  const [isLocked, setIsLocked] = useState(true);
  const [position, setPosition] = useState({ x: 16, y: 128 }); // left-4 top-32 in pixels
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLocked) return;
    
    // Don't start drag if clicking on a button
    if ((e.target as HTMLElement).closest('button')) return;
    
    const rect = toolbarRef.current?.getBoundingClientRect();
    if (rect) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isLocked) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Keep toolbar within viewport bounds
    const maxX = window.innerWidth - 128; // toolbar width
    const maxY = window.innerHeight - 400; // approximate toolbar height
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, isLocked]);

  const toggleLock = () => {
    setIsLocked(!isLocked);
    toast({
      title: isLocked ? "Toolbar Unlocked" : "Toolbar Locked",
      description: isLocked ? "You can now drag the toolbar to move it" : "Toolbar position is now locked",
    });
  };

  const togglePanel = (panelId: keyof typeof floatingPanelStates) => {
    const panel = floatingPanelStates[panelId];
    if (panel?.visible) {
      setFloatingPanelVisible(panelId, false);
    } else {
      setFloatingPanelVisible(panelId, true);
      bringPanelToFront(panelId);
    }
  };

  // Lucky Dip function
  const handleLuckyDip = async () => {
    setLoading(true);

    try {
      const LUCKY_DIP_QUERIES = [
        'vintage training film',
        'public service announcement',
        'educational short',
        'safety demonstration',
        'promotional film',
        'documentary short',
        'instructional video',
        'industrial film',
        'newsreel footage',
        'animation short',
        'advertising film',
        'government film'
      ];

      // Pick random queries and combine search terms
      const randomQueries = [...LUCKY_DIP_QUERIES]
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      const combinedQuery = `${randomQueries.join(' OR ')} AND mediatype:movies AND (licenseurl:*publicdomain* OR collection:*publicdomain*) AND (collection:prelinger OR collection:fedflix) AND year:[1940 TO 1990]`;
      
      const searchParams = {
        query: combinedQuery,
        license: 'publicdomain' as const,
        duration: 'short' as const,
        yearFrom: '1940',
        yearTo: '1990',
        sort: 'relevance' as const,
        page: Math.floor(Math.random() * 3) + 1,
        sources: ['prelinger', 'fedflix'],
        allowRestrictedLicenses: false
      };

      setSearchState(searchParams);
      const results = await searchVideos(searchParams);
      
      if (results?.docs && results.docs.length > 0) {
        const shuffledResults = [...results.docs]
          .sort(() => 0.5 - Math.random())
          .slice(0, 15);

        setSearchResults(shuffledResults);
        setTotalResults(shuffledResults.length);

        toast({
          title: "Lucky Dip Success!",
          description: `Found ${shuffledResults.length} legally safe vintage clips ready for mixing.`,
        });
      } else {
        toast({
          title: "Lucky Dip Failed",
          description: "No results found. Try again for a different random selection.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lucky Dip Error",
        description: "Something went wrong with the search.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  // Emergency Mix function
  const handleEmergencyMix = () => {
    try {
      if (searchResults.length === 0) {
        toast({
          title: "No results available",
          description: "Search for videos first to generate an emergency mix",
          variant: "destructive",
        });
        return;
      }

      const emergencyMixSettings = {
        duration: 150,
        segmentLength: [2, 5],
        crossfadeDuration: 0.5,
        maxClips: 10,
      };

      const mixItems = generateEmergencyMix(searchResults, emergencyMixSettings);
      setQueueItems(mixItems);
      
      toast({
        title: "Emergency Mix Generated!",
        description: `Created ${mixItems.length} clips totaling ${Math.floor(emergencyMixSettings.duration / 60)}:${(emergencyMixSettings.duration % 60).toString().padStart(2, '0')}`,
      });
      
    } catch (error) {
      toast({
        title: "Mix Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate emergency mix",
        variant: "destructive",
      });
    }
  };

  // Column 1 Tools (Left)
  const leftColumnTools = [
    { id: "search", icon: Search, label: "Search Results", tooltip: "Show/Hide Search Results Panel" },
    { id: "player", icon: Play, label: "Program Output", tooltip: "Show/Hide Program Output Panel" },
    { id: "queue", icon: Users, label: "Queue", tooltip: "Show/Hide Queue Panel" },
    { id: "liveVideo", icon: Camera, label: "Live Input", tooltip: "Enable Live Video Input", isSpecial: true },
    { id: "videoEffects", icon: Video, label: "Video FX", tooltip: "Show/Hide Video Effects Panel" }
  ];

  // Column 2 Tools (Right)
  const rightColumnTools = [
    { id: "audioEffects", icon: Music, label: "Audio FX", tooltip: "Show/Hide Audio Effects Panel" },
    { id: "preview", icon: Eye, label: "Preview", tooltip: "Show/Hide Preview Window" },
    { id: "presetEffects", icon: Palette, label: "Quick Effects", tooltip: "Show/Hide Quick Effects Panel" },
    { id: "textTool", icon: Type, label: "Text Tool", tooltip: "Open Text Generator", isSpecial: true },
    { id: "testCard", icon: Monitor, label: "Test Card", tooltip: "Show Test Card for VJ Output", isSpecial: true }
  ];

  return (
    <>
      <div 
        ref={toolbarRef}
        className={`fixed w-32 ${themeClasses.bgSecondary} ${themeClasses.border} border rounded-lg shadow-2xl backdrop-blur-sm z-50 transition-all duration-200 ${
          !isLocked ? 'cursor-move' : ''
        } ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          userSelect: 'none'
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="p-2 space-y-3">
        {/* Header with Lock/Unlock */}
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium opacity-60">TOOLBAR</div>
          <Button
            onClick={toggleLock}
            variant="ghost"
            size="sm"
            className={`w-5 h-5 p-0 transition-all duration-200 ${themeClasses.textSecondary} hover:${themeClasses.accent}`}
            title={isLocked ? "Unlock toolbar to move it" : "Lock toolbar position"}
          >
            {isLocked ? <Lock size={10} /> : <Unlock size={10} />}
          </Button>
        </div>

        {/* Media Controls Section - Two Rows */}
        <div className="space-y-1">
          <div className="text-xs text-center font-medium opacity-60 mb-2">MEDIA</div>
          
          {/* Media Controls - embedded directly */}
          <div className="space-y-1">
            {/* Row 1: Play/Pause, Stop, Record */}
            <div className="flex justify-between gap-1">
              <MediaControlButton icon={Play} tooltip="Play/Pause" />
              <MediaControlButton icon={Square} tooltip="Stop" />
              <MediaControlButton icon={Circle} tooltip="Record" />
            </div>
            
            {/* Row 2: Emergency Mix, Lucky Dip, Reset Layout */}
            <div className="flex justify-between gap-1">
              <Button
                onClick={handleEmergencyMix}
                variant="ghost"
                size="sm"
                className={`w-8 h-8 p-0 transition-all duration-200 ${themeClasses.textSecondary} hover:${themeClasses.accent}`}
                title="Generate Emergency Mix"
              >
                <Zap size={14} />
              </Button>
              
              <Button
                onClick={handleLuckyDip}
                variant="ghost"
                size="sm"
                className={`w-8 h-8 p-0 transition-all duration-200 ${themeClasses.textSecondary} hover:${themeClasses.accent}`}
                title="Get Random Clips"
              >
                <Dice6 size={14} />
              </Button>
              
              <Button
                onClick={() => {
                  resetToDefaultLayout();
                  toast({
                    title: "Layout Reset",
                    description: "Panels restored to default positions",
                  });
                }}
                variant="ghost"
                size="sm"
                className={`w-8 h-8 p-0 transition-all duration-200 ${themeClasses.textSecondary} hover:${themeClasses.accent}`}
                title="Reset Layout"
              >
                <RefreshCw size={14} />
              </Button>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className={`w-full h-px ${themeClasses.border}`} />

        {/* Tools Section - Two Columns */}
        <div className="space-y-1">
          <div className="text-xs text-center font-medium opacity-60 mb-2">TOOLS</div>
          
          <div className="grid grid-cols-2 gap-1">
            {/* Left Column */}
            <div className="space-y-1">
              {leftColumnTools.map((tool) => {
                const Icon = tool.icon;
                
                // Handle special text tool button
                if (tool.id === 'textTool') {
                  return (
                    <Button
                      key={tool.id}
                      onClick={() => setTextToolOpen(true)}
                      variant="ghost"
                      size="sm"
                      className={`w-12 h-10 p-0 transition-all duration-200 ${themeClasses.textSecondary} hover:${themeClasses.accent} hover:${themeClasses.bgSecondary}`}
                      title={tool.tooltip}
                      data-testid={`tool-${tool.id}`}
                    >
                      <Icon size={16} />
                    </Button>
                  );
                }
                
                // Handle regular panel toggle buttons
                const panel = floatingPanelStates[tool.id as keyof typeof floatingPanelStates];
                const isVisible = panel?.visible ?? false;
                
                return (
                  <Button
                    key={tool.id}
                    onClick={() => togglePanel(tool.id as keyof typeof floatingPanelStates)}
                    variant="ghost"
                    size="sm"
                    className={`w-12 h-10 p-0 transition-all duration-200 ${
                      isVisible 
                        ? `${themeClasses.accent} ${themeClasses.bgSecondary} shadow-md` 
                        : `${themeClasses.textSecondary} hover:${themeClasses.accent} hover:${themeClasses.bgSecondary}`
                    }`}
                    title={tool.tooltip}
                    data-testid={`tool-${tool.id}`}
                  >
                    <Icon size={16} />
                  </Button>
                );
              })}
            </div>
            
            {/* Right Column */}
            <div className="space-y-1">
              {rightColumnTools.map((tool) => {
                const Icon = tool.icon;
                
                // Handle special buttons
                if (tool.id === 'testCard') {
                  return (
                    <Button
                      key={tool.id}
                      onClick={() => setTestCardOpen(true)}
                      variant="ghost"
                      size="sm"
                      className={`w-12 h-10 p-0 transition-all duration-200 ${themeClasses.textSecondary} hover:${themeClasses.accent} hover:${themeClasses.bgSecondary}`}
                      title={tool.tooltip}
                      data-testid={`tool-${tool.id}`}
                    >
                      <Icon size={16} />
                    </Button>
                  );
                }
                
                if (tool.id === 'textTool') {
                  return (
                    <Button
                      key={tool.id}
                      onClick={() => setTextToolOpen(true)}
                      variant="ghost"
                      size="sm"
                      className={`w-12 h-10 p-0 transition-all duration-200 ${themeClasses.textSecondary} hover:${themeClasses.accent} hover:${themeClasses.bgSecondary}`}
                      title={tool.tooltip}
                      data-testid={`tool-${tool.id}`}
                    >
                      <Icon size={16} />
                    </Button>
                  );
                }
                
                // Handle regular panel toggle buttons
                const panel = floatingPanelStates[tool.id as keyof typeof floatingPanelStates];
                const isVisible = panel?.visible ?? false;
                
                return (
                  <Button
                    key={tool.id}
                    onClick={() => togglePanel(tool.id as keyof typeof floatingPanelStates)}
                    variant="ghost"
                    size="sm"
                    className={`w-12 h-10 p-0 transition-all duration-200 ${
                      isVisible 
                        ? `${themeClasses.accent} ${themeClasses.bgSecondary} shadow-md` 
                        : `${themeClasses.textSecondary} hover:${themeClasses.accent} hover:${themeClasses.bgSecondary}`
                    }`}
                    title={tool.tooltip}
                    data-testid={`tool-${tool.id}`}
                  >
                    <Icon size={16} />
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
      
      {/* Test Card Dialog */}
      <Dialog open={testCardOpen} onOpenChange={setTestCardOpen}>
        <DialogContent className={`max-w-2xl ${themeClasses.bg} ${themeClasses.border}`}>
          <DialogHeader>
            <DialogTitle className={themeClasses.text}>Test Card - VJ Output</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className={`flex justify-center ${themeClasses.bgSecondary} p-6 rounded-lg border ${themeClasses.borderSecondary}`}>
              <div 
                className="w-full max-w-lg aspect-[4/3] shadow-lg rounded"
                style={{
                  background: `
                    repeating-conic-gradient(
                      from 0deg at 50% 50%,
                      #000000 0deg 45deg,
                      #dc2626 45deg 90deg,
                      #22c55e 90deg 135deg,
                      #3b82f6 135deg 180deg,
                      #06b6d4 180deg 225deg,
                      #ec4899 225deg 270deg,
                      #eab308 270deg 315deg,
                      #ffffff 315deg 360deg
                    ),
                    radial-gradient(circle at 50% 50%, 
                      rgba(255, 255, 255, 0.9) 0%, 
                      rgba(255, 255, 255, 0.9) 8%, 
                      transparent 8%, 
                      transparent 15%,
                      rgba(0, 0, 0, 0.1) 15%,
                      transparent 16%
                    ),
                    radial-gradient(circle at 50% 50%, 
                      transparent 0%, 
                      transparent 70%,
                      rgba(255, 255, 255, 0.3) 70%, 
                      rgba(255, 255, 255, 0.3) 72%, 
                      transparent 72%
                    )
                  `,
                  backgroundSize: '100% 100%, 150px 150px, 300px 300px',
                  backgroundPosition: 'center, center, center'
                }}
              />
            </div>
            <div className="flex justify-center space-x-2">
              <Button
                onClick={() => {
                  // Create a test card video item
                  const testCardVideo = {
                    identifier: 'static-buffet-test-card',
                    title: 'Static Buffet Test Card Pattern',
                    creator: 'Static Buffet VJ Tool',
                    year: new Date().getFullYear().toString(),
                    description: 'Professional broadcast test card pattern for VJ output',
                    duration: '∞',
                    licenseurl: 'https://creativecommons.org/licenses/publicdomain/',
                    downloads: 1,
                    date: new Date().toISOString().split('T')[0]
                  };
                  
                  // Use data URL for the test card pattern
                  const testCardDataUrl = 'data:image/svg+xml;base64,' + btoa(`
                    <svg width="640" height="480" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="testPattern" x="0" y="0" width="80" height="60" patternUnits="userSpaceOnUse">
                          <rect width="80" height="60" fill="#000"/>
                          <rect width="10" height="60" fill="#dc2626"/>
                          <rect x="10" width="10" height="60" fill="#22c55e"/>
                          <rect x="20" width="10" height="60" fill="#3b82f6"/>
                          <rect x="30" width="10" height="60" fill="#06b6d4"/>
                          <rect x="40" width="10" height="60" fill="#ec4899"/>
                          <rect x="50" width="10" height="60" fill="#eab308"/>
                          <rect x="60" width="10" height="60" fill="#fff"/>
                          <rect x="70" width="10" height="60" fill="#6b7280"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#testPattern)"/>
                      <circle cx="320" cy="240" r="50" fill="white" fill-opacity="0.9"/>
                      <circle cx="320" cy="240" r="40" fill="none" stroke="black" stroke-width="2"/>
                      <line x1="320" y1="200" x2="320" y2="280" stroke="black" stroke-width="2"/>
                      <line x1="280" y1="240" x2="360" y2="240" stroke="black" stroke-width="2"/>
                    </svg>
                  `);

                  addToQueue(testCardVideo, testCardDataUrl);
                  
                  toast({
                    title: "Test Card Added to Queue",
                    description: "Professional test card pattern added to playback queue",
                  });
                  setTestCardOpen(false);
                }}
                className={`${themeClasses.accentBg} text-white hover:opacity-90`}
              >
                Add to Output
              </Button>
              <Button
                variant="outline"
                onClick={() => setTestCardOpen(false)}
                className={`border ${themeClasses.border} ${themeClasses.textSecondary} ${themeClasses.hover}`}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Text Tool Dialog */}
      <Dialog open={textToolOpen} onOpenChange={setTextToolOpen}>
        <DialogContent className={`max-w-md max-h-[85vh] overflow-y-auto ${themeClasses.bg} ${themeClasses.border}`}>
          <DialogHeader>
            <DialogTitle className={`${themeClasses.text} flex items-center gap-2`}>
              <Type size={16} />
              Text Generator
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <TextGenerator />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helper component for media control buttons
function MediaControlButton({ icon: Icon, tooltip }: { icon: any, tooltip: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-8 h-8 p-0 transition-all duration-200 text-gray-400 hover:text-white"
      title={tooltip}
    >
      <Icon size={14} />
    </Button>
  );
}

