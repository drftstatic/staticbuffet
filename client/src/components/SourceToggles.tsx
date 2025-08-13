import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Archive, Rocket, Building, Camera, Sparkles, Film, Tv } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getThemeClasses } from '@/lib/theme-utils';
import { type SearchSource } from '@/lib/types';

const DEFAULT_SOURCES: SearchSource[] = [
  {
    id: 'prelinger',
    name: 'Prelinger Archives',
    collection: 'prelinger',
    enabled: true,
    description: 'Educational films, advertising, industrial videos'
  },
  {
    id: 'fedflix',
    name: 'FedFlix',
    collection: 'fedflix',
    enabled: true,
    description: 'US Government training films and documentaries'
  },
  {
    id: 'nasa',
    name: 'NASA',
    collection: 'nasa',
    enabled: false,
    description: 'Space missions, launches, educational content'
  },
  {
    id: 'loc',
    name: 'Library of Congress',
    collection: 'library_of_congress',
    enabled: false,
    description: 'Historical footage, newsreels, cultural content'
  },
  {
    id: 'wikimedia',
    name: 'Wikimedia Video',
    collection: 'wikimedia',
    enabled: false,
    description: 'Open educational and documentary videos'
  }
];

interface SourceTogglesProps {
  onSourcesChange: () => void;
}

export function SourceToggles({ onSourcesChange }: SourceTogglesProps) {
  const { searchState, setSearchState, brandSkin } = useStore();
  const [sources, setSources] = useState<SearchSource[]>(() => {
    // Initialize sources with state from store or defaults
    const currentSources = searchState.sources || ['prelinger', 'fedflix'];
    return DEFAULT_SOURCES.map(source => ({
      ...source,
      enabled: currentSources.includes(source.id)
    }));
  });

  const theme = getThemeClasses(brandSkin);

  const getSourceIcon = (sourceId: string) => {
    switch (sourceId) {
      case 'nasa':
        return <Rocket size={12} className="animate-pulse" />;
      case 'loc':
        return <Building size={12} />;
      case 'wikimedia':
        return <Camera size={12} />;
      case 'prelinger':
        return <Film size={12} />;
      case 'fedflix':
        return <Tv size={12} />;
      default:
        return <Archive size={12} />;
    }
  };

  const handleSourceToggle = (sourceId: string, checked: boolean) => {
    const updatedSources = sources.map(source =>
      source.id === sourceId ? { ...source, enabled: checked } : source
    );
    setSources(updatedSources);

    const enabledSources = updatedSources
      .filter(source => source.enabled)
      .map(source => source.id);
    
    setSearchState({ sources: enabledSources, page: 1 });
    onSourcesChange();
  };

  const enabledCount = sources.filter(s => s.enabled).length;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border-2 ${
      brandSkin === 'mario' ? 'bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20 border-yellow-400/50 shadow-[0_0_20px_rgba(255,215,0,0.3)]' :
      brandSkin === 'hogan' ? 'bg-gradient-to-r from-red-600/20 to-yellow-500/20 border-yellow-400/50' :
      brandSkin === 'dx' ? 'bg-gradient-to-r from-green-600/20 to-black/40 border-green-500/50' :
      brandSkin === 'waffle' ? 'bg-gradient-to-r from-amber-400/20 to-yellow-300/20 border-amber-400/50' :
      brandSkin === 'ebn' ? 'bg-gradient-to-r from-lime-500/20 to-green-600/20 border-lime-500/50' :
      brandSkin === 'ozzy' ? 'bg-gradient-to-r from-red-900/30 to-purple-900/30 border-red-500/50' :
      brandSkin === 'maxheadroom' ? 'bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border-cyan-400/50 animate-pulse' :
      brandSkin === 'dakota' ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50' :
      brandSkin === 'blondie' ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400/50' :
      'bg-gradient-to-r from-gray-700/30 to-gray-800/30 border-gray-500/50'
    } backdrop-blur-sm transition-all duration-300 hover:scale-105`}>
      
      {/* Sparkle icon for fun */}
      <Sparkles size={14} className={`${
        brandSkin === 'mario' ? 'text-yellow-400 animate-spin' :
        brandSkin === 'maxheadroom' ? 'text-cyan-400 animate-pulse' :
        'text-white/60'
      }`} />
      
      {/* Source checkboxes */}
      <div className="flex items-center gap-3">
        {sources.map((source) => (
          <label
            key={source.id}
            className={`flex items-center gap-1 cursor-pointer group transition-all duration-200 hover:scale-110 ${
              source.enabled ? 'opacity-100' : 'opacity-50'
            }`}
            title={source.description}
          >
            <Checkbox
              id={source.id}
              checked={source.enabled}
              onCheckedChange={(checked) => handleSourceToggle(source.id, !!checked)}
              className={`h-3 w-3 border-2 ${
                source.enabled 
                  ? brandSkin === 'mario' ? 'border-yellow-400 bg-red-500/50' :
                    brandSkin === 'hogan' ? 'border-yellow-400 bg-red-600/50' :
                    brandSkin === 'dx' ? 'border-green-500 bg-green-600/50' :
                    brandSkin === 'maxheadroom' ? 'border-cyan-400 bg-pink-500/50' :
                    'border-white/60 bg-white/20'
                  : 'border-white/30 bg-transparent'
              }`}
              data-testid={`checkbox-source-${source.id}`}
            />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              source.enabled 
                ? brandSkin === 'mario' ? 'text-yellow-300' :
                  brandSkin === 'hogan' ? 'text-yellow-400' :
                  brandSkin === 'dx' ? 'text-green-400' :
                  brandSkin === 'maxheadroom' ? 'text-cyan-300' :
                  brandSkin === 'dakota' ? 'text-purple-300' :
                  brandSkin === 'blondie' ? 'text-amber-300' :
                  'text-white'
                : 'text-white/40'
            } group-hover:text-white transition-colors`}>
              {source.id === 'prelinger' ? 'PRE' :
               source.id === 'fedflix' ? 'FED' :
               source.id === 'nasa' ? 'NASA' :
               source.id === 'loc' ? 'LOC' :
               source.id === 'wikimedia' ? 'WIKI' :
               source.name.slice(0, 3).toUpperCase()}
            </span>
            <span className="group-hover:animate-bounce">
              {getSourceIcon(source.id)}
            </span>
          </label>
        ))}
      </div>
      
      {/* Count badge */}
      <div className={`text-[10px] font-mono px-1 py-0.5 rounded ${
        brandSkin === 'mario' ? 'bg-red-600/50 text-yellow-300' :
        brandSkin === 'hogan' ? 'bg-red-700/50 text-yellow-300' :
        brandSkin === 'dx' ? 'bg-green-700/50 text-green-300' :
        brandSkin === 'maxheadroom' ? 'bg-pink-600/50 text-cyan-300 animate-pulse' :
        'bg-white/10 text-white/80'
      }`}>
        {enabledCount}/5
      </div>
    </div>
  );
}