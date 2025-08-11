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
        .slice(0, 3);

      // Create search parameters for legally safe, short content
      const searchParams = {
        query: randomQueries.join(' OR '),
        license: 'publicdomain' as const,
        duration: 'short' as const, // Under 5 minutes
        yearFrom: '1940',
        yearTo: '1990',
        sort: 'downloads' as const,
        page: Math.floor(Math.random() * 5) + 1, // Random page 1-5
        sources: ['prelinger', 'fedflix'],
        allowRestrictedLicenses: false
      };

      setSearchState(searchParams);

      const results = await searchVideos(searchParams);
      
      if (results?.docs && results.docs.length > 0) {
        // Take up to 12 random results
        const shuffledResults = [...results.docs]
          .sort(() => 0.5 - Math.random())
          .slice(0, 12);

        setSearchResults(shuffledResults);
        setTotalResults(shuffledResults.length);
        onDipResults(shuffledResults);

        toast({
          title: "Lucky Dip Complete!",
          description: `Found ${shuffledResults.length} legally safe clips for your mix.`,
        });
      } else {
        toast({
          title: "No luck this time",
          description: "Try again for a different selection of clips.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Lucky Dip error:', error);
      toast({
        title: "Lucky Dip Failed",
        description: "Unable to fetch random clips. Please try again.",
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
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${getThemeClasses()}`}
      data-testid="button-lucky-dip"
    >
      {isDipping ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Digging...</span>
        </>
      ) : (
        <>
          <Dices size={16} />
          <span>Lucky Dip</span>
        </>
      )}
    </Button>
  );
}