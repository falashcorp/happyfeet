"use client";

import { useState } from 'react';
import { Mail, Gift, Truck, Star, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    description: 'Get 10% off your first order and access to member-only sales',
  },
  {
    icon: Truck,
    title: 'Early Access',
    description: 'Be the first to shop new arrivals and limited collections',
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubscribed(true);
    setIsSubmitting(false);
    
    toast({
      title: "Welcome to HappyFeet!",
      description: "You've successfully subscribed to our newsletter. Check your email for a welcome discount!",
    });

    // Reset after showing success
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail('');
    }, 3000);
  };

  if (variant === 'footer') {
    return (
      <div className={cn("text-center", className)}>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Stay in the Loop
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get exclusive deals and new arrivals delivered to your inbox
        </p>
        
        {isSubscribed ? (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Successfully subscribed!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        )}
      </div>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Join the HappyFeet Family</CardTitle>
        <CardDescription>
          Subscribe to our newsletter and never miss out on exclusive deals, 
          new arrivals, and style inspiration.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {showBenefits && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-muted/50">
                <benefit.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold text-sm mb-1">{benefit.title}</h4>
                <p className="text-xs text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        )}

        {isSubscribed ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Welcome to HappyFeet!
            </h3>
            <p className="text-muted-foreground">
              Check your email for a special welcome discount code.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                🎉 Get 10% off your first order
              </Badge>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3">
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
              
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Subscribe & Save 10%
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center">
              By subscribing, you agree to receive marketing emails from HappyFeet. 
              You can unsubscribe at any time.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}