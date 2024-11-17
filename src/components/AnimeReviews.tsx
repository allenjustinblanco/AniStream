import { useEffect, useState } from 'react';
import { getAnimeReviews, type AnimeReview } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, ThumbsUp, MessageCircle } from 'lucide-react';

interface AnimeReviewsProps {
  animeId: number;
}

export function AnimeReviews({ animeId }: AnimeReviewsProps) {
  const [reviews, setReviews] = useState<AnimeReview[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchReviews() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAnimeReviews(animeId, page);
        
        if (isMounted) {
          setReviews(prev => [...prev, ...data.data]);
          setHasMore(data.pagination.has_next_page);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load reviews. Please try again later.');
          console.error('Error fetching reviews:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [animeId, page]);

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.mal_id}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage 
                src={review.user.images?.webp?.image_url || review.user.images?.jpg?.image_url} 
              />
              <AvatarFallback>
                {review.user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{review.user.username}</span>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    {review.reactions?.overall || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    Score: {review.score}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">
              {review.review}
            </p>
          </CardContent>
        </Card>
      ))}

      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setPage(p => p + 1)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Reviews'
            )}
          </Button>
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <Card>
          <CardContent className="text-center py-8 text-muted-foreground">
            No reviews yet. Be the first to review!
          </CardContent>
        </Card>
      )}
    </div>
  );
}