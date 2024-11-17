import { useAnimeStore } from '@/store/useStore';
import { AnimeCard } from '@/components/AnimeCard';

export function MyList() {
  const { myList } = useAnimeStore();

  if (myList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">My List</h1>
          <p className="text-muted-foreground">
            You haven't added any anime to your list yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">My List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {myList.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    </div>
  );
}