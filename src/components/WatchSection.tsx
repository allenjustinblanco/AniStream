import { useState } from 'react';
import { VideoPlayer } from './VideoPlayer';
import { VideoProviders, type Provider } from './VideoProviders';
import { EpisodeList, type Episode } from './EpisodeList';
import { Card } from './ui/card';
import { AnimeData } from '@/lib/types';

// Mock video providers
const mockProviders: Provider[] = [
  { id: 'crunchyroll', name: 'Crunchyroll', quality: '1080p', type: 'sub' },
  { id: 'funimation', name: 'Funimation', quality: '1080p', type: 'dub' },
  { id: 'hidive', name: 'HIDIVE', quality: '1080p', type: 'sub' },
];

// Mock episodes based on anime data
function generateEpisodes(anime: AnimeData): Episode[] {
  return Array.from({ length: anime.episodes || 12 }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    title: `Episode ${i + 1}`,
    thumbnail: anime.images.webp.image_url,
  }));
}

interface WatchSectionProps {
  anime: AnimeData;
}

export function WatchSection({ anime }: WatchSectionProps) {
  const [selectedProvider, setSelectedProvider] = useState(mockProviders[0].id);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const episodes = generateEpisodes(anime);

  // Get trailer URL from anime data
  const trailerUrl = anime.videos?.promo[0]?.trailer.embed_url;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <VideoPlayer
          videoUrl={currentEpisode ? undefined : undefined} // Replace with actual episode URL when available
          poster={anime.images.webp.large_image_url}
          title={currentEpisode ? `Episode ${currentEpisode.number}` : anime.title}
          animeId={anime.mal_id}
          episodeId={currentEpisode?.id}
        />

        <div className="mt-6 space-y-6">
          <VideoProviders
            providers={mockProviders}
            selectedProvider={selectedProvider}
            onProviderSelect={setSelectedProvider}
          />

          <EpisodeList
            episodes={episodes}
            currentEpisodeId={currentEpisode?.id || null}
            onEpisodeSelect={(episode) => setCurrentEpisode(episode)}
          />
        </div>
      </Card>

      {/* Trailer Section */}
      {trailerUrl && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Official Trailer</h3>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={trailerUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </Card>
      )}
    </div>
  );
}