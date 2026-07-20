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
        {
            return {
                chip: 'bg-lime-900/50 text-lime-400 border-lime-500/30 hover:bg-lime-900/70',
                active: 'bg-lime-500/30 text-lime-100'
            };
        }
    };
    const theme = getThemeClasses();
    const handleChipClick = (smartQuery: SmartQuery) => {
        onQuerySelect(smartQuery.query);
    };
    return (<div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
      <div className="text-xs text-gray-400 mr-1 sm:mr-2 self-center hidden sm:block">Quick Search:</div>
      {SMART_QUERIES.map((smartQuery) => {
            const isActive = searchState.query.includes(smartQuery.query) ||
                smartQuery.query.split(' ').some(term => searchState.query.toLowerCase().includes(term.toLowerCase()));
            return (<Button key={smartQuery.id} variant="ghost" size="sm" onClick={() => handleChipClick(smartQuery)} className={`px-1.5 py-1 sm:px-2 sm:py-1 text-xs rounded-full border transition-colors ${isActive ? theme.active : theme.chip}`} title={smartQuery.description} data-testid={`chip-${smartQuery.id}`}>
            <span className="truncate">{smartQuery.label}</span>
          </Button>);
        })}
    </div>);
}
