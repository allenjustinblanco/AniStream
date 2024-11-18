import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { getTopAnime, type AnimeData } from '@/lib/api';
import { Link } from 'react-router-dom';

interface RankingItemProps {
  anime: AnimeData;
  rank: number;
}

function RankingItem({ anime, rank }: RankingItemProps) {
  return (
    <Link to={`/anime/${anime.mal_id}`}>
      <Card className="mb-2 hover:bg-accent/50 transition-colors">
        <CardContent className="p-4 flex items-center gap-4">
          <span className="text-2xl font-bold text-muted-foreground w-8">
            {rank}
          </span>
          <img
            src={anime.images.webp.image_url}
            alt={anime.title}
            className="w-16 h-24 object-cover rounded-md"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{anime.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Score: {anime.score}</span>
              {anime.episodes && <span>• {anime.episodes} episodes</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 10 }, (_, i) => (
        <Card key={`skeleton-${i}`} className="animate-pulse">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-8 h-8 bg-muted rounded" />
            <div className="w-16 h-24 bg-muted rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const RANKING_FILTERS = {
  airing: { title: 'Currently Airing', filter: 'airing' },
  upcoming: { title: 'Upcoming', filter: 'upcoming' },
  bypopularity: { title: 'Most Popular', filter: 'bypopularity' }
} as const;

type RankingFilter = keyof typeof RANKING_FILTERS;

export function RankingTabs() {
  const [activeTab, setActiveTab] = useState<RankingFilter>('airing');
  const [rankings, setRankings] = useState<Record<RankingFilter, AnimeData[]>>({
    airing: [],
    upcoming: [],
    bypopularity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchRankings() {
      try {
        setIsLoading(true);
        setError(null);
        
        const results = await Promise.all(
          Object.entries(RANKING_FILTERS).map(async ([key, { filter }]) => {
            const response = await getTopAnime(1, filter);
            return [key, response.data || []] as const;
          })
        );

        if (isMounted) {
          const newRankings = Object.fromEntries(results) as Record<RankingFilter, AnimeData[]>;
          setRankings(newRankings);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load rankings. Please try again later.');
          console.error('Error fetching rankings:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchRankings();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <Card className="p-4">
        <CardContent className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            Try Again
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as RankingFilter)}>
      <TabsList className="grid w-full grid-cols-3 mb-4">
        {Object.entries(RANKING_FILTERS).map(([key, { title }]) => (
          <TabsTrigger key={`tab-${key}`} value={key}>
            {title}
          </TabsTrigger>
        ))}
      </TabsList>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        Object.entries(RANKING_FILTERS).map(([key]) => (
          <TabsContent key={`content-${key}`} value={key} className="space-y-4">
            {rankings[key as RankingFilter].map((anime, index) => (
              <RankingItem
                key={`${key}-${anime.mal_id}-${index}`}
                anime={anime}
                rank={index + 1}
              />
            ))}
          </TabsContent>
        ))
      )}
    </Tabs>
  );
}