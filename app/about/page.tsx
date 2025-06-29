"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Award, Users, Heart, Target, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const values = [
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Every decision we make is centered around delivering exceptional value and service to our customers.',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  {
    icon: Award,
    title: 'Quality Excellence',
    description: 'We source only the finest materials and work with skilled craftsmen to ensure every product meets our high standards.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Target,
    title: 'Innovation',
    description: 'We continuously seek new ways to improve comfort, style, and performance in every pair of shoes we offer.',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We believe in building lasting relationships with our customers and contributing positively to our local community.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
];

const milestones = [
  {
    year: '2020',
    title: 'Founded',
    description: 'HappyFeet was born from a passion for quality footwear and exceptional customer service.',
  },
  {
    year: '2021',
    title: 'First Store',
    description: 'Opened our flagship store in Douala, becoming a trusted local destination for premium footwear.',
  },
  {
    year: '2022',
    title: 'Online Launch',
    description: 'Expanded our reach with a comprehensive e-commerce platform, serving customers across Cameroon.',
  },
  {
    year: '2023',
    title: 'Premium Partnerships',
    description: 'Established partnerships with leading international brands to offer exclusive collections.',
  },
  {
    year: '2024',
    title: 'Innovation Hub',
    description: 'Launched our innovation center focused on sustainable materials and cutting-edge comfort technology.',
  },
];

const stats = [
  { number: '10,000+', label: 'Happy Customers' },
  { number: '500+', label: 'Premium Products' },
  { number: '50+', label: 'Brand Partners' },
  { number: '99%', label: 'Satisfaction Rate' },
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
    >
      {children}
    </div>
  );
};

export default function AboutPage() {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FloatingCard className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white">
              Our Story
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Step Into Our Journey
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              At HappyFeet, we believe that every step should be a step towards happiness. 
              Founded with a passion for quality footwear and exceptional customer service, 
              we've been helping people find their perfect pair since 2020.
            </p>
          </FloatingCard>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FloatingCard delay={200}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                <Image
                  src="https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg"
                  alt="HappyFeet store interior"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </FloatingCard>

            <FloatingCard delay={400}>
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To provide premium footwear that combines exceptional comfort, timeless style, 
                    and outstanding quality, while delivering personalized service that makes every 
                    customer feel valued and confident in their choice.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Our Vision</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To become Cameroon's most trusted footwear destination, known for our curated 
                    selection of premium brands, innovative comfort solutions, and unwavering 
                    commitment to customer satisfaction.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Button size="lg">
                    Shop Our Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Visit Our Store
                  </Button>
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FloatingCard className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do and shape the experience we create for our customers.
            </p>
          </FloatingCard>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <FloatingCard key={index} delay={index * 150}>
                <Card
                  className={cn(
                    "h-full transition-all duration-500 cursor-pointer border-0 shadow-sm hover:shadow-xl",
                    "transform hover:-translate-y-2 hover:scale-105",
                    hoveredValue === index && "ring-2 ring-primary/50"
                  )}
                  onMouseEnter={() => setHoveredValue(index)}
                  onMouseLeave={() => setHoveredValue(null)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={cn(
                      "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-300",
                      value.bgColor,
                      hoveredValue === index && "scale-110 rotate-12"
                    )}>
                      <value.icon className={cn("h-8 w-8", value.color)} />
                    </div>
                    <CardTitle className="text-xl font-bold">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FloatingCard className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These numbers represent the trust our customers place in us and our commitment to excellence.
            </p>
          </FloatingCard>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <FloatingCard key={index} delay={index * 100}>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FloatingCard className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From humble beginnings to becoming a trusted name in premium footwear.
            </p>
          </FloatingCard>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20"></div>

              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <FloatingCard key={index} delay={index * 200}>
                    <div className="relative flex items-start gap-6">
                      <div className="relative z-10 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {milestone.year.slice(-2)}
                      </div>
                      <div className="flex-1 bg-card rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary">{milestone.year}</Badge>
                          <h3 className="text-xl font-bold text-foreground">{milestone.title}</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </FloatingCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FloatingCard className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind HappyFeet who make every customer experience exceptional.
            </p>
          </FloatingCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Mbeki',
                role: 'Founder & CEO',
                image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
                description: 'Passionate about footwear and customer service with 15+ years in retail.',
              },
              {
                name: 'Jean-Paul Nkomo',
                role: 'Head of Operations',
                image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
                description: 'Ensures smooth operations and maintains our high quality standards.',
              },
              {
                name: 'Marie Fotso',
                role: 'Customer Experience Manager',
                image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
                description: 'Dedicated to making every customer interaction memorable and positive.',
              },
            ].map((member, index) => (
              <FloatingCard key={index} delay={index * 200}>
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-0">
                    <div className="relative aspect-square bg-muted">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                      <p className="text-primary font-medium mb-3">{member.role}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {member.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FloatingCard>
            <Card className="border-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 backdrop-blur-sm">
              <CardContent className="py-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Ready to Find Your Perfect Pair?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Experience the HappyFeet difference. Visit our store or browse our collection online 
                  to discover premium footwear that combines style, comfort, and quality.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                    Shop Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    Visit Store
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FloatingCard>
        </div>
      </section>
    </div>
  );
}