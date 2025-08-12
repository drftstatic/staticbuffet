import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Palette, 
  Layout, 
  Move, 
  Maximize2, 
  Tv, 
  HelpCircle,
  Info,
  Layers,
  Monitor,
  Smartphone,
  Tablet,
  X,
  RotateCcw,
  Keyboard,
  BookOpen,
  Video,
  Zap
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { ThemeSelector } from './ThemeSelector';
import { ResponsiveLayoutHints } from './ResponsiveLayoutHints';
import { LayoutControls } from './LayoutControls';

import { getThemeClasses } from '@/lib/theme-utils';

interface MasterControlPanelProps {
  onShowTour?: () => void;
  onShowAbout?: () => void;
}

export function MasterControlPanel({ onShowTour, onShowAbout }: MasterControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'workspace' | 'help'>('visual');
  
  const { 
    brandSkin, 
    isFloatingMode, 
    setFloatingMode,
    isResizableMode, 
    setResizableMode, 
    resetPanels 
  } = useStore();
  
  const themeClasses = getThemeClasses(brandSkin);

  // Simplified tab structure for better organization
  const tabs = [
    { 
      id: 'visual', 
      label: 'Visual', 
      icon: Palette, 
      description: 'Themes & appearance',
      badge: brandSkin === 'testcard' ? null : '✨'
    },
    { 
      id: 'workspace', 
      label: 'Workspace', 
      icon: Layout, 
      description: 'Layout & panels',
      badge: isFloatingMode || isResizableMode ? '🎛️' : null
    },
    { 
      id: 'help', 
      label: 'Help', 
      icon: HelpCircle, 
      description: 'Guides & shortcuts',
      badge: null
    },
  ] as const;

  if (!isOpen) {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 right-4 z-50 ${themeClasses.bg} ${themeClasses.accent} hover:scale-105 transition-all duration-200 shadow-lg backdrop-blur-sm border-2`}
        style={{ borderColor: `var(--${brandSkin}-accent)` }}
        data-testid="button-open-master-control"
      >
        <Settings size={16} className="mr-1" />
        <span className="hidden sm:inline">Control</span>
      </Button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`${themeClasses.panelBg} ${themeClasses.border} rounded-xl shadow-2xl backdrop-blur-sm w-[420px] max-h-[85vh] overflow-hidden border-2`} style={{ borderColor: `var(--${brandSkin}-accent)` }}>
        {/* Enhanced Header */}
        <div className={`flex items-center justify-between p-4 border-b-2 ${themeClasses.border}`} style={{ borderColor: `var(--${brandSkin}-accent)` }}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${themeClasses.bg}`} style={{ backgroundColor: `var(--${brandSkin}-accent)`, opacity: 0.1 }}>
              <Settings size={16} style={{ color: `var(--${brandSkin}-accent)` }} />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${themeClasses.text}`}>Master Control</h3>
              <p className={`text-xs ${themeClasses.textSecondary}`}>Static Buffet v0.7.2</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className={`h-8 w-8 p-0 hover:bg-red-500/20 transition-colors rounded-lg`}
            data-testid="button-close-master-control"
          >
            <X size={16} className="text-red-400" />
          </Button>
        </div>

        {/* Enhanced Tabs */}
        <div className={`flex border-b-2 ${themeClasses.border}`} style={{ borderColor: `var(--${brandSkin}-accent)` }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-4 px-3 text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? `${themeClasses.accent} bg-white/10 shadow-sm`
                    : `${themeClasses.textSecondary} hover:bg-white/5`
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <div className="flex items-center space-x-1">
                  <Icon size={16} />
                  {tab.badge && (
                    <span className="text-xs">{tab.badge}</span>
                  )}
                </div>
                <span className="text-xs mt-1">{tab.label}</span>
                <span className="text-[10px] opacity-60 hidden lg:block">{tab.description}</span>
                {isActive && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5" 
                    style={{ backgroundColor: `var(--${brandSkin}-accent)` }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Enhanced Content */}
        <div className="p-6 max-h-[500px] overflow-y-auto space-y-6">
          {activeTab === 'visual' && (
            <div className="space-y-6">
              {/* Theme Section */}
              <div className={`p-4 rounded-xl border-2 ${themeClasses.bg}`} style={{ borderColor: `var(--${brandSkin}-accent)`, backgroundColor: `var(--${brandSkin}-accent)`, opacity: 0.05 }}>
                <div className="flex items-center space-x-2 mb-4">
                  <Palette size={18} style={{ color: `var(--${brandSkin}-accent)` }} />
                  <h4 className={`font-semibold text-lg ${themeClasses.text}`}>Visual Themes</h4>
                  <Badge variant="secondary" className="text-xs">
                    {brandSkin === 'testcard' ? 'Default' : 'Custom'}
                  </Badge>
                </div>
                <p className={`text-sm mb-4 ${themeClasses.textSecondary}`}>
                  Choose from 10 unique VJ-inspired visual themes
                </p>
                <ThemeSelector />
              </div>

              {/* Responsive Preview */}
              <div className={`p-4 rounded-xl border-2 ${themeClasses.bg}`} style={{ borderColor: `var(--${brandSkin}-accent)`, backgroundColor: `var(--${brandSkin}-accent)`, opacity: 0.05 }}>
                <div className="flex items-center space-x-2 mb-4">
                  <Monitor size={18} style={{ color: `var(--${brandSkin}-accent)` }} />
                  <h4 className={`font-semibold text-lg ${themeClasses.text}`}>Responsive Preview</h4>
                  <Badge variant="secondary" className="text-xs">Interactive</Badge>
                </div>
                <p className={`text-sm mb-4 ${themeClasses.textSecondary}`}>
                  See how the interface adapts across desktop, tablet, and mobile
                </p>
                <ResponsiveLayoutHints />
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="space-y-6">
              {/* Layout Modes */}
              <div className={`p-4 rounded-xl border-2 ${themeClasses.bg}`} style={{ borderColor: `var(--${brandSkin}-accent)`, backgroundColor: `var(--${brandSkin}-accent)`, opacity: 0.05 }}>
                <div className="flex items-center space-x-2 mb-4">
                  <Layout size={18} style={{ color: `var(--${brandSkin}-accent)` }} />
                  <h4 className={`font-semibold text-lg ${themeClasses.text}`}>Panel Layout</h4>
                  <Badge variant="secondary" className="text-xs">
                    {isFloatingMode ? 'Floating' : isResizableMode ? 'Resizable' : 'Grid'}
                  </Badge>
                </div>
                <p className={`text-sm mb-4 ${themeClasses.textSecondary}`}>
                  Choose how panels are organized and behave
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={isFloatingMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFloatingMode(!isFloatingMode)}
                    className="flex flex-col items-center py-3 space-y-1"
                    data-testid="button-toggle-floating-mode"
                  >
                    <Move size={16} />
                    <span className="text-xs">Floating</span>
                    <span className="text-[10px] opacity-60">Independent panels</span>
                  </Button>
                  
                  <Button
                    variant={isResizableMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setResizableMode(!isResizableMode)}
                    className="flex flex-col items-center py-3 space-y-1"
                    data-testid="button-toggle-resizable-mode"
                  >
                    <Maximize2 size={16} />
                    <span className="text-xs">Resizable</span>
                    <span className="text-[10px] opacity-60">Adjustable panels</span>
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`p-4 rounded-xl border-2 ${themeClasses.bg}`} style={{ borderColor: `var(--${brandSkin}-accent)`, backgroundColor: `var(--${brandSkin}-accent)`, opacity: 0.05 }}>
                <div className="flex items-center space-x-2 mb-4">
                  <RotateCcw size={18} style={{ color: `var(--${brandSkin}-accent)` }} />
                  <h4 className={`font-semibold text-lg ${themeClasses.text}`}>Quick Actions</h4>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetPanels}
                    className="w-full flex items-center justify-between py-3"
                    data-testid="button-reset-panels"
                  >
                    <div className="flex items-center space-x-2">
                      <Tv size={16} />
                      <span>Reset Layout</span>
                    </div>
                    <span className="text-xs opacity-60">Restore defaults</span>
                  </Button>
                </div>
              </div>

              {/* Saved Layouts */}
              <div className={`p-4 rounded-xl border-2 ${themeClasses.bg}`} style={{ borderColor: `var(--${brandSkin}-accent)`, backgroundColor: `var(--${brandSkin}-accent)`, opacity: 0.05 }}>
                <div className="flex items-center space-x-2 mb-4">
                  <Layers size={18} style={{ color: `var(--${brandSkin}-accent)` }} />
                  <h4 className={`font-semibold text-lg ${themeClasses.text}`}>Workspace Layouts</h4>
                  <Badge variant="secondary" className="text-xs">Save & Load</Badge>
                </div>
                <p className={`text-sm mb-4 ${themeClasses.textSecondary}`}>
                  Save your custom panel arrangements
                </p>
                <LayoutControls />
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-6">
              {/* Getting Started */}
              <div className={`p-4 rounded-xl border-2 ${themeClasses.bg}`} style={{ borderColor: `var(--${brandSkin}-accent)`, backgroundColor: `var(--${brandSkin}-accent)`, opacity: 0.05 }}>
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen size={18} style={{ color: `var(--${brandSkin}-accent)` }} />
                  <h4 className={`font-semibold text-lg ${themeClasses.text}`}>Getting Started</h4>
                  <Badge variant="secondary" className="text-xs">Guides</Badge>
                </div>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Trigger welcome modal
                      (window as any).showStaticBuffetWelcome?.();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between py-3"
                    data-testid="button-show-welcome"
                  >
                    <div className="flex items-center space-x-2">
                      <Info size={16} />
                      <span>Welcome Guide</span>
                    </div>
                    <span className="text-xs opacity-60">Introduction</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onShowTour?.();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between py-3"
                    data-testid="button-show-tour"
                  >
                    <div className="flex items-center space-x-2">
                      <Video size={16} />
                      <span>Interactive Tour</span>
                    </div>
                    <span className="text-xs opacity-60">4 steps</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onShowAbout?.();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between py-3"
                    data-testid="button-show-about"
                  >
                    <div className="flex items-center space-x-2">
                      <Info size={16} />
                      <span>About Static Buffet</span>
                    </div>
                    <span className="text-xs opacity-60">v0.7.2</span>
                  </Button>
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <div className={`p-4 rounded-xl border-2 ${themeClasses.bg}`} style={{ borderColor: `var(--${brandSkin}-accent)`, backgroundColor: `var(--${brandSkin}-accent)`, opacity: 0.05 }}>
                <div className="flex items-center space-x-2 mb-4">
                  <Keyboard size={18} style={{ color: `var(--${brandSkin}-accent)` }} />
                  <h4 className={`font-semibold text-lg ${themeClasses.text}`}>Keyboard Shortcuts</h4>
                  <Badge variant="secondary" className="text-xs">Hotkeys</Badge>
                </div>
                <div className={`space-y-3 ${themeClasses.textSecondary}`}>
                  <div className="flex items-center justify-between p-2 rounded bg-black/10">
                    <div className="flex items-center space-x-2">
                      <Zap size={14} />
                      <span className="text-sm">Effects 1-8</span>
                    </div>
                    <kbd className="px-2 py-1 bg-gray-700 text-gray-200 text-xs rounded font-mono">1-8</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-black/10">
                    <div className="flex items-center space-x-2">
                      <Palette size={14} />
                      <span className="text-sm">Theme easter eggs</span>
                    </div>
                    <kbd className="px-2 py-1 bg-gray-700 text-gray-200 text-xs rounded font-mono">Triple-click</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-black/10">
                    <div className="flex items-center space-x-2">
                      <HelpCircle size={14} />
                      <span className="text-sm">Help overlay</span>
                    </div>
                    <kbd className="px-2 py-1 bg-gray-700 text-gray-200 text-xs rounded font-mono">?</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-black/10">
                    <div className="flex items-center space-x-2">
                      <Keyboard size={14} />
                      <span className="text-sm">Command palette</span>
                    </div>
                    <kbd className="px-2 py-1 bg-gray-700 text-gray-200 text-xs rounded font-mono">Cmd+K</kbd>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}