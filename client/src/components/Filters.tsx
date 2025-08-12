import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useStore } from '@/lib/store';

interface FiltersProps {
  onFiltersChange: () => void;
}

export function Filters({ onFiltersChange }: FiltersProps) {
  const { searchState, setSearchState } = useStore();

  const handleFilterChange = (key: string, value: string) => {
    setSearchState({ [key]: value, page: 1 });
    onFiltersChange();
  };

  return (
    <div className="mt-3 flex items-center space-x-4 text-sm">
      <div className="flex items-center space-x-2">
        <Label className="text-gray-600 dark:text-gray-400 font-inter">Year:</Label>
        <Select 
          value={searchState.yearFrom || '1950'} 
          onValueChange={(value) => handleFilterChange('yearFrom', value)}
        >
          <SelectTrigger 
            className="w-20 px-2 py-1 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            data-testid="select-year-from"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1900">1900</SelectItem>
            <SelectItem value="1920">1920</SelectItem>
            <SelectItem value="1940">1940</SelectItem>
            <SelectItem value="1950">1950</SelectItem>
            <SelectItem value="1960">1960</SelectItem>
            <SelectItem value="1970">1970</SelectItem>
            <SelectItem value="1980">1980</SelectItem>
            <SelectItem value="1990">1990</SelectItem>
            <SelectItem value="2000">2000</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-gray-600 dark:text-gray-400">to</span>
        <Select 
          value={searchState.yearTo || '2025'} 
          onValueChange={(value) => handleFilterChange('yearTo', value)}
        >
          <SelectTrigger 
            className="w-20 px-2 py-1 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            data-testid="select-year-to"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2000">2000</SelectItem>
            <SelectItem value="2010">2010</SelectItem>
            <SelectItem value="2020">2020</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Label className="text-gray-600 dark:text-gray-400 font-inter">Duration:</Label>
        <Select 
          value={searchState.duration || 'any'} 
          onValueChange={(value) => handleFilterChange('duration', value)}
        >
          <SelectTrigger 
            className="w-24 px-2 py-1 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            data-testid="select-duration"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="short">&lt; 5 min</SelectItem>
            <SelectItem value="medium">5-30 min</SelectItem>
            <SelectItem value="long">&gt; 30 min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Label className="text-gray-600 dark:text-gray-400 font-inter">License:</Label>
        <Select 
          value={searchState.license || 'all'} 
          onValueChange={(value) => handleFilterChange('license', value)}
        >
          <SelectTrigger 
            className="w-32 px-2 py-1 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            data-testid="select-license"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Open</SelectItem>
            <SelectItem value="publicdomain">Public Domain</SelectItem>
            <SelectItem value="cc0">CC0</SelectItem>
            <SelectItem value="ccby">CC-BY</SelectItem>
            <SelectItem value="restricted">Restricted (NC/ND)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2 ml-auto">
        <span className="text-gray-600 dark:text-gray-400 font-inter">Sort:</span>
        <Select 
          value={searchState.sort || 'downloads'} 
          onValueChange={(value) => handleFilterChange('sort', value)}
        >
          <SelectTrigger 
            className="w-24 px-2 py-1 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            data-testid="select-sort"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="downloads">Downloads</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="relevance">Relevance</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
