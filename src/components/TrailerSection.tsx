import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnimeVideos } from '@/lib/api';
import { VideoModal } from '@/components/VideoModal';

interface TrailerSectionProps {
  videos?: AnimeVideos | null;
  title: string;
}

export function TrailerSection({ videos, title }: TrailerSectionProps) {
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'promos' | 'music'>('promos');

  if (!videos?.promo?.length && !videos?.music_videos?.length) {
    return null;
  }

  const hasPromos = videos.promo?.length > 0;
  const hasMusicVideos = videos.music_videos?.length > 0;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Videos & Trailers</span>
            {hasPromos && hasMusicVideos && (
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'promos' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('promos')}
                >
                  Trailers
                </Button>
                <Button
                  variant={activeTab === 'music' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('music')}
                >
                  Music Videos
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeTab === 'promos' && videos.promo?.map((video, index) => (
                <div
                  key={`${video.trailer.youtube_id}-${index}`}
                  className={cn(
                    "group relative aspect-video rounded-lg overflow-hidden cursor-pointer bg-muted",
                    "hover:ring-2 hover:ring-primary/50 transition-all duration-300"
                  )}
                  onClick={() => video.trailer.embed_url && setSelectedVideo({
                    url: video.trailer.embed_url,
                    title: video.title
                  })}
                >
                  {/* Thumbnail */}
                  <img
                    src={video.trailer.images.maximum_image_url || video.trailer.images.large_image_url || ''}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" className="text-white">
                      <Play className="h-12 w-12" />
                    </Button>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                    <h3 className="text-white font-medium line-clamp-1">
                      {video.title}
                    </h3>
                  </div>
                </div>
              ))}

              {activeTab === 'music' && videos.music_videos?.map((video, index) => (
                <div
                  key={`${video.video.youtube_id}-${index}`}
                  className={cn(
                    "group relative aspect-video rounded-lg overflow-hidden cursor-pointer bg-muted",
                    "hover:ring-2 hover:ring-primary/50 transition-all duration-300"
                  )}
                  onClick={() => video.video.embed_url && setSelectedVideo({
                    url: video.video.embed_url,
                    title: `${video.meta.title} - ${video.meta.author}`
                  })}
                >
                  {/* Thumbnail */}
                  <img
                    src={video.video.images.maximum_image_url || video.video.images.large_image_url || ''}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" className="text-white">
                      <Play className="h-12 w-12" />
                    </Button>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                    <h3 className="text-white font-medium line-clamp-1">
                      {video.meta.title}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-1">
                      {video.meta.author}
                    </p>
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