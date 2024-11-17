import { useState, useRef } from 'react';
import { AnimeData } from '@/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { AnimeCard } from './AnimeCard';

interface AnimeRowProps {
  title: string;
  animes: AnimeData[];
  sectionId: string;
}

export function AnimeRow({ title, animes, sectionId }: AnimeRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className="relative group">
      <h2 className="text-2xl font-semibold mb-4 px-4">{title}</h2>
      
      {showLeftButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 z-10 h-full max-h-[24rem] -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}
      
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4 snap-x snap-mandatory"
        onScroll={handleScroll}
      >
        {animes.map((anime, index) => (
          <div 
            key={`${sectionId}-${anime.mal_id}-${index}`} 
            className="flex-none w-[240px] snap-start"
          >
            <AnimeCard anime={anime} />
          </div>
        ))}
      </div>
      
      {showRightButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 z-10 h-full max-h-[24rem] -translate-y-1/2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}
    </div>
  );
}