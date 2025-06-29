"use client";

import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  notHelpful: number;
  size: string;
  fit: 'tight' | 'perfect' | 'loose';
  verified_purchase: boolean;
}

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

const mockReviews: Review[] = [
  {
    id: '1',
    user: {
      name: 'Sarah M.',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      verified: true,
    },
    rating: 5,
    title: 'Excellent quality and comfort!',
    content: 'These shoes exceeded my expectations. The comfort level is outstanding, and they look great with both casual and semi-formal outfits. The sizing was perfect based on the size guide.',
    date: '2024-01-15',
    helpful: 12,
    notHelpful: 1,
    size: '8',
    fit: 'perfect',
    verified_purchase: true,
  },
  {
    id: '2',
    user: {
      name: 'John D.',
      verified: true,
    },
    rating: 4,
    title: 'Great shoes, runs slightly large',
    content: 'Love the style and build quality. Only issue is they run about half a size large, so I would recommend sizing down. Otherwise, very satisfied with the purchase.',
    date: '2024-01-10',
    helpful: 8,
    notHelpful: 2,
    size: '10',
    fit: 'loose',
    verified_purchase: true,
  },
  {
    id: '3',
    user: {
      name: 'Marie K.',
      verified: true,
    },
    rating: 5,
    title: 'Perfect for daily wear',
    content: 'I wear these almost every day now. They\'re incredibly comfortable for long walks and the quality seems very durable. Highly recommend!',
    date: '2024-01-08',
    helpful: 15,
    notHelpful: 0,
    size: '7.5',
    fit: 'perfect',
    verified_purchase: true,
  },
];

const ratingDistribution = [
  { stars: 5, count: 45, percentage: 60 },
  { stars: 4, count: 20, percentage: 27 },
  { stars: 3, count: 8, percentage: 11 },
  { stars: 2, count: 2, percentage: 2 },
  { stars: 1, count: 0, percentage: 0 },
];

export function ProductReviews({ productId, averageRating, totalReviews }: ProductReviewsProps) {
  const [reviews] = useState<Review[]>(mockReviews);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    content: '',
    size: '',
    fit: 'perfect' as const,
  });

  const filteredReviews = reviews.filter(review => {
    if (filterRating === 'all') return true;
    return review.rating === parseInt(filterRating);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-foreground mb-2">
                {averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(averageRating), 'lg')}
              <p className="text-sm text-muted-foreground mt-2">
                Based on {totalReviews} reviews
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{dist.stars}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={dist.percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-8">
                    {dist.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button 
              onClick={() => setShowWriteReview(!showWriteReview)}
              className="flex-1 sm:flex-none"
            >
              Write a Review
            </Button>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="lowest">Lowest Rated</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review Form */}
      {showWriteReview && (
        <Card>
          <CardHeader>
            <CardTitle>Write Your Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 transition-colors",
                        i < newReview.rating 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-muted-foreground hover:text-yellow-400"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Size Purchased</label>
                <Select value={newReview.size} onValueChange={(value) => setNewReview({ ...newReview, size: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'].map(size => (
                      <SelectItem key={size} value={size}>US {size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">How did it fit?</label>
                <Select value={newReview.fit} onValueChange={(value: any) => setNewReview({ ...newReview, fit: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tight">Runs Small</SelectItem>
                    <SelectItem value="perfect">True to Size</SelectItem>
                    <SelectItem value="loose">Runs Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Review Title</label>
              <input
                type="text"
                placeholder="Summarize your experience"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Your Review</label>
              <Textarea
                placeholder="Tell others about your experience with this product..."
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button>Submit Review</Button>
              <Button variant="outline" onClick={() => setShowWriteReview(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.user.avatar} />
                  <AvatarFallback>
                    {review.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{review.user.name}</span>
                    {review.user.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                    {review.verified_purchase && (
                      <Badge variant="outline" className="text-xs">
                        Verified Purchase
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {renderStars(review.rating)}
                    <span className="text-sm text-muted-foreground">
                      Size: US {review.size}
                    </span>
                    <Badge 
                      variant={review.fit === 'perfect' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {review.fit === 'tight' ? 'Runs Small' : 
                       review.fit === 'perfect' ? 'True to Size' : 'Runs Large'}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">{review.title}</h4>
                    <p className="text-muted-foreground">{review.content}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ThumbsDown className="h-4 w-4" />
                      Not Helpful ({review.notHelpful})
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedReviews.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share your experience with this product.
            </p>
            <Button onClick={() => setShowWriteReview(true)}>
              Write the First Review
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}