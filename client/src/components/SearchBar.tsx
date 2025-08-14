import { useState } from 'react';
import { Search, AlertCircle, Loader2, Info, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { SmartQueryChips } from '@/components/SmartQueryChips';
import { SavedSearches } from '@/components/SavedSearches';
import { SearchErrorAnalyzer } from '@/lib/error-handler';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export function SearchBar({ onSearch, isLoading = false, error = null, onRetry }: SearchBarProps) {
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
      
      {/* Enhanced error display with education */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="text-sm font-medium text-red-700 dark:text-red-300">
                Search Issue Detected
              </div>
              
              {(() => {
                const errorInfo = SearchErrorAnalyzer.analyzeError(error);
                
                return (
                  <>
                    <div className="text-sm text-red-600 dark:text-red-400">
                      {errorInfo.userMessage}
                    </div>
                    
                    {errorInfo.suggestions.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
                          <Info size={10} />
                          Suggestions:
                        </div>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside space-y-0.5 ml-3">
                          {errorInfo.suggestions.map((suggestion, i) => (
                            <li key={i}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                        💡 Static Buffet uses Archive.org's free database - occasional delays are normal
                      </div>
                      
                      {SearchErrorAnalyzer.shouldShowRetryButton(errorInfo) && onRetry && (
                        <Button
                          onClick={onRetry}
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          disabled={isLoading}
                        >
                          <RefreshCw size={10} className="mr-1" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
