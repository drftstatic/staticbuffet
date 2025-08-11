import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { SmartQueryChips } from '@/components/SmartQueryChips';
import { SourceToggles } from '@/components/SourceToggles';
import { LuckyDip } from '@/components/LuckyDip';
import { LicenseGuardrail } from '@/components/LicenseGuardrail';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const { searchState, setSearchState } = useStore();
  const [localQuery, setLocalQuery] = useState(searchState.query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchState({ query: localQuery, page: 1 });
    onSearch(localQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleSmartQuerySelect = (query: string) => {
    setLocalQuery(query);
    setSearchState({ query, page: 1 });
    onSearch(query);
  };

  const handleFiltersChange = () => {
    onSearch(localQuery);
  };

  const handleLuckyDipResults = (results: any) => {
    // Results are already set by LuckyDip component
    console.log('Lucky Dip found', results.length, 'clips');
  };

  return (
    <div className="space-y-3">
      {/* Smart Query Chips */}
      <SmartQueryChips onQuerySelect={handleSmartQuerySelect} />
      
      {/* Main Search Bar */}
      <div className="flex items-center space-x-3">
        <form onSubmit={handleSubmit} className="relative flex-1">
          <Input
            type="text"
            placeholder="Search public domain footage..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            data-testid="input-search"
            className="w-full px-4 py-2 pr-12 rounded-lg border bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-red-600 dark:focus:border-lime-500 focus:ring-red-600 dark:focus:ring-lime-500"
          />
          <Button
            type="submit"
            size="sm"
            data-testid="button-search"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 bg-transparent hover:bg-transparent text-red-600 dark:text-lime-500"
          >
            <Search size={16} />
          </Button>
        </form>
        
        <LuckyDip onDipResults={handleLuckyDipResults} />
      </div>
      
      {/* Source Toggles and License Controls */}
      <div className="flex items-center justify-between">
        <SourceToggles onSourcesChange={handleFiltersChange} />
        <LicenseGuardrail onLicenseChange={handleFiltersChange} />
      </div>
    </div>
  );
}
