import { useEffect, useState } from 'react';
import { getAnimeRecommendations, type AnimeRecommendation } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface AnimeRecommendationsProps {
  animeId: number;
}

export function AnimeRecommendations({ animeId }: AnimeRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AnimeRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchRecommendations() {
      if (!animeId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAnimeRecommendations(animeId);
        
        if (isMounted) {
          setRecommendations(data.data || []);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load recommendations');
          console.error('Error fetching recommendations:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchRecommendations();

    return () => {
      isMounted = false;
    };
  }, [animeId]);

  if (error) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>You May Also Like</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="flex gap-4">
              <Skeleton className="w-16 h-24" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : (
          recommendations.slice(0, 5).map((rec) => (
            <Link
              key={`recommendation-${rec.entry.mal_id}`}
              to={`/anime/${rec.entry.mal_id}`}
              className="flex gap-4 group"
            >
              <img
                src={rec.entry.images.webp.image_url}
                alt={rec.entry.title}
                className="w-16 h-24 object-cover rounded-md transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="flex-1">
                <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {rec.entry.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {rec.votes} votes
                </p>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}