"use client";

import { useState } from 'react';
import { Mail, Gift, Bell, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface NewsletterSignupProps {
  variant?: 'default' | 'footer' | 'popup';
  showBenefits?: boolean;
  className?: string;
}

const benefits = [
  {
    icon: Gift,
    title: 'Exclusive Deals',
    description: 'Get access to member-only discounts and early sales',
  },
  {
    icon: Bell,
    title: 'New Arrivals',
    description: 'Be the first to know about our latest collections',
  },
  {
    icon: Star,
    title: 'Style Tips',
    description: 'Receive personalized recommendations and styling advice',
  },
];

export function NewsletterSignup({ 
  variant = 'default', 
  showBenefits = true, 
  className 
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Successfully subscribed!",
      description: "Welcome to the HappyFeet family. Check your email for a welcome gift!",
    });
    
    setEmail('');
    setIsLoading(false);
  };

  if (variant === 'footer') {
    return (
      <div className={cn("text-center", className)}>
        <h3 className="font-semibold text-lg mb-2">Stay in the Loop</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Subscribe for exclusive deals and new arrivals
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Join Our Newsletter</CardTitle>
        <p className="text-muted-foreground">
          Get exclusive access to deals, new arrivals, and style inspiration
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {showBenefits && (
          <div className="grid grid-cols-1 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{benefit.title}</h4>
                  <p className="text-xs text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Subscribing...
              </>
            ) : (
              <>
                Subscribe Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            🎁 Welcome gift included
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">
            Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}