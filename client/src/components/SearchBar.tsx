import { useState } from 'react';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { SmartQueryChips } from '@/components/SmartQueryChips';
import { SavedSearches } from '@/components/SavedSearches';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function SearchBar({ onSearch, isLoading = false, error = null }: SearchBarProps) {
  const { searchState, setSearchState } = useStore();
  const [localQuery, setLocalQuery] = useState(searchState.query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate query
    if (!localQuery || localQuery.trim().length === 0) {
      console.warn('SearchBar: Empty query submitted');
      return;
    }
    
    if (localQuery.trim().length < 2) {
      console.warn('SearchBar: Query too short');
      return;
    }
    
    console.log('SearchBar: handleSubmit called with localQuery:', localQuery);
    setSearchState({ query: localQuery.trim(), page: 1 });
    onSearch(localQuery.trim());
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



  return (
    <div className="space-y-2">      
      {/* Compact Search Bar with integrated saved searches */}
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
            disabled={isLoading}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 bg-transparent hover:bg-transparent text-gray-600 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Search size={12} />
            )}
          </Button>
        </form>
        <SavedSearches />
      </div>
      
      {/* Error indicator */}
      {error && (
        <div className="flex items-center space-x-2 text-red-500 text-xs mt-1 px-2">
          <AlertCircle size={12} />
          <span>
            {error.message.includes('Rate limited') 
              ? 'Please wait a moment before searching again'
              : error.message.includes('empty')
              ? 'Please enter a search term'
              : 'Search failed - please try again'
            }
          </span>
        </div>
      )}
      
    </div>
  );
}
