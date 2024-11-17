import { useEffect, useState } from 'react';
import { AnimeCard } from '@/components/AnimeCard';
import { getTopAnime, type AnimeData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { FeaturedAnime } from '@/components/FeaturedAnime';
import { RankingTabs } from '@/components/RankingTabs';
import { AnimeSections } from '@/components/AnimeSections';
import { WatchPromos } from '@/components/WatchPromos';
import { Loader2 } from 'lucide-react';

// Cache for anime data
let cachedAnimeList: AnimeData[] | null = null;
let cachedHasMore = true;
let cachedPage = 1;

export function Home() {
  const [animeList, setAnimeList] = useState<AnimeData[]>(cachedAnimeList || []);
  const [isLoading, setIsLoading] = useState(!cachedAnimeList);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(cachedPage);
  const [hasMore, setHasMore] = useState(cachedHasMore);

  useEffect(() => {
    let isMounted = true;

    async function fetchInitialAnime() {
      if (cachedAnimeList) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await getTopAnime(1);
        
        if (isMounted) {
          const newAnimeList = response.data || [];
          setAnimeList(newAnimeList);
          setHasMore(response.pagination.has_next_page);
          setPage(2);

          // Update cache
          cachedAnimeList = newAnimeList;
          cachedHasMore = response.pagination.has_next_page;
          cachedPage = 2;
        }
      } catch (error) {
        if (isMounted) {
          setError('Failed to load anime. Please try again later.');
          console.error('Error fetching anime:', error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchInitialAnime();

    return () => {
      isMounted = false;
    };
  }, []);

  async function fetchMoreAnime() {
    try {
      setIsLoading(true);
      const response = await getTopAnime(page);
      const newAnimeList = [...animeList, ...(response.data || [])];
      
      setAnimeList(newAnimeList);
      setHasMore(response.pagination.has_next_page);
      setPage(prev => prev + 1);

      // Update cache
      cachedAnimeList = newAnimeList;
      cachedHasMore = response.pagination.has_next_page;
      cachedPage = page + 1;
    } catch (error) {
      setError('Failed to load more anime. Please try again.');
      console.error('Error fetching anime:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (error && animeList.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const featuredAnimes = animeList.slice(0, 5);

  return (
    <div className="pb-8">
      {featuredAnimes.length > 0 && (
        <FeaturedAnime animes={featuredAnimes} />
      )}

      <div className="container mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnimeSections />
            <div className="mt-8">
              <WatchPromos />
            </div>
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Explore More</h2>
              {animeList.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {animeList.map((anime) => (
                      <AnimeCard key={`list-${anime.mal_id}`} anime={anime} />
                    ))}
                  </div>
                  {hasMore && (
                    <div className="mt-8 text-center">
                      <Button
                        onClick={fetchMoreAnime}
                        disabled={isLoading}
                        variant="outline"
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Load More'
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </div>
              )}
            </section>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6">Rankings</h2>
            <RankingTabs />
          </div>
        </div>
      </div>
    </div>
  );
}