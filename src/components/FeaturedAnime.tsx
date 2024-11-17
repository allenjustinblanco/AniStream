import { useState, useEffect, useRef } from 'react';
import { AnimeData } from '@/lib/api';
import { Button } from './ui/button';
import { Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedAnimeProps {
  animes: AnimeData[];
}

export function FeaturedAnime({ animes }: FeaturedAnimeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number>();

  const currentAnime = animes[currentIndex];

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % animes.length);
    }, 8000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [animes.length]);

  if (!currentAnime) return null;

  return (
    <div className="relative h-[80vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentAnime.images.webp.large_image_url}
          alt={currentAnime.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative h-full container flex flex-col justify-end pb-24 gap-4">
        <div className="max-w-[40%]">
          <h1 className="text-6xl font-bold text-white mb-4">{currentAnime.title}</h1>
          <p className="text-lg text-white/90 line-clamp-3 mb-6">{currentAnime.synopsis}</p>
          
          <div className="flex items-center gap-3">
            <Link to={`/anime/${currentAnime.mal_id}`}>
              <Button size="lg" className="gap-2">
                <Play className="h-5 w-5" /> Watch Now
              </Button>
            </Link>
            <Link to={`/anime/${currentAnime.mal_id}`}>
              <Button size="lg" variant="outline" className="gap-2">
                <Info className="h-5 w-5" /> More Info
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="absolute bottom-12 right-8 flex gap-2">
          {animes.map((_, index) => (
            <button
              key={index}
              className={`h-1 w-12 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary'
                  : 'bg-gray-600'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}