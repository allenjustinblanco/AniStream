import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnimeData } from '@/lib/api';

interface WatchProgress {
  animeId: number;
  episodeId: number;
  timestamp: number;
  lastWatched: Date;
}

interface AnimeStore {
  myList: AnimeData[];
  watchProgress: WatchProgress[];
  addToMyList: (anime: AnimeData) => void;
  removeFromMyList: (animeId: number) => void;
  isInMyList: (animeId: number) => boolean;
  updateWatchProgress: (progress: WatchProgress) => void;
  getWatchProgress: (animeId: number, episodeId: number) => WatchProgress | undefined;
}

export const useAnimeStore = create<AnimeStore>()(
  persist(
    (set, get) => ({
      myList: [],
      watchProgress: [],
      addToMyList: (anime) => {
        set((state) => ({
          myList: [...state.myList, anime],
        }));
      },
      removeFromMyList: (animeId) => {
        set((state) => ({
          myList: state.myList.filter((anime) => anime.mal_id !== animeId),
        }));
      },
      isInMyList: (animeId) => {
        return get().myList.some((anime) => anime.mal_id === animeId);
      },
      updateWatchProgress: (progress) => {
        set((state) => {
          const existingProgressIndex = state.watchProgress.findIndex(
            (p) => p.animeId === progress.animeId && p.episodeId === progress.episodeId
          );

          const newProgress = [...state.watchProgress];
          if (existingProgressIndex !== -1) {
            newProgress[existingProgressIndex] = progress;
          } else {
            newProgress.push(progress);
          }

          return { watchProgress: newProgress };
        });
      },
      getWatchProgress: (animeId, episodeId) => {
        return get().watchProgress.find(
          (p) => p.animeId === animeId && p.episodeId === episodeId
        );
      },
    }),
    {
      name: 'anime-storage',
    }
  )
);