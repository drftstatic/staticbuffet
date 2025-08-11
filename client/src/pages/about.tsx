import { ArrowLeft, ExternalLink, Heart, Tv, Archive, Zap } from 'lucide-react';
import { Link } from 'wouter';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function About() {
  const { brandSkin } = useStore();

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      brandSkin === 'waffle' ? 'waffle-gradient' : 'ebn-gradient'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        brandSkin === 'waffle' 
          ? 'glass border-yellow-400/50' 
          : 'glass-dark border-lime-500/30'
      }`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft size={20} />
              <span>Back to Static Buffet</span>
            </Button>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Tv className={brandSkin === 'waffle' ? 'text-amber-600' : 'text-lime-500'} size={24} />
            <h1 className={`font-black text-xl ${
              brandSkin === 'waffle' ? 'text-amber-900' : 'text-gray-100'
            }`}>
              About Static Buffet
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className={`rounded-xl shadow-lg p-8 mb-8 ${
          brandSkin === 'waffle' ? 'glass' : 'glass-dark'
        }`}>
          <div className="text-center mb-8">
            <h2 className={`text-4xl font-black mb-4 ${
              brandSkin === 'waffle' ? 'text-amber-900' : 'text-gray-100'
            }`}>
              Trash Team × Nulltone.TV present Static Buffet
            </h2>
            <p className={`text-xl ${
              brandSkin === 'waffle' ? 'text-amber-800' : 'text-gray-300'
            }`}>
              All-you-can-eat video chaos, straight from the public domain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className={`p-6 rounded-lg ${
              brandSkin === 'waffle' 
                ? 'bg-yellow-50/50 border border-yellow-400/30' 
                : 'bg-gray-800/50 border border-lime-500/30'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <Archive className={brandSkin === 'waffle' ? 'text-amber-600' : 'text-lime-500'} size={24} />
                <h3 className={`text-xl font-bold ${
                  brandSkin === 'waffle' ? 'text-amber-900' : 'text-gray-100'
                }`}>
                  Why Static Buffet exists
                </h3>
              </div>
              <p className={`${
                brandSkin === 'waffle' ? 'text-amber-800' : 'text-gray-300'
              } leading-relaxed mb-4`}>
                VJs, artists, and media remixers need a faster way to find source material that's actually safe to use. Public domain gems, Creative Commons gold, dusty VHS rips — the good stuff that's been hiding in Archive.org and other forgotten corners.
              </p>
              <p className={`${
                brandSkin === 'waffle' ? 'text-amber-800' : 'text-gray-300'
              } leading-relaxed`}>
                Instead of endless scrolling, Static Buffet lets you search, preview, and queue loops in seconds, with tools for chaotic live mixes and audio-reactive cuts. Whether you're hacking together a last-minute visuals set, building a glitch art piece, or just mainlining strange old training films at 3 AM, Static Buffet is here to feed you.
              </p>
            </div>

            <div className={`p-6 rounded-lg ${
              brandSkin === 'waffle' 
                ? 'bg-yellow-50/50 border border-yellow-400/30' 
                : 'bg-gray-800/50 border border-lime-500/30'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <Zap className={brandSkin === 'waffle' ? 'text-amber-600' : 'text-lime-500'} size={24} />
                <h3 className={`text-xl font-bold ${
                  brandSkin === 'waffle' ? 'text-amber-900' : 'text-gray-100'
                }`}>
                  Professional VJ Tools
                </h3>
              </div>
              <p className={`${
                brandSkin === 'waffle' ? 'text-amber-800' : 'text-gray-300'
              } leading-relaxed`}>
                Features real-time video mixing, audio-reactive capabilities, fullscreen performance mode, keyboard shortcuts for live use, and comprehensive effects processing. Built by VJs, for VJs.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className={`text-2xl font-bold mb-4 ${
              brandSkin === 'waffle' ? 'text-amber-900' : 'text-gray-100'
            }`}>
              Key Features
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Search Archive.org\'s vast public domain collection',
                'Real-time video effects and audio processing',
                'Fullscreen mode with keyboard shortcuts',
                'Queue management with drag & drop',
                'Emergency Mix for instant content',
                'Audio-reactive video effects',
                'Export playlists with licensing metadata',
                'Dual themes: Waffle House & EBN Hijack modes'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    brandSkin === 'waffle' ? 'bg-amber-600' : 'bg-lime-500'
                  }`} />
                  <span className={brandSkin === 'waffle' ? 'text-amber-800' : 'text-gray-300'}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className={`text-2xl font-bold mb-6 ${
              brandSkin === 'waffle' ? 'text-amber-900' : 'text-gray-100'
            }`}>
              About the Creators
            </h3>
            
            <div className={`p-6 rounded-lg mb-6 ${
              brandSkin === 'waffle' 
                ? 'bg-yellow-50/50 border border-yellow-400/30' 
                : 'bg-gray-800/50 border border-lime-500/30'
            }`}>
              <h4 className={`text-lg font-bold mb-3 ${
                brandSkin === 'waffle' ? 'text-amber-900' : 'text-gray-100'
              }`}>
                Trash Team
              </h4>
              <p className={`${
                brandSkin === 'waffle' ? 'text-amber-800' : 'text-gray-300'
              } leading-relaxed`}>
                Trash Team is an audio/visual collaboration dedicated to turning discarded culture into something worth watching again. We dig in the bins, crack open dusty archives, and rewire forgotten media until it makes you feel something weird and new.
              </p>
            </div>

            <div className={`p-6 rounded-lg mb-6 ${
              brandSkin === 'waffle' 
                ? 'bg-yellow-50/50 border border-yellow-400/30' 
                : 'bg-gray-800/50 border border-lime-500/30'
            }`}>
              <h4 className={`text-lg font-bold mb-3 ${
                brandSkin === 'waffle' ? 'text-amber-900' : 'text-gray-100'
              }`}>
                Nulltone.TV
              </h4>
              <p className={`${
                brandSkin === 'waffle' ? 'text-amber-800' : 'text-gray-300'
              } leading-relaxed`}>
                Nulltone.TV is the broadcast arm of the resistance — a streaming experiment for alternative programming, glitch aesthetics, and strange transmissions that don't fit anywhere else. It's a place for signal-jammers, dreamers, and anyone who thinks "technical difficulties" should last forever.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a 
                href="https://trashteam.tv" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  brandSkin === 'waffle'
                    ? 'border-yellow-400/50 bg-yellow-50/50 text-amber-800 hover:bg-yellow-100/50'
                    : 'border-lime-500/30 bg-gray-800/50 text-lime-400 hover:bg-gray-700/50'
                }`}
              >
                <span>Visit Trash Team</span>
                <ExternalLink size={16} />
              </a>
              <a 
                href="https://nulltone.tv" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  brandSkin === 'waffle'
                    ? 'border-yellow-400/50 bg-yellow-50/50 text-amber-800 hover:bg-yellow-100/50'
                    : 'border-lime-500/30 bg-gray-800/50 text-lime-400 hover:bg-gray-700/50'
                }`}
              >
                <span>Visit Nulltone.TV</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          <div className="mb-8">
            <div className={`p-6 rounded-lg ${
              brandSkin === 'waffle' 
                ? 'bg-yellow-50/50 border border-yellow-400/30' 
                : 'bg-gray-800/50 border border-lime-500/30'
            }`}>
              <h4 className={`text-lg font-bold mb-3 ${
                brandSkin === 'waffle' ? 'text-amber-900' : 'text-gray-100'
              }`}>
                Built by Fladry Creative
              </h4>
              <p className={`${
                brandSkin === 'waffle' ? 'text-amber-800' : 'text-gray-300'
              } leading-relaxed mb-3`}>
                Static Buffet was designed and developed by Fladry Creative, bringing together technical expertise and creative vision to build tools for the underground media community.
              </p>
              <a 
                href="https://fladrycreative.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  brandSkin === 'waffle'
                    ? 'border-yellow-400/50 bg-yellow-50/50 text-amber-800 hover:bg-yellow-100/50'
                    : 'border-lime-500/30 bg-gray-800/50 text-lime-400 hover:bg-gray-700/50'
                }`}
              >
                <span>Visit Fladry Creative</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          <div className={`p-6 rounded-lg border-2 border-dashed ${
            brandSkin === 'waffle' 
              ? 'border-yellow-400/50 bg-yellow-50/30' 
              : 'border-lime-500/30 bg-gray-800/30'
          }`}>
            <h4 className={`text-lg font-bold mb-2 ${
              brandSkin === 'waffle' ? 'text-amber-900' : 'text-gray-100'
            }`}>
              Legal & Licensing
            </h4>
            <p className={`text-sm ${
              brandSkin === 'waffle' ? 'text-amber-700' : 'text-gray-300'
            } leading-relaxed`}>
              Static Buffet exclusively works with Public Domain, CC0, and CC-BY licensed content from Archive.org. 
              All content is properly attributed and licensing information is preserved in exports. 
              We respect creators' rights and make it easy to use content legally and ethically.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}