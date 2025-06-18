"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, MapPin, Phone, Mail, Clock, MessageCircle, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Our Store',
    details: ['Douala, Cameroon', 'Akwa District', 'Near Central Market'],
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: ['+237 6XX XXX XXX', '+237 6YY YYY YYY', 'Mon-Sat 8AM-8PM'],
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: ['hello@happyfeet.cm', 'support@happyfeet.cm', 'We reply within 24h'],
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Clock,
    title: 'Store Hours',
    details: ['Mon-Fri: 8AM-8PM', 'Saturday: 9AM-6PM', 'Sunday: 10AM-4PM'],
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
];

const FloatingCard = ({ children, delay = 0, className = '' }: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string; 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "transform transition-all duration-1000 ease-out",
        isVisible 
          ? "translate-y-0 opacity-100 scale-100" 
          : "translate-y-8 opacity-0 scale-95",
        className
      )}
      style={{
        animation: isVisible ? `float 6s ease-in-out infinite ${delay}ms` : 'none',
      }}
    >
      {children}
    </div>
  );
};

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full animate-pulse" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-accent/20 to-primary/20 rotate-45 animate-spin" style={{ animationDuration: '20s' }} />
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full animate-bounce" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-40 w-24 h-24 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg rotate-12 animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-radial from-primary/10 to-transparent rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-radial from-secondary/10 to-transparent rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
    </div>
  );
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: '',
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Hero Section */}
        <FloatingCard className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white">
              Get In Touch
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Let's Start a Conversation
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Have questions about our premium footwear? Need help finding the perfect pair? 
              We're here to help you step into happiness with personalized service and expert advice.
            </p>
          </div>
        </FloatingCard>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <FloatingCard key={index} delay={index * 200}>
              <Card
                className={cn(
                  "h-full transition-all duration-500 cursor-pointer border-0 shadow-lg hover:shadow-2xl",
                  "transform hover:-translate-y-2 hover:scale-105",
                  hoveredCard === index && "ring-2 ring-primary/50"
                )}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={cn(
                    "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-300",
                    info.bgColor,
                    hoveredCard === index && "scale-110 rotate-12"
                  )}>
                    <info.icon className={cn("h-8 w-8", info.color)} />
                  </div>
                  <CardTitle className="text-lg font-semibold">{info.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className={cn(
                      "text-sm mb-1",
                      idx === info.details.length - 1 ? "text-muted-foreground font-medium" : "text-foreground"
                    )}>
                      {detail}
                    </p>
                  ))}
                </CardContent>
              </Card>
            </FloatingCard>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <FloatingCard delay={400}>
            <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="transition-all duration-300 focus:scale-105"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                        className="transition-all duration-300 focus:scale-105"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Company (Optional)
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your company name"
                      className="transition-all duration-300 focus:scale-105"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      required
                      className="transition-all duration-300 focus:scale-105"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      required
                      className="transition-all duration-300 focus:scale-105 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform hover:scale-105"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </FloatingCard>

          {/* Map and Additional Info */}
          <FloatingCard delay={600}>
            <div className="space-y-6">
              {/* Map Placeholder */}
              <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Find Our Store</CardTitle>
                  <CardDescription>
                    Visit us in person for the full HappyFeet experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 animate-pulse"></div>
                    <div className="relative z-10 text-center">
                      <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Interactive Map Coming Soon</p>
                      <p className="text-xs text-muted-foreground mt-1">Douala, Cameroon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Quick Answers</CardTitle>
                  <CardDescription>
                    Common questions we receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Do you offer international shipping?</h4>
                    <p className="text-sm text-muted-foreground">
                      Currently, we ship within Cameroon. International shipping is coming soon!
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">What's your return policy?</h4>
                    <p className="text-sm text-muted-foreground">
                      We offer a 30-day return policy for unworn items in original packaging.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Do you have a size guide?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! Check our detailed size guide to find your perfect fit.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </FloatingCard>
        </div>

        {/* Call to Action */}
        <FloatingCard delay={800} className="text-center mt-16">
          <Card className="shadow-2xl border-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-sm">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Step Into Happiness?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Explore our premium collection of footwear and find the perfect pair for every occasion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                  Shop Now
                </Button>
                <Button size="lg" variant="outline">
                  View Catalog
                </Button>
              </div>
            </CardContent>
          </Card>
        </FloatingCard>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          50% { transform: translateY(-5px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(0.5deg); }
        }
      `}</style>
    </div>
  );
}