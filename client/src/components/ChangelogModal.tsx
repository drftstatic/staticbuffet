import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';
import { useStore } from '@/lib/store';

const CHANGELOG_ENTRIES = [
  {
    version: "6.0",
    date: "August 11, 2025",
    title: "Sexy Mario Plumber Theme & Meme Easter Eggs",
    changes: [
      "Added Sexy Mario Plumber theme with Italian-American charm and Nintendo colors",
      "Mario Water Pipe Effect: Unexpected visual distortion with floating power-ups",
      "Sexy Mario Soundboard: 8 inappropriate-but-funny quotes with Italian accent",
      "Triple-click MA button activates SEXY MARIO MODE with title transformation",
      "Rainbow gradient background with red, blue, gold, and green Mario colors",
      "Coin sparkle effects and power-up animations throughout interface",
      "Seven complete visual themes now available for professional VJ use"
    ]
  },
  {
    version: "5.0",
    date: "August 11, 2025",
    title: "New Wrestling Themes & Easter Eggs",
    changes: [
      "Added D-Generation X theme with authentic WWE attitude-era styling",
      "DX Easter Egg: Triple-click DX button to unlock soundboard with classic quotes",
      "Max Headroom theme with retro-futuristic green matrix aesthetic", 
      "ASCII Mode easter egg for ultimate retro computing experience",
      "Live webcam integration for real-time video mixing",
      "Six complete visual themes now available for VJs"
    ]
  },
  {
    version: "4.0",
    date: "August 11, 2025",
    title: "Expanded Theme System",
    changes: [
      "Heavy Metal theme inspired by Ozzy Osbourne with metallic textures",
      "NWO Hollywood theme with Hulk Hogan wrestling colors and stripes",
      "HULKSTER Easter Egg: Triple-click HH button for soundboard experience",
      "Customizable Workspace Layout Saver with localStorage persistence",
      "Theme-specific visual effects: scanlines, metal textures, wrestling stripes",
      "Complete UI integration across all four themes"
    ]
  },
  {
    version: "3.0",
    date: "August 11, 2025",
    title: "UI Polish & Professional Interface",
    changes: [
      "Converted Emergency Mix and Audio Reactive to icon-only controls",
      "Created GroupedControls component for visual button pairing",
      "Improved header layout efficiency with compact design",
      "Enhanced professional media workstation aesthetic",
      "Updated footer with stylized tech references (FS9000 engine)"
    ]
  },
  {
    version: "2.6",
    date: "August 11, 2025",
    title: "Critical Video Playback Fix",
    changes: [
      "Resolved complete video playback failure blocking all functionality",
      "Implemented server-side video proxy with browser-compatible formats",
      "Added strict MP4/WebM/MOV file filtering",
      "Enhanced error logging with comprehensive debugging",
      "Videos now load and play successfully with proper controls"
    ]
  },
  {
    version: "2.5",
    date: "August 11, 2025",
    title: "Efficient Header & Search Updates",
    changes: [
      "Redesigned header with three-row structure for optimal space usage",
      "Extended search year filters to include 2025",
      "Fixed video streaming with smart quality selection",
      "Improved panel minimization with CSS Grid",
      "Enhanced video file selection from Archive.org"
    ]
  },
  {
    version: "1.0",
    date: "August 10, 2025",
    title: "Professional Media Workstation Launch",
    changes: [
      "Transformed to panel-based layout inspired by Adobe Premiere",
      "Added professional player interface with LIVE indicator and timecode",
      "Timeline-based queue replacing simple list view",
      "Created comprehensive About page with VJ tool explanations",
      "Implemented Waffle House and EBN Hijack visual themes",
      "Added fullscreen mode with keyboard shortcuts and effect presets"
    ]
  }
];

