import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dices, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { searchVideos } from '@/lib/archive-api';

interface LuckyDipProps {
  onDipResults: (results: any) => void;
}

export function LuckyDip({ onDipResults }: LuckyDipProps) {
  const { brandSkin, setSearchState, setSearchResults, setTotalResults, setLoading } = useStore();
  const { toast } = useToast();
  const [isDipping, setIsDipping] = useState(false);

  const LUCKY_DIP_QUERIES = [
    'vintage training film',
    'public service announcement',
    'educational short',
    'safety demonstration',
    'promotional film',
    'documentary short',
    'instructional video',
    'industrial film',
    'newsreel footage',
    'animation short',
    'advertising film',
    'government film'
  ];

  const getThemeClasses = () => {
    switch (brandSkin) {
      case 'testcard':
        return 'bg-blue-400/20 text-blue-300 hover:bg-blue-400/30 border-blue-400/50';
      case 'waffle':
        return 'bg-yellow-400/20 text-amber-800 hover:bg-yellow-400/30 border-yellow-400/50';
      case 'ebn':
        return 'bg-lime-400/20 text-lime-300 hover:bg-lime-400/30 border-lime-500/50';
      case 'ozzy':
        return 'bg-red-400/20 text-red-300 hover:bg-red-400/30 border-red-500/50';
      case 'hogan':
        return 'bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30 border-yellow-400/50';
      case 'dx':
        return 'bg-pink-400/20 text-pink-300 hover:bg-pink-400/30 border-pink-500/50';
      case 'maxheadroom':
        return 'bg-green-400/20 text-green-300 hover:bg-green-400/30 border-green-500/50';
      case 'mario':
        return 'bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30 border-yellow-400/50';
      case 'dakota':
        return 'bg-gray-400/20 text-gray-300 hover:bg-gray-400/30 border-gray-400/50';
      case 'blondie':
        return 'bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border-amber-400/50';
      default:
        return 'bg-blue-400/20 text-blue-300 hover:bg-blue-400/30 border-blue-400/50';
    }
  };

  const handleLuckyDip = async () => {
    setIsDipping(true);
    setLoading(true);

    try {
      // Pick random queries and combine search terms
      const randomQueries = [...LUCKY_DIP_QUERIES]
        .sort(() => 0.5 - Math.random())
        .slice(0, 2); // Use fewer terms to get better results

      // Create search parameters for legally safe, short content with improved query
      const combinedQuery = `${randomQueries.join(' OR ')} AND mediatype:movies AND (licenseurl:*publicdomain* OR collection:*publicdomain*) AND (collection:prelinger OR collection:fedflix) AND year:[1940 TO 1990]`;
      
      const searchParams = {
        query: combinedQuery,
        license: 'publicdomain' as const,
        duration: 'short' as const,
        yearFrom: '1940',
        yearTo: '1990',
        sort: 'downloads' as const,
        page: Math.floor(Math.random() * 3) + 1, // Random page 1-3 for better results
        sources: ['prelinger', 'fedflix'],
        allowRestrictedLicenses: false
      };

      console.log('Lucky Dip search params:', searchParams);
      setSearchState(searchParams);

      const results = await searchVideos(searchParams);
      console.log('Lucky Dip results:', results);
      
      if (results?.docs && results.docs.length > 0) {
        // Take up to 15 random results
        const shuffledResults = [...results.docs]
          .sort(() => 0.5 - Math.random())
          .slice(0, 15);

        setSearchResults(shuffledResults);
        setTotalResults(shuffledResults.length);
        onDipResults(shuffledResults);

        toast({
          title: "Lucky Dip Success!",
          description: `Found ${shuffledResults.length} legally safe vintage clips ready for mixing.`,
        });
      } else {
        // Try a fallback search with broader terms
        const fallbackQuery = `vintage AND mediatype:movies AND (licenseurl:*publicdomain* OR collection:*publicdomain*)`;
        const fallbackParams = {
          ...searchParams,
          query: fallbackQuery,
          page: 1
        };
        
        const fallbackResults = await searchVideos(fallbackParams);
        
        if (fallbackResults?.docs && fallbackResults.docs.length > 0) {
          const shuffledResults = [...fallbackResults.docs]
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);

          setSearchResults(shuffledResults);
          setTotalResults(shuffledResults.length);
          onDipResults(shuffledResults);

          toast({
            title: "Lucky Dip Found Content!",
            description: `Found ${shuffledResults.length} vintage clips using broader search.`,
          });
        } else {
          toast({
            title: "No luck this time",
            description: "Archive.org might be slow. Try again in a moment.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Lucky Dip error:', error);
      toast({
        title: "Lucky Dip Failed",
        description: "Network issue or Archive.org is busy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDipping(false);
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLuckyDip}
      disabled={isDipping}
      className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg border transition-colors text-xs sm:text-sm ${getThemeClasses()}`}
      data-testid="button-lucky-dip"
      title="Get random vintage clips"
    >
      {isDipping ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          <span className="hidden sm:inline">Digging...</span>
          <span className="sm:hidden">...</span>
        </>
      ) : (
        <>
          <Dices size={14} />
          <span className="hidden sm:inline">Lucky Dip</span>
          <span className="sm:hidden">Dip</span>
        </>
      )}
    </Button>
  );
}