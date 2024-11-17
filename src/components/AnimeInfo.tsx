import { type AnimeData } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AnimeInfoProps {
  anime: AnimeData;
}

export function AnimeInfo({ anime }: AnimeInfoProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Synopsis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-line">
            {anime.synopsis}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {anime.episodes && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Episodes</dt>
                <dd className="text-foreground">{anime.episodes}</dd>
              </div>
            )}
            {anime.status && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="text-foreground">{anime.status}</dd>
              </div>
            )}
            {anime.year && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Year</dt>
                <dd className="text-foreground">{anime.year}</dd>
              </div>
            )}
            {anime.score && (
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Rating</dt>
                <dd className="text-foreground">{anime.score} / 10</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Genres</CardTitle>
          <CardDescription>
            Categories and themes present in this anime
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {anime.genres.map((genre) => (
              <span
                key={genre.mal_id}
                className="px-3 py-1 bg-primary/10 hover:bg-primary/20 transition-colors rounded-full text-sm cursor-pointer"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}