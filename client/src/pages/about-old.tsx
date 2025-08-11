import { ArrowLeft, ExternalLink, Heart, Tv, Archive, Zap } from 'lucide-react';
import { Link } from 'wouter';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import DonationCTA from '@/components/DonationCTA';
import { ChangelogModal } from '@/components/ChangelogModal';
import { ThemeExplanations } from '@/components/ThemeExplanations';

export default function About() {
  const { brandSkin, isHulksterMode, isDXMode, isMarioMode, isAsciiMode, isDakotaVanillaMode, isBlondieGeometryMode } = useStore();

  // Theme-specific styling function
  const getThemeStyles = () => {
    switch (brandSkin) {
      case 'testcard':
        return {
          headerBg: 'glass border-blue-400/50',
          cardBg: 'glass-dark',
          titleText: 'text-slate-200',
          bodyText: 'text-gray-300',
          iconColor: '#3B82F6', // blue-500
          accentColor: '#60A5FA', // blue-400
          borderColor: 'border-blue-400/50',
          panelBg: 'bg-gray-800/50 border border-blue-400/30',
          linkStyle: 'border-blue-500/30 bg-gray-800/50 text-blue-400 hover:bg-blue-900/50'
        };
      case 'waffle':
        return {
          headerBg: 'glass border-yellow-400/50',
          cardBg: 'glass',
          titleText: 'text-amber-900',
          bodyText: 'text-amber-800',
          iconColor: '#D97706', // amber-600
          accentColor: '#F59E0B', // amber-500
          borderColor: 'border-yellow-400/30',
          panelBg: 'bg-yellow-50/50 border border-yellow-400/30',
          linkStyle: 'border-yellow-400/50 bg-yellow-50/50 text-amber-800 hover:bg-yellow-100/50'
        };
      case 'ebn':
        return {
          headerBg: 'glass-dark border-lime-500/30',
          cardBg: 'glass-dark',
          titleText: 'text-gray-100',
          bodyText: 'text-gray-300',
          iconColor: '#84CC16', // lime-500
          accentColor: '#A3E635', // lime-400
          borderColor: 'border-lime-500/30',
          panelBg: 'bg-gray-800/50 border border-lime-500/30',
          linkStyle: 'border-lime-500/30 bg-gray-800/50 text-lime-400 hover:bg-gray-700/50'
        };
      case 'ozzy':
        return {
          headerBg: 'glass-ozzy border-red-500/50',
          cardBg: 'glass-ozzy',
          titleText: 'text-red-100',
          bodyText: 'text-red-200',
          iconColor: '#EF4444', // red-500
          accentColor: '#F87171', // red-400
          borderColor: 'border-red-500/50',
          panelBg: 'bg-black/80 border border-red-500/30',
          linkStyle: 'border-red-500/30 bg-red-900/50 text-red-400 hover:bg-red-800/50'
        };
      case 'hogan':
        return {
          headerBg: 'glass-hogan border-yellow-400/50',
          cardBg: 'glass-hogan',
          titleText: 'text-yellow-100',
          bodyText: 'text-yellow-200',
          iconColor: '#EAB308', // yellow-500
          accentColor: '#FACC15', // yellow-400
          borderColor: 'border-yellow-400/50',
          panelBg: 'bg-gray-800/50 border border-yellow-400/30',
          linkStyle: 'border-yellow-500/30 bg-gray-800/50 text-yellow-400 hover:bg-gray-700/50'
        };
      case 'dx':
        return {
          headerBg: 'glass-dark border-pink-500/50',
          cardBg: 'glass-dark',
          titleText: 'text-pink-100',
          bodyText: 'text-pink-200',
          iconColor: '#EC4899', // pink-500
          accentColor: '#F472B6', // pink-400
          borderColor: 'border-pink-500/50',
          panelBg: 'bg-gray-800/50 border border-pink-500/30',
          linkStyle: 'border-pink-500/30 bg-gray-800/50 text-pink-400 hover:bg-pink-900/50'
        };
      case 'maxheadroom':
        return {
          headerBg: 'glass-dark border-green-400/50',
          cardBg: 'glass-dark',
          titleText: 'text-green-100',
          bodyText: 'text-green-200',
          iconColor: '#22C55E', // green-500
          accentColor: '#4ADE80', // green-400
          borderColor: 'border-green-400/50',
          panelBg: 'bg-gray-800/50 border border-green-500/30',
          linkStyle: 'border-green-500/30 bg-gray-800/50 text-green-400 hover:bg-green-900/50'
        };
      case 'mario':
        return {
          headerBg: 'glass-mario border-red-400/50',
          cardBg: 'glass-mario',
          titleText: 'text-yellow-100',
          bodyText: 'text-yellow-200',
          iconColor: '#EF4444', // red-500
          accentColor: '#FACC15', // yellow-400
          borderColor: 'border-red-400/50',
          panelBg: 'bg-red-900/50 border border-yellow-400/30',
          linkStyle: 'border-yellow-500/30 bg-red-900/50 text-yellow-400 hover:bg-red-800/50'
        };
      case 'dakota':
        return {
          headerBg: 'glass border-gray-400/50',
          cardBg: 'glass',
          titleText: 'text-gray-200',
          bodyText: 'text-gray-300',
          iconColor: '#6B7280', // gray-500
          accentColor: '#9CA3AF', // gray-400
          borderColor: 'border-gray-400/50',
          panelBg: 'bg-gray-800/50 border border-gray-400/30',
          linkStyle: 'border-gray-500/30 bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
        };
      case 'blondie':
        return {
          headerBg: 'glass border-amber-400/50',
          cardBg: 'glass',
          titleText: 'text-amber-200',
          bodyText: 'text-amber-300',
          iconColor: '#D97706', // amber-600
          accentColor: '#F59E0B', // amber-500
          borderColor: 'border-amber-400/50',
          panelBg: 'bg-amber-900/50 border border-amber-400/30',
          linkStyle: 'border-amber-500/30 bg-amber-900/50 text-amber-400 hover:bg-amber-800/50'
        };
      default:
        return {
          headerBg: 'glass border-blue-400/50',
          cardBg: 'glass-dark',
          titleText: 'text-slate-200',
          bodyText: 'text-gray-300',
          iconColor: '#3B82F6',
          accentColor: '#60A5FA',
          borderColor: 'border-blue-400/50',
          panelBg: 'bg-gray-800/50 border border-blue-400/30',
          linkStyle: 'border-blue-500/30 bg-gray-800/50 text-blue-400 hover:bg-blue-900/50'
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div className={`min-h-screen transition-all duration-300 relative ${
      brandSkin === 'testcard'
      ? 'testcard-gradient testcard-grid'
      : brandSkin === 'waffle' 
      ? 'waffle-gradient' 
      : brandSkin === 'ebn'
      ? 'ebn-gradient scanlines'
      : brandSkin === 'ozzy'
      ? 'ozzy-gradient metal-texture'
      : brandSkin === 'hogan' && isHulksterMode
      ? 'hogan-gradient nwo-stripes hulkster-mode'
      : brandSkin === 'hogan'
      ? 'hogan-gradient nwo-stripes'
      : brandSkin === 'dx' && isDXMode
      ? 'dx-gradient dx-pulse dx-mode'
      : brandSkin === 'dx'
      ? 'dx-gradient dx-pulse'
      : brandSkin === 'maxheadroom' && isAsciiMode
      ? 'maxheadroom-gradient terminal-flicker ascii-mode'
      : brandSkin === 'maxheadroom'
      ? 'maxheadroom-gradient terminal-flicker'
      : brandSkin === 'mario' && isMarioMode
      ? 'mario-gradient mario-powerup mario-sparkles mario-mode'
      : brandSkin === 'mario'
      ? 'mario-gradient mario-powerup mario-sparkles'
      : brandSkin === 'dakota' && isDakotaVanillaMode
      ? 'brand-dakota dakota-vanilla-filter'
      : brandSkin === 'dakota'
      ? 'brand-dakota'
      : brandSkin === 'blondie' && isBlondieGeometryMode
      ? 'brand-blondie blondie-geometry'
      : brandSkin === 'blondie'
      ? 'brand-blondie'
      : 'testcard-gradient testcard-grid'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${theme.headerBg}`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="flex items-center space-x-2">
              <ArrowLeft size={20} />
              <span>Back to Static Buffet</span>
            </Button>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Tv className={theme.titleText} style={{ color: theme.iconColor }} size={24} />
            <h1 className={`font-black text-xl ${theme.titleText}`}>
              About Static Buffet
            </h1>
          </div>
          <ChangelogModal />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className={`rounded-xl shadow-lg p-8 mb-8 ${theme.cardBg}`}>
          <div className="text-center mb-8">
            <h2 className={`font-black mb-4 text-[30px] ${theme.titleText}`}>
              Trash Team × Nulltone.TV present Static Buffet
            </h2>
            <p className={`text-xl ${theme.bodyText}`}>
              All-you-can-eat video chaos, straight from the public domain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className={`p-6 rounded-lg ${theme.panelBg}`}>
              <div className="flex items-center space-x-3 mb-4">
                <Archive style={{ color: theme.iconColor }} size={24} />
                <h3 className={`text-xl font-bold ${theme.titleText}`}>
                  Why Static Buffet exists
                </h3>
              </div>
              <p className={`${theme.bodyText} leading-relaxed mb-4`}>
                VJs, artists, and media remixers need a faster way to find source material that's actually safe to use. Public domain gems, Creative Commons gold, dusty VHS rips — the good stuff that's been hiding in Archive.org and other forgotten corners.
              </p>
              <p className={`${theme.bodyText} leading-relaxed`}>
                Instead of endless scrolling, Static Buffet lets you search, preview, and queue loops in seconds, with tools for chaotic live mixes and audio-reactive cuts. Whether you're hacking together a last-minute visuals set, building a glitch art piece, or just mainlining strange old training films at 3 AM, Static Buffet is here to feed you.
              </p>
            </div>

            <div className={`p-6 rounded-lg ${theme.panelBg}`}>
              <div className="flex items-center space-x-3 mb-4">
                <Zap style={{ color: theme.accentColor }} size={24} />
                <h3 className={`text-xl font-bold ${theme.titleText}`}>
                  Professional VJ Tools
                </h3>
              </div>
              <p className={`${theme.bodyText} leading-relaxed mb-4`}>
                Static Buffet delivers real-time video mixing, audio-reactive performance, fullscreen playback, keyboard shortcuts for live sets, and a full suite of effects. It's built by A/V performance artists, for the community that keeps the screens glowing.
              </p>
              <p className={`${theme.bodyText} leading-relaxed mb-6`}>
                The app is free to use, always. If Static Buffet becomes part of your creative ritual and you want to help keep the signal alive, we're set up to accept your digital blessings. Every contribution helps feed the servers and fuel future features.
              </p>
              <div className="flex justify-center">
                <DonationCTA />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className={`text-2xl font-bold mb-4 ${theme.titleText}`}>
              Key Features
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Search Archive.org\'s vast public domain collection',
                'Real-time video effects and audio processing',
                'Fullscreen mode with keyboard shortcuts',
                'Queue management with drag & drop',
                'Emergency Mix button for instant content',
                'Audio-reactive video effects',
                'Export playlists with licensing metadata',
                'Seven visual themes with unique soundboards and easter eggs'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: theme.accentColor }} />
                  <span className={theme.bodyText}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <ThemeExplanations />

          <div className="mb-8">
            <h3 className={`text-2xl font-bold mb-6 ${theme.titleText}`}>
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