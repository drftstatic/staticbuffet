import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bookmark, BookmarkPlus, Trash2, Search } from 'lucide-react';
import { useStore } from '@/lib/store';
import { type SearchState } from '@/lib/types';
interface SavedSearch {
    id: string;
    name: string;
    searchState: SearchState;
    createdAt: number;
    usageCount: number;
}
const STORAGE_KEY = 'staticBuffet_savedSearches';
export function SavedSearches() {
    const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newSearchName, setNewSearchName] = useState('');
    const { searchState, setSearchState, brandSkin } = useStore();
    // Load saved searches from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setSavedSearches(JSON.parse(saved));
            }
        }
        catch (error) {
            console.warn('Failed to load saved searches:', error);
        }
    }, []);
    // Save to localStorage whenever savedSearches changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(savedSearches));
        }
        catch (error) {
            console.warn('Failed to save searches:', error);
        }
    }, [savedSearches]);
    const saveCurrentSearch = () => {
        if (!newSearchName.trim() || !searchState.query)
            return;
        const newSearch: SavedSearch = {
            id: Date.now().toString(),
            name: newSearchName.trim(),
            searchState: { ...searchState },
            createdAt: Date.now(),
            usageCount: 0,
        };
        setSavedSearches(prev => [newSearch, ...prev].slice(0, 20)); // Keep only 20 most recent
        setNewSearchName('');
        setIsCreating(false);
    };
    const loadSearch = (search: SavedSearch) => {
        // Update usage count
        setSavedSearches(prev => prev.map(s => s.id === search.id ? { ...s, usageCount: s.usageCount + 1 } : s));
        // Apply the search
        setSearchState(search.searchState);
        setIsOpen(false);
    };
    const deleteSearch = (id: string) => {
        setSavedSearches(prev => prev.filter(s => s.id !== id));
    };
    const formatSearchDescription = (searchState: SearchState) => {
        const parts = [];
        if (searchState.query)
            parts.push(`"${searchState.query}"`);
        if (searchState.license)
            parts.push(`License: ${searchState.license}`);
        if (searchState.duration)
            parts.push(`Duration: ${searchState.duration}`);
        if (searchState.yearFrom || searchState.yearTo) {
            parts.push(`Years: ${searchState.yearFrom || '?'}-${searchState.yearTo || '?'}`);
        }
        return parts.join(' • ');
    };
    const getThemeClasses = () => {
        {
            return {
                button: 'bg-lime-900/30 text-lime-400 hover:bg-lime-900/50 border-lime-500/30',
                dialog: 'bg-gray-900/95 border-lime-500/50',
                badge: 'bg-lime-900/50 text-lime-300'
            };
        }
    };
    const theme = getThemeClasses();
    return (<Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 py-0.5 flex items-center text-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Saved Searches">
          <Bookmark size={12}/>
        </Button>
      </DialogTrigger>

      <DialogContent className={`max-w-2xl ${theme.dialog}`}>
        <DialogHeader>
          <DialogTitle>Saved Searches</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Save current search */}
          {searchState.query && (<div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50">
              {isCreating ? (<div className="space-y-3">
                  <Label htmlFor="search-name">Save current search:</Label>
                  <div className="flex gap-2">
                    <Input id="search-name" value={newSearchName} onChange={(e) => setNewSearchName(e.target.value)} placeholder="e.g., PSA <60s, Newsreel 40s-70s" onKeyPress={(e) => e.key === 'Enter' && saveCurrentSearch()}/>
                    <Button onClick={saveCurrentSearch} disabled={!newSearchName.trim()}>
                      Save
                    </Button>
                    <Button variant="ghost" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Current: {formatSearchDescription(searchState)}
                  </p>
                </div>) : (<div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Save current search</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatSearchDescription(searchState)}
                    </p>
                  </div>
                  <Button onClick={() => setIsCreating(true)} size="sm">
                    <BookmarkPlus size={14} className="mr-1"/>
                    Save
                  </Button>
                </div>)}
            </div>)}

          {/* Saved searches list */}
          <div className="space-y-2">
            {savedSearches.length === 0 ? (<div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Bookmark size={32} className="mx-auto mb-2 opacity-50"/>
                <p>No saved searches yet</p>
                <p className="text-sm">Save your favorite search combinations for quick access</p>
              </div>) : (savedSearches.map((search) => (<div key={search.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{search.name}</h4>
                      {search.usageCount > 0 && (<Badge variant="secondary" className={theme.badge}>
                          {search.usageCount}x
                        </Badge>)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {formatSearchDescription(search.searchState)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Saved {new Date(search.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" onClick={() => loadSearch(search)} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Search size={14} className="mr-1"/>
                      Load
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteSearch(search.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 size={14}/>
                    </Button>
                  </div>
                </div>)))}
          </div>
        </div>
      </DialogContent>
    </Dialog>);
}
