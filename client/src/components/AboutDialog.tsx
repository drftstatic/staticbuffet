import { useState } from 'react';
import { ExternalLink, Archive, Zap, Tv, Heart, Bug, Lightbulb } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getThemeClasses } from '@/lib/theme-utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AboutDialogProps {
  children: React.ReactNode;
}

export function AboutDialog({ children }: AboutDialogProps) {
  const { brandSkin } = useStore();
  const themeClasses = getThemeClasses(brandSkin);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={`max-w-2xl ${themeClasses.bg} ${themeClasses.border} max-h-[80vh] overflow-y-auto`}>
        <DialogHeader className="space-y-3">
          <div className="flex items-center space-x-2">
            <Tv className={themeClasses.accent} size={24} />
            <DialogTitle className={`text-2xl font-bold ${themeClasses.text}`}>
              STATIC BUFFET
            </DialogTitle>
          </div>
          <DialogDescription className={`text-lg ${themeClasses.textSecondary}`}>
            Professional VJ Tool for Archive.org Content
          </DialogDescription>
          <div className={`inline-block ${themeClasses.bgSecondary} ${themeClasses.accent} text-sm font-semibold px-3 py-1 rounded-full border ${themeClasses.border}`}>
            Free • Open Source • Public Domain Content
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Features */}
          <div className={`p-4 rounded-lg ${themeClasses.bgSecondary} ${themeClasses.border} border space-y-4`}>
            <div className="flex items-center space-x-3">
              <Archive className={themeClasses.accent} size={20} />
              <h3 className={`font-bold ${themeClasses.text}`}>
                Free Public Domain Content
              </h3>
            </div>
            <p className={`text-sm ${themeClasses.textSecondary} leading-relaxed`}>
              Access Archive.org's massive collection of public domain videos, films, and archival footage. 
              All content is free to use and perfect for live mixing.
            </p>
            
            <div className="flex items-center space-x-3">
              <Zap className={themeClasses.accent} size={20} />
              <h3 className={`font-bold ${themeClasses.text}`}>
                Professional VJ Tools
              </h3>
            </div>
            <p className={`text-sm ${themeClasses.textSecondary} leading-relaxed`}>
              Real-time video effects, seamless transitions, and live mixing capabilities 
              designed for professional performances and creative expression.
            </p>
          </div>

          {/* Credits */}
          <div className={`p-4 rounded-lg ${themeClasses.bgSecondary} ${themeClasses.border} border text-center space-y-2`}>
            <p className={`text-sm ${themeClasses.textSecondary}`}>
              Dreamed up and designed by{' '}
              <a 
                href="https://trashteam.tv" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${themeClasses.accent} hover:underline font-semibold`}
              >
                Trash Team
              </a>
              {' × '}
              <a 
                href="https://nulltone.tv" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${themeClasses.accent} hover:underline font-semibold`}
              >
                NULLTONE.TV
              </a>
            </p>
            <p className={`text-sm ${themeClasses.textSecondary}`}>
              Built by{' '}
              <a 
                href="https://fladrycreative.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${themeClasses.accent} hover:underline font-semibold`}
              >
                Fladry Creative
              </a>
            </p>
          </div>

          {/* Bug Reports & Feature Requests */}
          <div className={`p-4 rounded-lg ${themeClasses.bgSecondary} ${themeClasses.border} border`}>
            <h3 className={`font-bold ${themeClasses.text} text-center mb-3`}>Found a Bug or Have an Idea?</h3>
            <div className="flex justify-center space-x-3">
              <a 
                href="mailto:robb@fladrycreative.com?subject=Static Buffet Bug Report" 
                className={`inline-flex items-center space-x-2 px-3 py-2 rounded border transition-colors text-sm ${themeClasses.border} ${themeClasses.textSecondary} hover:${themeClasses.accent} hover:border-current`}
              >
                <Bug size={16} />
                <span>Report Bug</span>
              </a>
              <a 
                href="https://github.com/trashteam/static-buffet/issues/new?template=feature_request.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center space-x-2 px-3 py-2 rounded border transition-colors text-sm ${themeClasses.border} ${themeClasses.textSecondary} hover:${themeClasses.accent} hover:border-current`}
              >
                <Lightbulb size={16} />
                <span>Request Feature</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Support Section */}
          <div className={`p-4 rounded-lg border-2 ${themeClasses.accent} ${themeClasses.bgSecondary} space-y-3`}>
            <div className="flex items-center space-x-2">
              <Heart className={themeClasses.accent} size={18} />
              <h4 className={`font-bold ${themeClasses.text}`}>
                Feed the Buffet
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.textSecondary} leading-relaxed`}>
              The app is free to use, always. If Static Buffet becomes part of your creative ritual and you want to help keep the signal alive, we're set up to accept your digital blessings. Every contribution helps feed the servers and fuel future features.
            </p>
            <div className="flex justify-center">
              <a 
                href="https://ko-fi.com/staticbuffet" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${themeClasses.accent} ${themeClasses.bg} hover:opacity-90`}
              >
                <Heart size={16} />
                <span>Feed the Buffet</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Legal Notice */}
          <div className={`p-3 rounded border-2 border-dashed ${themeClasses.border} ${themeClasses.bgSecondary}`}>
            <h4 className={`font-semibold mb-2 ${themeClasses.text} text-sm`}>
              Legal & Licensing
            </h4>
            <p className={`text-xs ${themeClasses.textSecondary} leading-relaxed`}>
              Static Buffet works exclusively with Public Domain, CC0, and CC-BY licensed content from Archive.org. 
              All content is free to use for any purpose including commercial applications.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}