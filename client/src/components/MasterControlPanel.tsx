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
      <div className={`${themeClasses.panelBg} ${themeClasses.border} rounded-xl shadow-2xl backdrop-blur-md w-[380px] max-h-[85vh] overflow-hidden border-2 bg-black/80`} style={{ borderColor: `var(--${brandSkin}-accent)` }}>
        {/* Compact Header */}
        <div className={`flex items-center justify-between p-3 border-b-2 ${themeClasses.border}`} style={{ borderColor: `var(--${brandSkin}-accent)` }}>
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-md bg-white/10`} style={{ backgroundColor: `var(--${brandSkin}-accent)`, opacity: 0.3 }}>
              <Settings size={14} style={{ color: `var(--${brandSkin}-accent)` }} />
            </div>
            <div>
              <h3 className={`font-semibold text-base ${themeClasses.text}`}>Master Control</h3>
              <p className={`text-[10px] ${themeClasses.textSecondary}`}>Static Buffet v0.7.2</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className={`h-7 w-7 p-0 hover:bg-red-500/20 transition-colors rounded-md`}
            data-testid="button-close-master-control"
          >
            <X size={14} className="text-red-400" />
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
                className={`flex-1 flex flex-col items-center justify-center py-3 px-2 text-xs font-medium transition-all duration-200 relative ${
                  isActive
                    ? `${themeClasses.accent} bg-white/10 shadow-sm`
                    : `${themeClasses.textSecondary} hover:bg-white/5`
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <div className="flex items-center space-x-1">
                  <Icon size={14} />
                  {tab.badge && (
                    <span className="text-[10px]">{tab.badge}</span>
                  )}
                </div>
                <span className="text-[11px] mt-0.5">{tab.label}</span>
                <span className="text-[9px] opacity-60">{tab.description}</span>
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

        {/* Compact Content */}
        <div className="p-4 max-h-[500px] overflow-y-auto space-y-4">
          {activeTab === 'visual' && (
            <div className="space-y-4">
              {/* Theme Section */}
              <div className={`p-3 rounded-lg border bg-white/5`} style={{ borderColor: `var(--${brandSkin}-accent)` }}>
                <div className="flex items-center space-x-2 mb-3">
                  <Palette size={16} style={{ color: `var(--${brandSkin}-accent)` }} />
                  <h4 className={`font-medium text-sm ${themeClasses.text}`}>Visual Themes</h4>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                    {brandSkin === 'testcard' ? 'Default' : 'Custom'}
                  </Badge>
                </div>
                <p className={`text-xs mb-3 ${themeClasses.textSecondary}`}>
                  Choose from 10 unique VJ-inspired visual themes
                </p>
                <ThemeSelector />
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="space-y-4">
              {/* Layout Modes */}
              <div className={`p-3 rounded-lg border bg-white/5`} style={{ borderColor: `var(--${brandSkin}-accent)` }}>
                <div className="flex items-center space-x-2 mb-3">
                  <Layout size={16} style={{ color: `var(--${brandSkin}-accent)` }} />
                  <h4 className={`font-medium text-sm ${themeClasses.text}`}>Panel Layout</h4>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                    {isFloatingMode ? 'Floating' : isResizableMode ? 'Resizable' : 'Grid'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={isFloatingMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFloatingMode(!isFloatingMode)}
                    className="flex flex-col items-center py-2 space-y-0.5 h-auto"
                    data-testid="button-toggle-floating-mode"
                  >
                    <Move size={14} />
                    <span className="text-[11px]">Floating</span>
                    <span className="text-[9px] opacity-60">Independent</span>
                  </Button>
                  
                  <Button
                    variant={isResizableMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setResizableMode(!isResizableMode)}
                    className="flex flex-col items-center py-2 space-y-0.5 h-auto"
                    data-testid="button-toggle-resizable-mode"
                  >
                    <Maximize2 size={14} />
                    <span className="text-[11px]">Resizable</span>
                    <span className="text-[9px] opacity-60">Adjustable</span>
                  </Button>
                </div>
              </div>

              {/* Quick Actions & Layouts Combined */}
              <div className={`p-3 rounded-lg border bg-white/5`} style={{ borderColor: `var(--${brandSkin}-accent)` }}>
                <div className="flex items-center space-x-2 mb-3">
                  <RotateCcw size={16} style={{ color: `var(--${brandSkin}-accent)` }} />
                  <h4 className={`font-medium text-sm ${themeClasses.text}`}>Quick Actions</h4>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetPanels}
                    className="w-full flex items-center justify-between py-2 h-auto"
                    data-testid="button-reset-panels"
                  >
                    <div className="flex items-center space-x-2">
                      <Tv size={14} />
                      <span className="text-xs">Reset Layout</span>
                    </div>
                    <span className="text-[10px] opacity-60">Defaults</span>
                  </Button>
                </div>
                
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center space-x-2 mb-2">
                    <Layers size={14} style={{ color: `var(--${brandSkin}-accent)` }} />
                    <span className={`font-medium text-xs ${themeClasses.text}`}>Saved Layouts</span>
                  </div>
                  <LayoutControls />
                </div>
              </div>

              {/* Compact Responsive Preview */}
              <div className={`p-3 rounded-lg border bg-white/5`} style={{ borderColor: `var(--${brandSkin}-accent)` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Monitor size={14} style={{ color: `var(--${brandSkin}-accent)` }} />
                    <h4 className={`font-medium text-xs ${themeClasses.text}`}>Layout Preview</h4>
                  </div>
                  <Badge variant="secondary" className="text-[9px] px-1 py-0.5">Demo</Badge>
                </div>
                
                {/* Compact breakpoint preview */}
                <div className="grid grid-cols-3 gap-1 mb-2">
                  <div className="flex flex-col items-center p-2 rounded bg-black/20">
                    <Monitor size={12} className="mb-1" />
                    <span className="text-[9px]">Desktop</span>
                    <span className="text-[8px] opacity-60">1024px+</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded bg-black/20">
                    <Tablet size={12} className="mb-1" />
                    <span className="text-[9px]">Tablet</span>
                    <span className="text-[8px] opacity-60">768px+</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded bg-black/20">
                    <Smartphone size={12} className="mb-1" />
                    <span className="text-[9px]">Mobile</span>
                    <span className="text-[8px] opacity-60">375px+</span>
                  </div>
                </div>
                
                <p className={`text-[10px] ${themeClasses.textSecondary} text-center`}>
                  Interface adapts automatically to screen size
                </p>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-4">
              {/* Getting Started */}
              <div className={`p-3 rounded-lg border bg-white/5`} style={{ borderColor: `var(--${brandSkin}-accent)` }}>
                <div className="flex items-center space-x-2 mb-3">
                  <BookOpen size={16} style={{ color: `var(--${brandSkin}-accent)` }} />
                  <h4 className={`font-medium text-sm ${themeClasses.text}`}>Getting Started</h4>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">Guides</Badge>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Trigger welcome modal
                      (window as any).showStaticBuffetWelcome?.();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between py-2 h-auto"
                    data-testid="button-show-welcome"
                  >
                    <div className="flex items-center space-x-2">
                      <Info size={14} />
                      <span className="text-xs">Welcome Guide</span>
                    </div>
                    <span className="text-[10px] opacity-60">Intro</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onShowTour?.();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between py-2 h-auto"
                    data-testid="button-show-tour"
                  >
                    <div className="flex items-center space-x-2">
                      <Video size={14} />
                      <span className="text-xs">Interactive Tour</span>
                    </div>
                    <span className="text-[10px] opacity-60">4 steps</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onShowAbout?.();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between py-2 h-auto"
                    data-testid="button-show-about"
                  >
                    <div className="flex items-center space-x-2">
                      <Info size={14} />
                      <span className="text-xs">About Static Buffet</span>
                    </div>
                    <span className="text-[10px] opacity-60">v0.7.2</span>
                  </Button>
                </div>
              </div>

              {/* Compact Keyboard Shortcuts */}
              <div className={`p-3 rounded-lg border bg-white/5`} style={{ borderColor: `var(--${brandSkin}-accent)` }}>
                <div className="flex items-center space-x-2 mb-3">
                  <Keyboard size={16} style={{ color: `var(--${brandSkin}-accent)` }} />
                  <h4 className={`font-medium text-sm ${themeClasses.text}`}>Keyboard Shortcuts</h4>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">Hotkeys</Badge>
                </div>
                <div className={`space-y-1.5 ${themeClasses.textSecondary}`}>
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/20">
                    <div className="flex items-center space-x-1.5">
                      <Zap size={12} />
                      <span className="text-[11px]">Effects 1-8</span>
                    </div>
                    <kbd className="px-1.5 py-0.5 bg-gray-700 text-gray-200 text-[10px] rounded font-mono">1-8</kbd>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/20">
                    <div className="flex items-center space-x-1.5">
                      <Palette size={12} />
                      <span className="text-[11px]">Theme easter eggs</span>
                    </div>
                    <kbd className="px-1.5 py-0.5 bg-gray-700 text-gray-200 text-[10px] rounded font-mono">Triple-click</kbd>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/20">
                    <div className="flex items-center space-x-1.5">
                      <HelpCircle size={12} />
                      <span className="text-[11px]">Help overlay</span>
                    </div>
                    <kbd className="px-1.5 py-0.5 bg-gray-700 text-gray-200 text-[10px] rounded font-mono">?</kbd>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-black/20">
                    <div className="flex items-center space-x-1.5">
                      <Keyboard size={12} />
                      <span className="text-[11px]">Command palette</span>
                    </div>
                    <kbd className="px-1.5 py-0.5 bg-gray-700 text-gray-200 text-[10px] rounded font-mono">Cmd+K</kbd>
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