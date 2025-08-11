import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';

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

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-2xl mx-8">
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
  );
}
