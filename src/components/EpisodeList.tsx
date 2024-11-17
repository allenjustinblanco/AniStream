import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface Episode {
  id: number;
  number: number;
  title: string;
  thumbnail?: string;
}

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisodeId: number | null;
  onEpisodeSelect: (episode: Episode) => void;
}

export function EpisodeList({
  episodes,
  currentEpisodeId,
  onEpisodeSelect,
}: EpisodeListProps) {
  // Mock episodes if none provided
  const mockEpisodes: Episode[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    title: `Episode ${i + 1}`,
  }));

  const displayEpisodes = episodes.length > 0 ? episodes : mockEpisodes;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Episodes</h3>
      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayEpisodes.map((episode) => (
            <Button
              key={episode.id}
              variant={currentEpisodeId === episode.id ? "default" : "outline"}
              onClick={() => onEpisodeSelect(episode)}
              className="w-full justify-start"
            >
              <span className="mr-2 font-bold">EP {episode.number}</span>
              <span className="truncate">{episode.title}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}