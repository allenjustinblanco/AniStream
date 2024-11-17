import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { AnimeCard } from '@/components/AnimeCard';
import { animeData, genres } from '@/lib/mockData';

export function AnimeGrid() {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  const filteredAnime = animeData.filter((anime) => {
    const matchesSearch = anime.title.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre ? anime.genre.includes(selectedGenre) : true;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Search anime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64"
        />
        <select
          className="h-9 rounded-md border px-3 bg-background"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAnime.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </div>
  );
}