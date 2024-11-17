import { z } from 'zod';

const BASE_URL = 'https://api.jikan.moe/v4';
const RATE_LIMIT_DELAY = 1000;
const MAX_RETRIES = 3;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Error handling
class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}

// Utility functions
async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await delay(RATE_LIMIT_DELAY * Math.pow(2, i));
      const response = await fetch(url);

      if (response.status === 429) {
        throw new APIError('Rate limit exceeded', 429);
      }

      if (!response.ok) {
        throw new APIError(`HTTP error! status: ${response.status}`, response.status);
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      if (error instanceof APIError && error.status !== 429) {
        throw error;
      }
      console.warn(`Attempt ${i + 1} failed, retrying...`, error);
    }
  }

  throw lastError || new Error('Failed after multiple retries');
}

// Schemas
const ImageSchema = z.object({
  image_url: z.string(),
  small_image_url: z.string().optional(),
  large_image_url: z.string().optional(),
  maximum_image_url: z.string().optional(),
});

const ImagesSchema = z.object({
  jpg: z.object({
    image_url: z.string(),
    small_image_url: z.string().optional(),
    large_image_url: z.string().optional(),
  }),
  webp: z.object({
    image_url: z.string(),
    small_image_url: z.string().optional(),
    large_image_url: z.string().optional(),
  }),
});

const GenreSchema = z.object({
  mal_id: z.number(),
  name: z.string(),
});

const AnimeSchema = z.object({
  mal_id: z.number(),
  title: z.string(),
  synopsis: z.string(),
  images: ImagesSchema,
  genres: z.array(GenreSchema),
  episodes: z.number().nullable(),
  score: z.number().nullable(),
  year: z.number().nullable(),
  status: z.string(),
});

const PaginationSchema = z.object({
  has_next_page: z.boolean(),
  current_page: z.number(),
  items: z.object({
    count: z.number(),
    total: z.number(),
    per_page: z.number(),
  }),
});

const AnimeResponseSchema = z.object({
  data: z.array(AnimeSchema),
  pagination: PaginationSchema,
});

const SingleAnimeResponseSchema = z.object({
  data: AnimeSchema,
});

const TrailerSchema = z.object({
  youtube_id: z.string().optional(),
  url: z.string().optional(),
  embed_url: z.string().optional(),
  images: ImageSchema,
});

const PromoSchema = z.object({
  title: z.string(),
  trailer: TrailerSchema,
});

const MusicVideoSchema = z.object({
  title: z.string(),
  video: TrailerSchema,
  meta: z.object({
    title: z.string(),
    author: z.string(),
  }),
});

const AnimeVideosSchema = z.object({
  data: z.object({
    promo: z.array(PromoSchema),
    episodes: z.array(z.object({
      mal_id: z.number(),
      title: z.string(),
      episode: z.string(),
      url: z.string(),
      images: z.object({
        jpg: z.object({
          image_url: z.string(),
        }),
      }),
    })),
    music_videos: z.array(MusicVideoSchema),
  }),
});

const WatchPromoSchema = z.object({
  entry: z.object({
    mal_id: z.number(),
    url: z.string(),
    images: ImagesSchema,
    title: z.string(),
  }),
  trailer: TrailerSchema,
});

const WatchPromosResponseSchema = z.object({
  pagination: z.object({
    last_visible_page: z.number(),
    has_next_page: z.boolean(),
  }),
  data: z.array(WatchPromoSchema),
});

const AnimeRecommendationSchema = z.object({
  entry: z.object({
    mal_id: z.number(),
    url: z.string(),
    images: ImagesSchema,
    title: z.string(),
  }),
  url: z.string(),
  votes: z.number(),
});

const AnimeRecommendationsResponseSchema = z.object({
  data: z.array(AnimeRecommendationSchema),
});

const AnimeEpisodeSchema = z.object({
  mal_id: z.number(),
  url: z.string(),
  title: z.string().nullable(),
  title_japanese: z.string().nullable(),
  title_romanji: z.string().nullable(),
  aired: z.string().nullable(),
  score: z.number().nullable(),
  filler: z.boolean().optional(),
  recap: z.boolean().optional(),
  forum_url: z.string().nullable(),
});

const AnimeEpisodesResponseSchema = z.object({
  data: z.array(AnimeEpisodeSchema),
  pagination: z.object({
    last_visible_page: z.number(),
    has_next_page: z.boolean(),
  }),
});

const AnimeReviewSchema = z.object({
  mal_id: z.number(),
  type: z.string(),
  reactions: z.object({
    overall: z.number(),
  }).optional(),
  date: z.string(),
  review: z.string(),
  score: z.number(),
  tags: z.array(z.string()).optional(),
  is_spoiler: z.boolean().optional(),
  is_preliminary: z.boolean().optional(),
  episodes_watched: z.number().optional(),
  user: z.object({
    username: z.string(),
    images: z.object({
      jpg: z.object({
        image_url: z.string(),
      }).optional(),
      webp: z.object({
        image_url: z.string(),
      }).optional(),
    }).optional(),
  }),
});

const AnimeReviewsResponseSchema = z.object({
  data: z.array(AnimeReviewSchema),
  pagination: z.object({
    last_visible_page: z.number(),
    has_next_page: z.boolean(),
  }),
});