export function ChangelogModal() {
  const { brandSkin } = useStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`inline-flex items-center space-x-2 ${
            brandSkin === 'waffle'
              ? 'text-amber-700 hover:bg-yellow-100/50'
              : brandSkin === 'ebn'
              ? 'text-yellow-300 hover:bg-purple-900/50'
              : brandSkin === 'ozzy'
              ? 'text-red-300 hover:bg-red-900/30'
              : brandSkin === 'dx'
              ? 'text-pink-400 hover:bg-blue-900/50'
              : 'text-green-400 hover:bg-gray-800/50'
          }`}
          data-testid="button-changelog"
        >
          <FileText size={16} />
          <span>Changelog</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className={`max-w-2xl max-h-[80vh] ${
        brandSkin === 'waffle' 
          ? 'bg-yellow-50 border-yellow-400' 
          : brandSkin === 'ebn'
          ? 'bg-purple-950 border-yellow-400'
          : brandSkin === 'ozzy'
          ? 'bg-black border-red-500'
          : brandSkin === 'dx'
          ? 'bg-gray-900 border-pink-500'
          : 'bg-black border-green-500'
      }`}>
        <DialogHeader>
          <DialogTitle className={
            brandSkin === 'waffle' ? 'text-amber-900' : 
            brandSkin === 'ebn' ? 'text-yellow-300' :
            brandSkin === 'ozzy' ? 'text-red-300' :
            brandSkin === 'dx' ? 'text-pink-400' :
            'text-green-400'
          }>
            Static Buffet Changelog
          </DialogTitle>
          <DialogDescription className={
            brandSkin === 'waffle' ? 'text-amber-800' : 
            brandSkin === 'ebn' ? 'text-gray-300' :
            brandSkin === 'ozzy' ? 'text-red-200' :
            brandSkin === 'dx' ? 'text-blue-200' :
            'text-green-200'
          }>
            Recent updates and improvements to your VJ toolkit
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {CHANGELOG_ENTRIES.map((entry, index) => (
              <div key={index} className={`border-l-2 pl-4 ${
                brandSkin === 'waffle' 
                  ? 'border-yellow-400' 
                  : brandSkin === 'ebn'
                  ? 'border-yellow-400'
                  : brandSkin === 'ozzy'
                  ? 'border-red-500'
                  : brandSkin === 'dx'
                  ? 'border-pink-500'
                  : 'border-green-500'
              }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`text-lg font-bold ${
                    brandSkin === 'waffle' ? 'text-amber-900' : 
                    brandSkin === 'ebn' ? 'text-yellow-300' :
                    brandSkin === 'ozzy' ? 'text-red-300' :
                    brandSkin === 'dx' ? 'text-pink-400' :
                    'text-green-400'
                  }`}>
                    v{entry.version}
                  </span>
                  <span className={`text-xs ${
                    brandSkin === 'waffle' ? 'text-amber-600' : 
                    brandSkin === 'ebn' ? 'text-gray-400' :
                    brandSkin === 'ozzy' ? 'text-red-400' :
                    brandSkin === 'dx' ? 'text-blue-300' :
                    'text-green-300'
                  }`}>
                    {entry.date}
                  </span>
                </div>
                
                <h4 className={`font-semibold mb-3 ${
                  brandSkin === 'waffle' ? 'text-amber-800' : 
                  brandSkin === 'ebn' ? 'text-gray-200' :
                  brandSkin === 'ozzy' ? 'text-red-200' :
                  brandSkin === 'dx' ? 'text-blue-200' :
                  'text-green-200'
                }`}>
                  {entry.title}
                </h4>
                
                <ul className="space-y-1">
                  {entry.changes.map((change, changeIndex) => (
                    <li key={changeIndex} className={`text-sm flex items-start space-x-2 ${
                      brandSkin === 'waffle' ? 'text-amber-700' : 
                      brandSkin === 'ebn' ? 'text-gray-300' :
                      brandSkin === 'ozzy' ? 'text-red-200' :
                      brandSkin === 'dx' ? 'text-blue-200' :
                      'text-green-200'
                    }`}>
                      <span className="mt-1 text-xs">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}