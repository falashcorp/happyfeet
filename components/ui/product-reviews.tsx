"use client";

import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ProductReviewsProps {
  productId: string;
}

// Mock review data - in a real app, this would come from your database
const mockReviews = [
  {
    id: '1',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      verified: true,
    },
    rating: 5,
    title: 'Excellent quality and comfort!',
    content: 'These shoes exceeded my expectations. The comfort level is outstanding, and the quality of materials is top-notch. I\'ve been wearing them daily for 3 months and they still look brand new.',
    date: '2024-01-15',
    helpful: 12,
    size: '8',
    fit: 'True to size',
    images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'],
  },
  {
    id: '2',
    user: {
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      verified: true,
    },
    rating: 4,
    title: 'Great shoes, runs slightly large',
    content: 'Love the style and comfort of these shoes. Only issue is they run about half a size large, so I\'d recommend sizing down. Otherwise, fantastic quality.',
    date: '2024-01-10',
    helpful: 8,
    size: '10',
    fit: 'Runs large',
  },
  {
    id: '3',
    user: {
      name: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
      verified: false,
    },
    rating: 5,
    title: 'Perfect for daily wear',
    content: 'I work on my feet all day and these shoes provide excellent support. The cushioning is amazing and my feet don\'t hurt at the end of the day.',
    date: '2024-01-05',
    helpful: 15,
    size: '7.5',
    fit: 'True to size',
  },
  {
    id: '4',
    user: {
      name: 'David Rodriguez',
      avatar: null,
      verified: true,
    },
    rating: 3,
    title: 'Good but not great',
    content: 'Decent shoes for the price. The style is nice but I expected better durability. After 2 months of regular use, they\'re showing some wear.',
    date: '2024-01-01',
    helpful: 3,
    size: '9.5',
    fit: 'True to size',
  },
];

const ratingDistribution = [
  { stars: 5, count: 45, percentage: 60 },
  { stars: 4, count: 20, percentage: 27 },
  { stars: 3, count: 7, percentage: 9 },
  { stars: 2, count: 2, percentage: 3 },
  { stars: 1, count: 1, percentage: 1 },
];

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    content: '',
    size: '',
    fit: '',
  });

  const totalReviews = ratingDistribution.reduce((sum, item) => sum + item.count, 0);
  const averageRating = ratingDistribution.reduce((sum, item) => sum + (item.stars * item.count), 0) / totalReviews;

  const filteredReviews = mockReviews
    .filter(review => filterRating === 'all' || review.rating.toString() === filterRating)
    .sort((a, b) => {
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

  const handleSubmitReview = () => {
    // In a real app, this would submit to your API
    console.log('Submitting review:', newReview);
    setShowWriteReview(false);
    setNewReview({ rating: 0, title: '', content: '', size: '', fit: '' });
  };

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            <Button onClick={() => setShowWriteReview(!showWriteReview)}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Write Review
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
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
              <p className="text-muted-foreground">Based on {totalReviews} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-2">
                  <span className="text-sm w-8">{item.stars}★</span>
                  <Progress value={item.percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Write Review Form */}
      {showWriteReview && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="review-rating">Rating *</Label>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                      className="p-1"
                    >
                      <Star
                        className={cn(
                          "h-6 w-6 transition-colors",
                          i < newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-400"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review-size">Size Purchased</Label>
                <Select value={newReview.size} onValueChange={(value) => setNewReview({ ...newReview, size: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'].map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="review-title">Review Title *</Label>
                <Input
                  id="review-title"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Summarize your experience"
                />
              </div>
              <div>
                <Label htmlFor="review-fit">How does it fit?</Label>
                <Select value={newReview.fit} onValueChange={(value) => setNewReview({ ...newReview, fit: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="runs-small">Runs small</SelectItem>
                    <SelectItem value="true-to-size">True to size</SelectItem>
                    <SelectItem value="runs-large">Runs large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="review-content">Your Review *</Label>
              <Textarea
                id="review-content"
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                placeholder="Tell others about your experience with this product"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitReview} disabled={!newReview.rating || !newReview.title || !newReview.content}>
                Submit Review
              </Button>
              <Button variant="outline" onClick={() => setShowWriteReview(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ratings</SelectItem>
              <SelectItem value="5">5 stars</SelectItem>
              <SelectItem value="4">4 stars</SelectItem>
              <SelectItem value="3">3 stars</SelectItem>
              <SelectItem value="2">2 stars</SelectItem>
              <SelectItem value="1">1 star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="highest">Highest rated</SelectItem>
            <SelectItem value="lowest">Lowest rated</SelectItem>
            <SelectItem value="helpful">Most helpful</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.user.avatar || undefined} />
                  <AvatarFallback>{review.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.user.name}</span>
                    {review.user.verified && (
                      <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
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
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Size: {review.size}</span>
                      <span>Fit: {review.fit}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">{review.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{review.content}</p>
                  </div>

                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2">
                      {review.images.map((image, index) => (
                        <div key={index} className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                          <img src={image} alt={`Review image ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="mr-1 h-3 w-3" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="mr-1 h-3 w-3" />
                      Not helpful
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No reviews found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}