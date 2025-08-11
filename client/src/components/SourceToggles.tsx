import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Archive, Rocket, Building, Camera } from 'lucide-react';
import { useStore } from '@/lib/store';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [sources, setSources] = useState<SearchSource[]>(() => {
    // Initialize sources with state from store or defaults
    const currentSources = searchState.sources || ['prelinger', 'fedflix'];
    return DEFAULT_SOURCES.map(source => ({
      ...source,
      enabled: currentSources.includes(source.id)
    }));
  });

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'testcard':
        return {
          text: 'text-blue-400',
          bg: 'bg-blue-400/10',
          border: 'border-blue-400/30',
          hover: 'hover:bg-blue-400/20'
        };
      case 'waffle':
        return {
          text: 'text-amber-800',
          bg: 'bg-yellow-100/50',
          border: 'border-yellow-400/30',
          hover: 'hover:bg-yellow-100/70'
        };
      case 'ebn':
        return {
          text: 'text-lime-400',
          bg: 'bg-lime-900/50',
          border: 'border-lime-500/30',
          hover: 'hover:bg-lime-900/70'
        };
      case 'ozzy':
        return {
          text: 'text-red-300',
          bg: 'bg-red-900/30',
          border: 'border-red-500/30',
          hover: 'hover:bg-red-900/50'
        };
      case 'hogan':
        return {
          text: 'text-yellow-300',
          bg: 'bg-yellow-900/50',
          border: 'border-yellow-400/30',
          hover: 'hover:bg-yellow-900/70'
        };
      case 'dx':
        return {
          text: 'text-pink-300',
          bg: 'bg-pink-900/50',
          border: 'border-pink-500/30',
          hover: 'hover:bg-pink-900/70'
        };
      case 'maxheadroom':
        return {
          text: 'text-green-300',
          bg: 'bg-green-900/50',
          border: 'border-green-500/30',
          hover: 'hover:bg-green-900/70'
        };
      case 'mario':
        return {
          text: 'text-yellow-300',
          bg: 'bg-red-900/50',
          border: 'border-yellow-400/30',
          hover: 'hover:bg-red-900/70'
        };
      case 'dakota':
        return {
          text: 'text-gray-300',
          bg: 'bg-gray-800/50',
          border: 'border-gray-400/30',
          hover: 'hover:bg-gray-800/70'
        };
      case 'blondie':
        return {
          text: 'text-amber-300',
          bg: 'bg-amber-900/50',
          border: 'border-amber-400/30',
          hover: 'hover:bg-amber-900/70'
        };
      default:
        return {
          text: 'text-blue-400',
          bg: 'bg-blue-400/10',
          border: 'border-blue-400/30',
          hover: 'hover:bg-blue-400/20'
        };
    }
  };

  const theme = getThemeClasses();

  const getSourceIcon = (sourceId: string) => {
    switch (sourceId) {
      case 'nasa':
        return <Rocket size={14} />;
      case 'loc':
        return <Building size={14} />;
      case 'wikimedia':
        return <Camera size={14} />;
      default:
        return <Archive size={14} />;
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
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center space-x-1 px-2 py-1 text-xs ${theme.text} ${theme.hover} ${theme.border} border rounded`}
        data-testid="button-toggle-sources"
      >
        <Archive size={14} />
        <span>Sources ({enabledCount})</span>
        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </Button>

      {isExpanded && (
        <div className={`absolute z-50 mt-8 p-3 rounded-lg border ${theme.bg} ${theme.border} min-w-64 shadow-lg`}>
          <div className="space-y-3">
            <div className={`text-xs font-medium ${theme.text} mb-2`}>
              Video Sources
            </div>
            {sources.map((source) => (
              <div key={source.id} className="flex items-start space-x-2">
                <Checkbox
                  id={source.id}
                  checked={source.enabled}
                  onCheckedChange={(checked) => handleSourceToggle(source.id, !!checked)}
                  className="mt-0.5"
                  data-testid={`checkbox-source-${source.id}`}
                />
                <div className="flex-1">
                  <Label
                    htmlFor={source.id}
                    className={`text-xs font-medium ${theme.text} flex items-center space-x-1 cursor-pointer`}
                  >
                    {getSourceIcon(source.id)}
                    <span>{source.name}</span>
                  </Label>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {source.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}