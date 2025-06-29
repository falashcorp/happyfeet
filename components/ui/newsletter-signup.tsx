"use client";

import { useState } from 'react';
import { Mail, Gift, Bell, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface NewsletterSignupProps {
  variant?: 'inline' | 'modal' | 'footer';
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
    icon: Bell,
    title: 'New Arrivals',
    description: 'Be the first to know about new collections and limited editions',
  },
  {
    icon: Mail,
    title: 'Style Tips',
    description: 'Receive personalized recommendations and styling advice',
  },
];

export function NewsletterSignup({ 
  variant = 'inline', 
  showBenefits = true, 
  className 
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferences, setPreferences] = useState({
    email: true,
    whatsapp: false,
    sms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (preferences.whatsapp && !phone) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your WhatsApp number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store subscription data
      const subscriptionData = {
        email,
        phone: preferences.whatsapp ? phone : null,
        preferences,
        subscribedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('newsletter_subscription', JSON.stringify(subscriptionData));
      
      setIsSubscribed(true);
      
      toast({
        title: "Successfully Subscribed!",
        description: "Welcome to the HappyFeet family. Check your email for a welcome gift!",
      });
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">You're All Set!</h3>
          <p className="text-muted-foreground mb-4">
            Thank you for subscribing. Check your email for a special welcome offer!
          </p>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            10% OFF Welcome Code: WELCOME10
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Mail className="h-5 w-5" />
          Stay Connected
        </CardTitle>
        <CardDescription>
          Join our community for exclusive deals, new arrivals, and style inspiration
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {showBenefits && (
          <div className="grid grid-cols-1 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
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
          <div>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">How would you like to hear from us?</p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email-pref"
                  checked={preferences.email}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, email: checked as boolean }))
                  }
                />
                <label htmlFor="email-pref" className="text-sm">
                  Email newsletters and promotions
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whatsapp-pref"
                  checked={preferences.whatsapp}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, whatsapp: checked as boolean }))
                  }
                />
                <label htmlFor="whatsapp-pref" className="text-sm">
                  WhatsApp updates and exclusive offers
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms-pref"
                  checked={preferences.sms}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, sms: checked as boolean }))
                  }
                />
                <label htmlFor="sms-pref" className="text-sm">
                  SMS notifications for order updates
                </label>
              </div>
            </div>
          </div>

          {(preferences.whatsapp || preferences.sms) && (
            <div>
              <Input
                type="tel"
                placeholder="WhatsApp/Phone number (+237 6XX XXX XXX)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required={preferences.whatsapp || preferences.sms}
              />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Subscribe & Get 10% Off
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By subscribing, you agree to our Privacy Policy and Terms of Service. 
            You can unsubscribe at any time.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}