// Types
export type AnimeData = z.infer<typeof AnimeSchema>;
export type AnimeResponse = z.infer<typeof AnimeResponseSchema>;
export type AnimeVideos = z.infer<typeof AnimeVideosSchema>['data'];
export type Promo = z.infer<typeof WatchPromoSchema>;
export type AnimeRecommendation = z.infer<typeof AnimeRecommendationSchema>;
export type AnimeEpisodeInfo = z.infer<typeof AnimeEpisodeSchema>;
export type AnimeReview = z.infer<typeof AnimeReviewSchema>;
export type AnimeEpisodesResponse = z.infer<typeof AnimeEpisodesResponseSchema>;

// API Functions
export async function getTopAnime(page = 1, filter?: string): Promise<AnimeResponse> {
  try {
    const url = new URL(`${BASE_URL}/top/anime`);
    url.searchParams.set('page', page.toString());
    if (filter) {
      url.searchParams.set('filter', filter);
    }

    const cached = getFromCache<AnimeResponse>(url.toString());
    if (cached) return cached;

    const response = await fetchWithRetry(url.toString());
    const data = await response.json();
    const parsed = AnimeResponseSchema.parse(data);
    setCache(url.toString(), parsed);
    return parsed;
  } catch (error) {
    console.error('Error fetching anime:', error);
    throw error;
  }
}

export async function getAnimeById(id: number): Promise<{ data: AnimeData }> {
  try {
    const url = `${BASE_URL}/anime/${id}`;
    const cached = getFromCache<{ data: AnimeData }>(url);
    if (cached) return cached;

    const response = await fetchWithRetry(url);
    const data = await response.json();
    const parsed = SingleAnimeResponseSchema.parse(data);
    setCache(url, parsed);
    return parsed;
  } catch (error) {
    console.error('Error fetching anime details:', error);
    throw error;
  }
}

export async function searchAnime(query: string): Promise<AnimeResponse> {
  try {
    const url = new URL(`${BASE_URL}/anime`);
    url.searchParams.set('q', query);
    url.searchParams.set('sfw', 'true');

    const cached = getFromCache<AnimeResponse>(url.toString());
    if (cached) return cached;

    const response = await fetchWithRetry(url.toString());
    const data = await response.json();
    const parsed = AnimeResponseSchema.parse(data);
    setCache(url.toString(), parsed);
    return parsed;
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
}

export async function getAnimeVideos(id: number): Promise<AnimeVideos> {
  try {
    const url = `${BASE_URL}/anime/${id}/videos`;
    const cached = getFromCache<AnimeVideos>(url);
    if (cached) return cached;

    const response = await fetchWithRetry(url);
    const data = await response.json();
    const parsed = AnimeVideosSchema.parse(data);
    setCache(url, parsed.data);
    return parsed.data;
  } catch (error) {
    console.error('Error fetching anime videos:', error);
    throw error;
  }
}

export async function getWatchPopularPromos(): Promise<{ data: Promo[] }> {
  try {
    const url = `${BASE_URL}/watch/promos/popular`;
    const cached = getFromCache<{ data: Promo[] }>(url);
    if (cached) return cached;

    const response = await fetchWithRetry(url);
    const data = await response.json();
    const parsed = WatchPromosResponseSchema.parse(data);
    setCache(url, { data: parsed.data });
    return { data: parsed.data };
  } catch (error) {
    console.error('Error fetching popular promos:', error);
    throw error;
  }
}

export async function getAnimeRecommendations(id: number): Promise<AnimeRecommendation[]> {
  try {
    const url = `${BASE_URL}/anime/${id}/recommendations`;
    const cached = getFromCache<AnimeRecommendation[]>(url);
    if (cached) return cached;

    const response = await fetchWithRetry(url);
    const data = await response.json();
    const parsed = AnimeRecommendationsResponseSchema.parse(data);
    setCache(url, parsed.data);
    return parsed.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
}

export async function getSeasonNow(): Promise<AnimeResponse> {
  try {
    const url = `${BASE_URL}/seasons/now`;
    const cached = getFromCache<AnimeResponse>(url);
    if (cached) return cached;

    const response = await fetchWithRetry(url);
    const data = await response.json();
    const parsed = AnimeResponseSchema.parse(data);
    setCache(url, parsed);
    return parsed;
  } catch (error) {
    console.error('Error fetching current season:', error);
    throw error;
  }
}

export async function getAnimeEpisodes(id: number, page = 1): Promise<AnimeEpisodesResponse> {
  try {
    const url = `${BASE_URL}/anime/${id}/episodes?page=${page}`;
    const cached = getFromCache<AnimeEpisodesResponse>(url);
    if (cached) return cached;

    const response = await fetchWithRetry(url);
    const data = await response.json();
    const parsed = AnimeEpisodesResponseSchema.parse(data);
    setCache(url, parsed);
    return parsed;
  } catch (error) {
    console.error('Error fetching anime episodes:', error);
    throw error;
  }
}

export async function getAnimeReviews(id: number, page = 1): Promise<{ data: AnimeReview[]; pagination: { has_next_page: boolean } }> {
  try {
    const url = `${BASE_URL}/anime/${id}/reviews?page=${page}`;
    const cached = getFromCache<{ data: AnimeReview[]; pagination: { has_next_page: boolean } }>(url);
    if (cached) return cached;

    const response = await fetchWithRetry(url);
    const data = await response.json();
    const parsed = AnimeReviewsResponseSchema.parse(data);
    setCache(url, { 
      data: parsed.data,
      pagination: {
        has_next_page: parsed.pagination.has_next_page
      }
    });
    return { 
      data: parsed.data,
      pagination: {
        has_next_page: parsed.pagination.has_next_page
      }
    };
  } catch (error) {
    console.error('Error fetching anime reviews:', error);
    throw error;
  }
}