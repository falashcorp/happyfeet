"use client";

import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Filter, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProductReviewsProps {
  productId: string;
}

// Mock review data - in a real app, this would come from your database
const mockReviews = [
  {
    id: '1',
    user: 'Sarah M.',
    rating: 5,
    title: 'Absolutely love these shoes!',
    content: 'Perfect fit, great quality, and super comfortable. I\'ve been wearing them daily for 3 months and they still look brand new. Highly recommend!',
    date: '2024-01-15',
    verified: true,
    helpful: 12,
    notHelpful: 1,
    size: '8',
    fit: 'True to size',
  },
  {
    id: '2',
    user: 'Mike R.',
    rating: 4,
    title: 'Great shoes, minor sizing issue',
    content: 'Really comfortable and well-made shoes. Only issue is they run slightly small, so I\'d recommend going up half a size. Otherwise, excellent quality.',
    date: '2024-01-10',
    verified: true,
    helpful: 8,
    notHelpful: 2,
    size: '10',
    fit: 'Runs small',
  },
  {
    id: '3',
    user: 'Emma L.',
    rating: 5,
    title: 'Perfect for daily wear',
    content: 'These shoes are incredibly comfortable for long days on my feet. The cushioning is excellent and the style goes with everything. Worth every penny!',
    date: '2024-01-08',
    verified: false,
    helpful: 15,
    notHelpful: 0,
    size: '7.5',
    fit: 'True to size',
  },
  {
    id: '4',
    user: 'David K.',
    rating: 3,
    title: 'Good but not great',
    content: 'Decent shoes for the price. Comfortable enough but the material feels a bit cheap. They\'re okay for casual wear but I wouldn\'t use them for sports.',
    date: '2024-01-05',
    verified: true,
    helpful: 5,
    notHelpful: 3,
    size: '9',
    fit: 'True to size',
  },
  {
    id: '5',
    user: 'Lisa T.',
    rating: 5,
    title: 'Exceeded expectations!',
    content: 'I was hesitant to order online but these shoes are amazing! The quality is top-notch and they\'re so comfortable. Fast shipping too. Will definitely order again.',
    date: '2024-01-03',
    verified: true,
    helpful: 20,
    notHelpful: 1,
    size: '6.5',
    fit: 'True to size',
  },
];

const ratingDistribution = [
  { stars: 5, count: 85, percentage: 68 },
  { stars: 4, count: 25, percentage: 20 },
  { stars: 3, count: 10, percentage: 8 },
  { stars: 2, count: 3, percentage: 2 },
  { stars: 1, count: 2, percentage: 2 },
];

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, 'helpful' | 'not-helpful' | null>>({});

  const averageRating = 4.5;
  const totalReviews = 125;

  const handleHelpfulVote = (reviewId: string, type: 'helpful' | 'not-helpful') => {
    setHelpfulVotes(prev => ({
      ...prev,
      [reviewId]: prev[reviewId] === type ? null : type
    }));
  };

  const filteredReviews = mockReviews.filter(review => {
    if (filterBy === 'all') return true;
    if (filterBy === 'verified') return review.verified;
    if (filterBy === '5-star') return review.rating === 5;
    if (filterBy === '4-star') return review.rating === 4;
    if (filterBy === '3-star') return review.rating === 3;
    if (filterBy === '2-star') return review.rating === 2;
    if (filterBy === '1-star') return review.rating === 1;
    return true;
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">
                {averageRating}
              </div>
              <div className="flex items-center justify-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <p className="text-muted-foreground">
                Based on {totalReviews} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-2">
                  <span className="text-sm w-8">{rating.stars}★</span>
                  <Progress value={rating.percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-8">
                    {rating.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter reviews" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reviews</SelectItem>
            <SelectItem value="verified">Verified Only</SelectItem>
            <SelectItem value="5-star">5 Star</SelectItem>
            <SelectItem value="4-star">4 Star</SelectItem>
            <SelectItem value="3-star">3 Star</SelectItem>
            <SelectItem value="2-star">2 Star</SelectItem>
            <SelectItem value="1-star">1 Star</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.user}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div>Size: {review.size}</div>
                  <div>Fit: {review.fit}</div>
                </div>
              </div>

              <h4 className="font-semibold mb-2">{review.title}</h4>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {review.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Was this helpful?
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={helpfulVotes[review.id] === 'helpful' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleHelpfulVote(review.id, 'helpful')}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {review.helpful + (helpfulVotes[review.id] === 'helpful' ? 1 : 0)}
                    </Button>
                    <Button
                      variant={helpfulVotes[review.id] === 'not-helpful' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleHelpfulVote(review.id, 'not-helpful')}
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      {review.notHelpful + (helpfulVotes[review.id] === 'not-helpful' ? 1 : 0)}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">
          Load More Reviews
        </Button>
      </div>
    </div>
  );
}