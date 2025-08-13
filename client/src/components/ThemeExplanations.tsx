import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useStore } from '@/lib/store';

const THEME_EXPLANATIONS = [
  {
    id: 'waffle',
    icon: '🧇',
    name: 'Waffle House',
    description: 'Inspired by the Waffle House menu, the unofficial after-gig hangout for every VJ. Cozy diner colors, laminated-menu vibes, late-night comfort food aesthetic.',
    features: ['Warm yellows and ambers', 'Southern comfort theme', 'Classic diner aesthetic']
  },
  {
    id: 'ebn',
    icon: '📺',
    name: 'EBN Hijack',
    description: 'A nod to the pioneers at Emergency Broadcast Network. Tactical overlays, neon alerts, hacked-broadcast energy with animated scanlines.',
    features: ['Lime green and purple cyberpunk colors', 'Animated scanline effects', 'Video art glitch aesthetic']
  },
  {
    id: 'ozzy',
    icon: '🦇',
    name: 'Heavy Metal',
    description: 'A tribute to Ozzy Osbourne and the heavy metal aesthetic. Dark metallic textures, blood-red accents, and industrial brutality for the headbanging VJ.',
    features: ['Dark metallics with red accents', 'Diagonal metal texture patterns', 'Heavy metal aesthetic']
  },
  {
    id: 'hogan',
    icon: '💪',
    name: 'NWO Hollywood',
    description: 'Channel the Hollywood Hogan era with NWO red, black, and gold. Wrestling stripes and attitude-era energy.',
    features: ['Red wrestling stripes with golden pulsing effects', 'NWO black and white styling', 'Wrestling attitude era aesthetic']
  },
  {
    id: 'dx',
    icon: '🤘',
    name: 'D-Generation X',
    description: 'WWE attitude-era styling with blue and pink gradients. Rebellious energy from the legendary DX faction.',
    features: ['Green and black wrestling colors', 'Pulsing border effects in DX Mode', 'Attitude era rebellion styling']
  },
  {
    id: 'maxheadroom',
    icon: '📺',
    name: 'Max Headroom',
    description: 'Retro-futuristic green matrix aesthetic with cyberpunk elements. Digital prophet from the edge of tomorrow.',
    features: ['Orange and yellow digital colors', 'Screen flicker effects and terminal aesthetics', '80s TV digital character styling']
  },
  {
    id: 'mario',
    icon: '🍄',
    name: 'Sexy Mario Plumber',
    description: 'Meme-inspired theme with Italian-American charm and Nintendo colors. Inappropriate-but-funny plumber humor.',
    features: ['Rainbow Mario colors with coin sparkle effects', 'Nintendo-inspired visual styling', 'Classic video game aesthetic']
  }
];

