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
    <div className="space-y-2">      
      {/* Compact Search Bar - no chips */}
      <div className="flex items-center space-x-1">
        <form onSubmit={handleSubmit} className="relative flex-1">
          <Input
            type="text"
            placeholder="Search footage..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            data-testid="input-search"
            className="w-full px-3 py-1.5 pr-8 text-sm rounded border bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
          <Button
            type="submit"
            size="sm"
            data-testid="button-search"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 bg-transparent hover:bg-transparent text-gray-600"
          >
            <Search size={12} />
          </Button>
        </form>
        
        <div className="flex-shrink-0">
          <LuckyDip onDipResults={handleLuckyDipResults} />
        </div>
      </div>
      
      {/* Collapsible Advanced Controls */}
      <details className="group">
        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">Advanced Options</summary>
        <div className="mt-1 flex flex-wrap gap-2">
          <SourceToggles onSourcesChange={handleFiltersChange} />
          <LicenseGuardrail onLicenseChange={handleFiltersChange} />
        </div>
      </details>
    </div>
  );
}
