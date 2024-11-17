export interface AnimeData {
  mal_id: number;
  title: string;
  synopsis: string;
  images: {
    webp: {
      image_url: string;
      large_image_url: string;
    };
  };
  genres: Array<{ mal_id: number; name: string }>;
  episodes: number;
  score: number;
  year: number;
  status: string;
  videos?: {
    promo: Array<{
      title: string;
      trailer: {
        embed_url: string;
        url: string;
        images: {
          image_url: string;
          small_image_url: string;
          medium_image_url: string;
          large_image_url: string;
          maximum_image_url: string;
        };
      };
    }>;
  };
}

export interface AnimeReview {
  mal_id: number;
  date: string;
  review: string;
  score: number;
  reactions: {
    nice: number;
    confusing: number;
    creative: number;
    funny: number;
    informative: number;
  };
  user: {
    username: string;
    images?: {
      webp?: {
        image_url: string;
      };
    };
  };
}

export type RankingPeriod = 'daily' | 'weekly' | 'monthly';