import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAnime, type AnimeData } from '@/lib/api';
import { AnimeCard } from '@/components/AnimeCard';
import { Loader2 } from 'lucide-react';

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<AnimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function performSearch() {
      if (!query) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await searchAnime(query);
        
        if (isMounted) {
          setResults(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load search results. Please try again.');
          console.error('Error searching anime:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    performSearch();

    return () => {
      isMounted = false;
    };
  }, [query]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">
        Search Results for "{query}"
      </h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No results found for "{query}". Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
}