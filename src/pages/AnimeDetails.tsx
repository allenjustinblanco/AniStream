import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAnimeById, getAnimeVideos, type AnimeData, type AnimeVideos } from '@/lib/api';
import { AnimeInfo } from '@/components/AnimeInfo';
import { AnimeReviews } from '@/components/AnimeReviews';
import { AnimeRecommendations } from '@/components/AnimeRecommendations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnimeStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Heart, HeartOff, Star } from 'lucide-react';
import { TrailerSection } from '@/components/TrailerSection';
import { EpisodesList } from '@/components/EpisodesList';

function AnimeDetailsSkeleton() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="h-[70vh] bg-muted relative">
        <div className="container relative h-full flex items-end pb-12">
          <div className="flex gap-8">
            <div className="hidden md:block w-48 aspect-[2/3] bg-muted-foreground/10 rounded-lg" />
            <div className="flex-1 space-y-4">
              <div className="h-10 bg-muted-foreground/10 rounded-lg w-1/3" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-20 bg-muted-foreground/10 rounded-full"
                  />
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted-foreground/10 rounded w-full" />
                <div className="h-4 bg-muted-foreground/10 rounded w-2/3" />
              </div>
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnimeDetails() {
  const { id } = useParams();
  const [anime, setAnime] = useState<AnimeData | null>(null);
  const [videos, setVideos] = useState<AnimeVideos | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToMyList, removeFromMyList, isInMyList } = useAnimeStore();
  const animeId = id ? parseInt(id, 10) : undefined;
  const inList = animeId ? isInMyList(animeId) : false;

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (!animeId) {
        setError('Invalid anime ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const [animeResponse, videosResponse] = await Promise.all([
          getAnimeById(animeId),
          getAnimeVideos(animeId)
        ]);
        
        if (isMounted) {
          setAnime(animeResponse.data);
          setVideos(videosResponse);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load anime details. Please try again later.');
          console.error('Error fetching anime:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();
    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [animeId]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (isLoading || !anime) {
    return <AnimeDetailsSkeleton />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={anime.images.webp.large_image_url}
            alt={anime.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="container relative h-full flex items-end pb-12">
          <div className="flex gap-8">
            {/* Poster */}
            <div className="hidden md:block w-48 flex-shrink-0">
              <img
                src={anime.images.webp.large_image_url}
                alt={anime.title}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold">{anime.title}</h1>
                <div className="flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold">{anime.score}</span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {anime.genres.map((genre) => (
                  <span
                    key={genre.mal_id}
                    className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="text-lg text-muted-foreground max-w-3xl line-clamp-3">
                {anime.synopsis}
              </p>

              <div className="flex gap-4 pt-4">
                <Button size="lg" className="gap-2">
                  Watch Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    if (inList) {
                      removeFromMyList(animeId!);
                    } else if (anime) {
                      addToMyList(anime);
                    }
                  }}
                >
                  {inList ? (
                    <>
                      <HeartOff className="h-5 w-5" />
                      Remove from List
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5" />
                      Add to List
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="episodes">Episodes</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <AnimeInfo anime={anime} />
              </div>
              <div>
                <AnimeRecommendations animeId={animeId!} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="episodes">
            <EpisodesList animeId={animeId!} />
          </TabsContent>

          <TabsContent value="videos">
            <TrailerSection videos={videos} title={anime.title} />
          </TabsContent>

          <TabsContent value="reviews">
            <AnimeReviews animeId={animeId!} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}