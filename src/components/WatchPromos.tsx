import { useEffect, useState } from 'react';
import { getWatchPopularPromos, type Promo } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Volume2, VolumeX } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';

interface VideoModalProps {
  embedUrl: string;
  title: string;
  onClose: () => void;
}

function VideoModal({ embedUrl, title, onClose }: VideoModalProps) {
  const [isMuted, setIsMuted] = useState(true);

  // Add mute parameter to URL
  const videoUrl = new URL(embedUrl);
  videoUrl.searchParams.set('mute', isMuted ? '1' : '0');

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="fixed inset-0 flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-5xl">
          {/* Header */}
          <div className="absolute -top-12 left-0 right-0 flex items-center justify-between text-foreground">
            <h2 className="text-lg font-semibold">{title}</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="text-foreground hover:text-primary"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:text-primary"
                onClick={onClose}
              >
                ×
              </Button>
            </div>
          </div>
          
          {/* Video player */}
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl">
            <iframe
              src={videoUrl.toString()}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function WatchPromos() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPromos() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getWatchPopularPromos();
        
        if (isMounted) {
          setPromos(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load promos');
          console.error('Error fetching promos:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPromos();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Popular Trailers</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {promos.map((promo) => (
                <div key={`${promo.entry.mal_id}-${promo.trailer.youtube_id}`} className="space-y-2">
                  <div
                    className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer bg-muted"
                    onClick={() => setSelectedVideo({
                      url: promo.trailer.embed_url || '',
                      title: promo.entry.title
                    })}
                  >
                    {/* Thumbnail */}
                    <img
                      src={promo.trailer.images.large_image_url || ''}
                      alt={promo.entry.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" className="text-white">
                        <Play className="h-12 w-12" />
                      </Button>
                    </div>
                  </div>

                  {/* Title and link */}
                  <div className="space-y-1">
                    <Link 
                      to={`/anime/${promo.entry.mal_id}`}
                      className="font-medium hover:text-primary transition-colors line-clamp-1"
                    >
                      {promo.entry.title}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedVideo && (
        <VideoModal
          embedUrl={selectedVideo.url}
          title={selectedVideo.title}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
}