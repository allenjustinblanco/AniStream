import { useEffect, useState } from 'react';
import { AnimeData, getTopAnime, getSeasonNow } from '@/lib/api';
import { AnimeRow } from './AnimeRow';
import { Loader2 } from 'lucide-react';

export function AnimeSections() {
  const [sections, setSections] = useState<{
    trending: AnimeData[];
    popular: AnimeData[];
    upcoming: AnimeData[];
  }>({
    trending: [],
    popular: [],
    upcoming: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAnime() {
      try {
        setIsLoading(true);
        setError(null);

        const [trendingData, popularData, seasonData] = await Promise.all([
          getTopAnime(1, 'airing'),
          getTopAnime(1, 'bypopularity'),
          getSeasonNow(),
        ]);

        if (isMounted) {
          setSections({
            trending: trendingData.data || [],
            popular: popularData.data || [],
            upcoming: seasonData.data || [],
          });
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load anime sections');
          console.error('Error fetching sections:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchAnime();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnimeRow 
        title="Trending Now" 
        animes={sections.trending} 
        sectionId="trending"
      />
      <AnimeRow 
        title="Most Popular" 
        animes={sections.popular}
        sectionId="popular"
      />
      <AnimeRow 
        title="Currently Airing" 
        animes={sections.upcoming}
        sectionId="upcoming"
      />
    </div>
  );
}