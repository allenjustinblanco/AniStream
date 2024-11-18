import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, HeartOff, Star } from 'lucide-react';
import { useAnimeStore } from '@/store/useStore';
import type { AnimeData } from '@/lib/api';
import { cn } from '@/lib/utils';

interface AnimeCardProps {
  anime: AnimeData;
  className?: string;
}

export function AnimeCard({ anime, className }: AnimeCardProps) {
  const { addToMyList, removeFromMyList, isInMyList } = useAnimeStore();
  const inList = isInMyList(anime.mal_id);

  return (
    <Card className={cn(
      "group relative h-[24rem] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:ring-1 hover:ring-primary/50",
      className
    )}>
      <Link to={`/anime/${anime.mal_id}`} className="block h-full">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          {/* Image with loading skeleton */}
          <div className="absolute inset-0 bg-muted animate-pulse" />
          <img
            src={anime.images.webp.large_image_url}
            alt={anime.title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 will-change-transform group-hover:scale-105"
            loading="lazy"
            onLoad={(e) => {
              const target = e.target as HTMLImageElement;
              target.previousElementSibling?.remove();
            }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
          
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-sm text-primary-foreground px-2 py-0.5 rounded-md text-sm font-medium flex items-center gap-1 shadow-lg">
            <Star className="h-3 w-3 fill-current" />
            {anime.score?.toFixed(1) || 'N/A'}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              inList ? removeFromMyList(anime.mal_id) : addToMyList(anime);
            }}
            className="absolute top-2 left-2 h-8 w-8 bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background/80"
          >
            {inList ? 
              <HeartOff className="h-4 w-4 text-primary" /> : 
              <Heart className="h-4 w-4 text-primary-foreground" />
            }
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent">
          <h3 className="font-semibold text-base leading-tight mb-2 line-clamp-2">
            {anime.title}
          </h3>
          
          <div className="flex gap-1.5 flex-wrap mb-2">
            {anime.genres.slice(0, 3).map((genre) => (
              <span
                key={genre.mal_id}
                className="px-1.5 py-0.5 bg-primary/10 rounded-full text-xs font-medium transition-colors group-hover:bg-primary/20"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 group-hover:text-foreground/90 transition-colors">
            {anime.synopsis}
          </p>
        </div>
      </Link>
    </Card>
  );
}