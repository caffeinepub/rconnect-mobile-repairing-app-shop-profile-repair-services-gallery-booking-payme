import { useState } from 'react';
import { Star, MessageSquare, User, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGetAllReviews, useSubmitReview } from '@/hooks/useReviews';
import { formatDateTime } from '@/utils/time';
import { toast } from 'sonner';

export default function ReviewsPage() {
  const { data: reviews = [], isLoading } = useGetAllReviews();
  const submitReview = useSubmitReview();

  const [formData, setFormData] = useState({
    name: '',
    rating: '5',
    reviewText: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!formData.reviewText.trim()) {
      newErrors.reviewText = 'Please write your review';
    } else if (formData.reviewText.trim().length < 10) {
      newErrors.reviewText = 'Review must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      await submitReview.mutateAsync({
        author: formData.name.trim(),
        reviewText: formData.reviewText.trim(),
      });

      toast.success('Thank you for your review!');
      setFormData({ name: '', rating: '5', reviewText: '' });
      setErrors({});
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    }
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < count ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Customer Reviews
          </h1>
          <p className="text-muted-foreground text-lg">
            See what our customers say about our service
          </p>
        </div>

        {/* Submit Review Form */}
        <Card className="mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Share Your Experience
            </CardTitle>
            <CardDescription>
              We'd love to hear about your experience with our service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Rating Field */}
              <div className="space-y-3">
                <Label>Rating *</Label>
                <RadioGroup
                  value={formData.rating}
                  onValueChange={(value) => setFormData({ ...formData, rating: value })}
                  className="flex flex-wrap gap-4"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <RadioGroupItem value={String(rating)} id={`rating-${rating}`} />
                      <Label
                        htmlFor={`rating-${rating}`}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        {renderStars(rating)}
                        <span className="text-sm text-muted-foreground">
                          ({rating} {rating === 1 ? 'star' : 'stars'})
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Review Text Field */}
              <div className="space-y-2">
                <Label htmlFor="reviewText">Your Review *</Label>
                <Textarea
                  id="reviewText"
                  placeholder="Tell us about your experience..."
                  value={formData.reviewText}
                  onChange={(e) => {
                    setFormData({ ...formData, reviewText: e.target.value });
                    if (errors.reviewText) setErrors({ ...errors, reviewText: '' });
                  }}
                  rows={4}
                  className={errors.reviewText ? 'border-destructive' : ''}
                />
                {errors.reviewText && (
                  <p className="text-sm text-destructive">{errors.reviewText}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Minimum 10 characters
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={submitReview.isPending}
              >
                {submitReview.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-amber-500" />
            Customer Feedback
            {reviews.length > 0 && (
              <span className="text-muted-foreground text-lg font-normal">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : reviews.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="pt-6">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground text-lg">
                  No reviews yet. Be the first to share your experience!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {reviews.map((review, index) => (
                <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                          {review.author.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              {review.author}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDateTime(review.timeStamp)}
                            </p>
                          </div>
                          {renderStars(5)}
                        </div>
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap break-words">
                          {review.reviewText}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