export function ThemeExplanations() {
  const { brandSkin } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <h3 className={`text-2xl font-bold ${
            brandSkin === 'waffle' ? 'text-amber-900' : 
            brandSkin === 'ebn' ? 'text-gray-100' :
            brandSkin === 'ozzy' ? 'text-red-300' :
            brandSkin === 'hogan' ? 'text-yellow-300' :
            brandSkin === 'dx' ? 'text-pink-300' :
            brandSkin === 'maxheadroom' ? 'text-green-300' :
            brandSkin === 'mario' ? 'text-red-300' :
            'text-yellow-300'
          }`}>
            Visual Themes ({THEME_EXPLANATIONS.length} Total)
          </h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className={`p-2 ${
              brandSkin === 'waffle' ? 'text-amber-800 hover:bg-yellow-100/50' : 
              brandSkin === 'ebn' ? 'text-gray-100 hover:bg-purple-900/50' :
              brandSkin === 'ozzy' ? 'text-red-300 hover:bg-red-900/30' :
              brandSkin === 'hogan' ? 'text-yellow-300 hover:bg-red-800/30' :
              brandSkin === 'dx' ? 'text-pink-300 hover:bg-blue-900/30' :
              brandSkin === 'maxheadroom' ? 'text-green-300 hover:bg-gray-800/50' :
              brandSkin === 'mario' ? 'text-red-300 hover:bg-red-900/30' :
              'text-yellow-300 hover:bg-gray-800/50'
            }`}>
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mt-6">
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {THEME_EXPLANATIONS.map((theme) => (
              <div key={theme.id} className={`p-6 rounded-lg transition-all duration-200 ${
                brandSkin === theme.id
                  ? brandSkin === 'waffle' 
                    ? 'bg-yellow-100/70 border-2 border-yellow-400/70 shadow-lg' 
                    : brandSkin === 'ebn'
                    ? 'bg-purple-900/50 border-2 border-lime-500/70 shadow-lg'
                    : brandSkin === 'ozzy'
                    ? 'bg-red-950/50 border-2 border-red-500/70 shadow-lg'
                    : brandSkin === 'hogan'
                    ? 'bg-red-900/30 border-2 border-yellow-400/70 shadow-lg'
                    : brandSkin === 'dx'
                    ? 'bg-blue-900/30 border-2 border-pink-400/70 shadow-lg'
                    : brandSkin === 'maxheadroom'
                    ? 'bg-gray-900/50 border-2 border-green-400/70 shadow-lg'
                    : brandSkin === 'mario'
                    ? 'bg-red-900/30 border-2 border-yellow-400/70 shadow-lg'
                    : 'bg-gray-800/50 border-2 border-yellow-400/70 shadow-lg'
                  : brandSkin === 'waffle' 
                    ? 'bg-yellow-50/50 border border-yellow-400/30' 
                    : brandSkin === 'ebn'
                    ? 'bg-gray-800/50 border border-lime-500/30'
                    : brandSkin === 'ozzy'
                    ? 'bg-red-950/30 border border-red-500/30'
                    : brandSkin === 'hogan'
                    ? 'bg-red-950/20 border border-yellow-400/30'
                    : brandSkin === 'dx'
                    ? 'bg-gray-800/50 border border-pink-400/30'
                    : brandSkin === 'maxheadroom'
                    ? 'bg-gray-800/50 border border-green-400/30'
                    : brandSkin === 'mario'
                    ? 'bg-red-950/20 border border-red-400/30'
                    : 'bg-gray-800/50 border border-yellow-400/30'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{theme.icon}</span>
                  <h4 className={`text-lg font-bold ${
                    brandSkin === 'waffle' ? 'text-amber-900' : 
                    brandSkin === 'ebn' ? 'text-gray-100' :
                    brandSkin === 'ozzy' ? 'text-red-300' :
                    brandSkin === 'hogan' ? 'text-yellow-300' :
                    brandSkin === 'dx' ? 'text-pink-300' :
                    brandSkin === 'maxheadroom' ? 'text-green-300' :
                    brandSkin === 'mario' ? 'text-red-300' :
                    'text-yellow-300'
                  }`}>
                    {theme.name}
                    {brandSkin === theme.id && <span className="ml-2 text-sm opacity-75">(Active)</span>}
                  </h4>
                </div>
                
                <p className={`${
                  brandSkin === 'waffle' ? 'text-amber-800' : 
                  brandSkin === 'ebn' ? 'text-gray-300' :
                  brandSkin === 'ozzy' ? 'text-red-200' :
                  brandSkin === 'hogan' ? 'text-yellow-200' :
                  brandSkin === 'dx' ? 'text-pink-200' :
                  brandSkin === 'maxheadroom' ? 'text-green-200' :
                  brandSkin === 'mario' ? 'text-red-200' :
                  'text-yellow-200'
                } leading-relaxed mb-4`}>
                  {theme.description}
                </p>
                
                <div className="space-y-2">
                  {theme.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        brandSkin === 'waffle' ? 'bg-amber-600' : 
                        brandSkin === 'ebn' ? 'bg-lime-400' :
                        brandSkin === 'ozzy' ? 'bg-red-400' :
                        brandSkin === 'hogan' ? 'bg-yellow-400' :
                        brandSkin === 'dx' ? 'bg-pink-400' :
                        brandSkin === 'maxheadroom' ? 'bg-green-400' :
                        brandSkin === 'mario' ? 'bg-red-400' :
                        'bg-yellow-400'
                      }`} />
                      <span className={`text-sm ${
                        brandSkin === 'waffle' ? 'text-amber-700' : 
                        brandSkin === 'ebn' ? 'text-gray-400' :
                        brandSkin === 'ozzy' ? 'text-red-300' :
                        brandSkin === 'hogan' ? 'text-yellow-300' :
                        brandSkin === 'dx' ? 'text-pink-300' :
                        brandSkin === 'maxheadroom' ? 'text-green-300' :
                        brandSkin === 'mario' ? 'text-red-300' :
                        'text-yellow-300'
                      }`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}