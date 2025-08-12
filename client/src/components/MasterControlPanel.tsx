import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
  X
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
  const [activeTab, setActiveTab] = useState<'themes' | 'layout' | 'responsive' | 'help'>('themes');
  
  const { 
    brandSkin, 
    isFloatingMode, 
    setFloatingMode,
    isResizableMode, 
    setResizableMode, 
    resetPanels 
  } = useStore();
  
  const themeClasses = getThemeClasses(brandSkin);

  const tabs = [
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'responsive', label: 'Responsive', icon: Monitor },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ] as const;

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 right-4 z-50 ${themeClasses.accent} hover:bg-white/10`}
        data-testid="button-open-master-control"
      >
        <Settings size={16} />
      </Button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`${themeClasses.panelBg} ${themeClasses.border} rounded-lg shadow-2xl backdrop-blur-sm w-96 max-h-[80vh] overflow-hidden`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${themeClasses.border}`}>
          <h3 className={`font-semibold ${themeClasses.text}`}>Control Panel</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className={`h-6 w-6 p-0 ${themeClasses.accent}`}
            data-testid="button-close-master-control"
          >
            <X size={12} />
          </Button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${themeClasses.border}`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? `${themeClasses.accent} bg-white/10`
                    : `${themeClasses.textSecondary} hover:bg-white/5`
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {activeTab === 'themes' && (
            <div className="space-y-4">
              <div>
                <h4 className={`font-medium mb-3 ${themeClasses.text}`}>Visual Themes</h4>
                <ThemeSelector />
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="space-y-4">
              <div>
                <h4 className={`font-medium mb-3 ${themeClasses.text}`}>Window Management</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={isFloatingMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFloatingMode(!isFloatingMode)}
                    className="flex items-center space-x-2"
                    data-testid="button-toggle-floating-mode"
                  >
                    <Move size={14} />
                    <span>Float</span>
                  </Button>
                  
                  <Button
                    variant={isResizableMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setResizableMode(!isResizableMode)}
                    className="flex items-center space-x-2"
                    data-testid="button-toggle-resizable-mode"
                  >
                    <Maximize2 size={14} />
                    <span>Resize</span>
                  </Button>
                </div>
              </div>

              <div>
                <h4 className={`font-medium mb-3 ${themeClasses.text}`}>Quick Actions</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetPanels}
                  className="w-full flex items-center space-x-2"
                  data-testid="button-reset-panels"
                >
                  <Tv size={14} />
                  <span>Reset Layout</span>
                </Button>
              </div>

              <div>
                <h4 className={`font-medium mb-3 ${themeClasses.text}`}>Workspace Layouts</h4>
                <LayoutControls />
              </div>
            </div>
          )}

          {activeTab === 'responsive' && (
            <div className="space-y-4">
              <div>
                <h4 className={`font-medium mb-3 ${themeClasses.text}`}>Responsive Preview</h4>
                <p className={`text-sm mb-4 ${themeClasses.textSecondary}`}>
                  See how the interface adapts to different screen sizes
                </p>
                <ResponsiveLayoutHints />
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-4">
              <div>
                <h4 className={`font-medium mb-3 ${themeClasses.text}`}>Getting Started</h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Trigger welcome modal
                      (window as any).showStaticBuffetWelcome?.();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-2"
                    data-testid="button-show-welcome"
                  >
                    <Info size={14} />
                    <span>Welcome Guide</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onShowTour?.();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-2"
                    data-testid="button-show-tour"
                  >
                    <HelpCircle size={14} />
                    <span>Take Tour</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onShowAbout?.();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-2"
                    data-testid="button-show-about"
                  >
                    <Info size={14} />
                    <span>About Static Buffet</span>
                  </Button>
                </div>
              </div>

              <div>
                <h4 className={`font-medium mb-3 ${themeClasses.text}`}>Keyboard Shortcuts</h4>
                <div className={`text-sm space-y-1 ${themeClasses.textSecondary}`}>
                  <div className="flex justify-between">
                    <span>Toggle themes</span>
                    <kbd className="px-1 py-0.5 bg-gray-700 text-gray-200 text-xs rounded">Triple-click</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Effects 1-8</span>
                    <kbd className="px-1 py-0.5 bg-gray-700 text-gray-200 text-xs rounded">1-8</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Help overlay</span>
                    <kbd className="px-1 py-0.5 bg-gray-700 text-gray-200 text-xs rounded">?</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Quick palette</span>
                    <kbd className="px-1 py-0.5 bg-gray-700 text-gray-200 text-xs rounded">Cmd+K</kbd>
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