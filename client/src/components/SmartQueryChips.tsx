import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { type SmartQuery } from '@/lib/types';

const SMART_QUERIES: SmartQuery[] = [
  {
    id: 'psa',
    label: 'PSA',
    query: 'public service announcement safety',
    description: 'Public service announcements and safety films'
  },
  {
    id: 'training',
    label: 'Training',
    query: 'training educational instructional',
    description: 'Educational and training videos'
  },
  {
    id: 'infomercial',
    label: 'Infomercial',
    query: 'infomercial commercial advertising',
    description: 'Vintage commercials and infomercials'
  },
  {
    id: 'newsreel',
    label: 'Newsreel',
    query: 'newsreel news bulletin',
    description: 'Historical newsreels and bulletins'
  },
  {
    id: 'cartoon',
    label: 'Cartoon',
    query: 'cartoon animation animated',
    description: 'Vintage cartoons and animations'
  },
  {
    id: 'safety',
    label: 'Safety',
    query: 'safety industrial workplace',
    description: 'Workplace and industrial safety films'
  },
  {
    id: 'cspan',
    label: 'C-SPAN',
    query: 'c-span government political',
    description: 'Government proceedings and political content'
  }
];

interface SmartQueryChipsProps {
  onQuerySelect: (query: string) => void;
}

export function SmartQueryChips({ onQuerySelect }: SmartQueryChipsProps) {
  const { brandSkin, searchState } = useStore();

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'testcard':
        return {
          chip: 'bg-blue-400/10 text-blue-400 border-blue-400/30 hover:bg-blue-400/20',
          active: 'bg-blue-400/30 text-blue-100'
        };
      case 'waffle':
        return {
          chip: 'bg-yellow-100/50 text-amber-800 border-yellow-400/30 hover:bg-yellow-100/70',
          active: 'bg-yellow-400/50 text-amber-900'
        };
      case 'ebn':
        return {
          chip: 'bg-lime-900/50 text-lime-400 border-lime-500/30 hover:bg-lime-900/70',
          active: 'bg-lime-500/30 text-lime-100'
        };
      case 'ozzy':
        return {
          chip: 'bg-red-900/30 text-red-300 border-red-500/30 hover:bg-red-900/50',
          active: 'bg-red-500/30 text-red-100'
        };
      case 'hogan':
        return {
          chip: 'bg-yellow-900/50 text-yellow-300 border-yellow-400/30 hover:bg-yellow-900/70',
          active: 'bg-yellow-400/30 text-yellow-100'
        };
      case 'dx':
        return {
          chip: 'bg-pink-900/50 text-pink-300 border-pink-500/30 hover:bg-pink-900/70',
          active: 'bg-pink-500/30 text-pink-100'
        };
      case 'maxheadroom':
        return {
          chip: 'bg-green-900/50 text-green-300 border-green-500/30 hover:bg-green-900/70',
          active: 'bg-green-500/30 text-green-100'
        };
      case 'mario':
        return {
          chip: 'bg-red-900/50 text-yellow-300 border-yellow-400/30 hover:bg-red-900/70',
          active: 'bg-yellow-400/30 text-red-900'
        };
      case 'dakota':
        return {
          chip: 'bg-gray-800/50 text-gray-300 border-gray-400/30 hover:bg-gray-800/70',
          active: 'bg-gray-400/30 text-gray-100'
        };
      case 'blondie':
        return {
          chip: 'bg-amber-900/50 text-amber-300 border-amber-400/30 hover:bg-amber-900/70',
          active: 'bg-amber-400/30 text-amber-100'
        };
      default:
        return {
          chip: 'bg-blue-400/10 text-blue-400 border-blue-400/30 hover:bg-blue-400/20',
          active: 'bg-blue-400/30 text-blue-100'
        };
    }
  };

  const theme = getThemeClasses();

  const handleChipClick = (smartQuery: SmartQuery) => {
    onQuerySelect(smartQuery.query);
  };

  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
      <div className="text-xs text-gray-400 mr-1 sm:mr-2 self-center hidden sm:block">Quick Search:</div>
      {SMART_QUERIES.map((smartQuery) => {
        const isActive = searchState.query.includes(smartQuery.query) || 
                        smartQuery.query.split(' ').some(term => 
                          searchState.query.toLowerCase().includes(term.toLowerCase())
                        );
        
        return (
          <Button
            key={smartQuery.id}
            variant="ghost"
            size="sm"
            onClick={() => handleChipClick(smartQuery)}
            className={`px-1.5 py-1 sm:px-2 sm:py-1 text-xs rounded-full border transition-colors ${
              isActive ? theme.active : theme.chip
            }`}
            title={smartQuery.description}
            data-testid={`chip-${smartQuery.id}`}
          >
            <span className="truncate">{smartQuery.label}</span>
          </Button>
        );
      })}
    </div>
  );
}