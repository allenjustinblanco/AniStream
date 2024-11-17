import { useState, useEffect } from 'react';
import { getAnimeEpisodes, type AnimeEpisodeInfo } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Play, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EpisodesListProps {
  animeId: number;
}

export function EpisodesList({ animeId }: EpisodesListProps) {
  const [episodes, setEpisodes] = useState<AnimeEpisodeInfo[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchEpisodes() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAnimeEpisodes(animeId, page);
        
        if (isMounted) {
          setEpisodes(prev => [...prev, ...response.data]);
          setHasNextPage(response.pagination.has_next_page);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load episodes. Please try again later.');
          console.error('Error fetching episodes:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchEpisodes();

    return () => {
      isMounted = false;
    };
  }, [animeId, page]);

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[600px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {episodes.map((episode) => (
            <Card
              key={episode.mal_id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:ring-1 hover:ring-primary/50",
                selectedEpisode === episode.mal_id && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedEpisode(episode.mal_id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-32 aspect-video bg-muted rounded-md flex items-center justify-center">
                    <Play className="h-8 w-8 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 line-clamp-1">
                      Episode {episode.mal_id}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {episode.title}
                    </p>
                    {episode.aired && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(episode.aired).toLocaleDateString()}
                      </p>
                    )}
                    {(episode.filler || episode.recap) && (
                      <div className="flex gap-2 mt-2">
                        {episode.filler && (
                          <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">
                            Filler
                          </span>
                        )}
                        {episode.recap && (
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-xs rounded-full">
                            Recap
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {hasNextPage && (
          <div className="flex justify-center pb-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setPage(p => p + 1)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Episodes'
              )}
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}