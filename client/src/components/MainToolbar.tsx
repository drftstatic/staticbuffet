import React from 'react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { 
  Eye,
  Headphones,
  Sparkles,
  Search,
  List,
  Grid3x3,
  Music,
  Settings,
  Video,
  Image,
  Tv,
  Monitor,
  Palette,
  Filter,
  FileText,
  BarChart3,
  Layers,
  PanelLeft,
  PanelRight,
  Square,
  Play,
  Wand2,
  Compass,
  MonitorPlay,
  Wrench
} from 'lucide-react';

export function MainToolbar() {
  const { 
    floatingPanelStates, 
    setFloatingPanelVisible,
    setFloatingPanelMinimized 
  } = useStore();

  const togglePanel = (panelId: keyof typeof floatingPanelStates) => {
    const panel = floatingPanelStates[panelId];
    if (panel?.visible) {
      // If visible, hide it
      setFloatingPanelVisible(panelId, false);
    } else {
      // If hidden, show it and un-minimize
      setFloatingPanelVisible(panelId, true);
      setFloatingPanelMinimized(panelId, false);
    }
  };

  const toolbarSections = [
    {
      title: "Effects",
      icon: Wand2,
      description: "Video & Audio Effects",
      items: [
        {
          id: 'presetEffects',
          label: 'INSTANT FX',
          icon: Sparkles,
          color: 'text-purple-500',
          bgColor: 'bg-purple-50 hover:bg-purple-100',
          borderColor: 'border-purple-200'
        },
        {
          id: 'videoEffects',
          label: 'Video FX',
          icon: Eye,
          color: 'text-blue-500',
          bgColor: 'bg-blue-50 hover:bg-blue-100',
          borderColor: 'border-blue-200'
        },
        {
          id: 'audioEffects', 
          label: 'Audio FX',
          icon: Headphones,
          color: 'text-green-500',
          bgColor: 'bg-green-50 hover:bg-green-100',
          borderColor: 'border-green-200'
        }
      ]
    },
    {
      title: "Search & Browse",
      icon: Compass,
      description: "Find & Discover Content",
      items: [
        {
          id: 'search',
          label: 'Search',
          icon: Search,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50 hover:bg-orange-100',
          borderColor: 'border-orange-200'
        },
        {
          id: 'resultsGrid',
          label: 'Results',
          icon: Grid3x3,
          color: 'text-indigo-500',
          bgColor: 'bg-indigo-50 hover:bg-indigo-100',
          borderColor: 'border-indigo-200'
        },
        {
          id: 'queue',
          label: 'Queue',
          icon: List,
          color: 'text-teal-500',
          bgColor: 'bg-teal-50 hover:bg-teal-100',
          borderColor: 'border-teal-200'
        }
      ]
    },
    {
      title: "Media & Player",
      icon: MonitorPlay,
      description: "Playback & Controls",
      items: [
        {
          id: 'liveVideo',
          label: 'Live Video',
          icon: Video,
          color: 'text-red-500',
          bgColor: 'bg-red-50 hover:bg-red-100',
          borderColor: 'border-red-200'
        },
        {
          id: 'mediaControls',
          label: 'Controls',
          icon: Play,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 hover:bg-gray-100',
          borderColor: 'border-gray-200'
        },
        {
          id: 'popOutPlayer',
          label: 'Pop Out',
          icon: Monitor,
          color: 'text-cyan-500',
          bgColor: 'bg-cyan-50 hover:bg-cyan-100',
          borderColor: 'border-cyan-200'
        }
      ]
    },
    {
      title: "Tools & Utilities",
      icon: Wrench,
      description: "Settings & Help",
      items: [
        {
          id: 'keyboardShortcuts',
          label: 'Shortcuts',
          icon: Settings,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50 hover:bg-gray-100',
          borderColor: 'border-gray-200'
        }
      ]
    }
  ];

  return (
    <div className="bg-black/90 backdrop-blur-md border-b border-white/20 p-2">
      <div className="flex flex-wrap gap-3">
        {toolbarSections.map((section, sectionIndex) => {
          const SectionIcon = section.icon;
          return (
            <div key={section.title} className="flex items-center gap-1">
              {sectionIndex > 0 && (
                <div className="w-px h-6 bg-white/20 mx-1" />
              )}
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10">
                  <SectionIcon size={12} className="text-white/70" />
                  <span className="text-xs text-white/80 font-semibold tracking-wide uppercase">
                    {section.title}
                  </span>
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isVisible = floatingPanelStates[item.id as keyof typeof floatingPanelStates]?.visible ?? false;
                  
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePanel(item.id as keyof typeof floatingPanelStates)}
                      className={`h-8 px-3 text-xs transition-all duration-200 ${
                        isVisible 
                          ? `${item.bgColor} ${item.borderColor} border text-gray-800 font-medium shadow-sm` 
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                      title={`Toggle ${item.label} panel`}
                    >
                      <Icon size={14} className={isVisible ? item.color : 'text-current'} />
                      <span className="ml-1.5">{item.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}