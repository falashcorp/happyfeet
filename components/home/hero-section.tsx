"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const heroSlides = [
  {
    id: 1,
    title: "Step Into Excellence",
    subtitle: "Discover Premium Athletic Footwear",
    description: "Experience the perfect blend of style, comfort, and performance with our curated collection of premium athletic shoes.",
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    cta: "Shop Athletic",
    href: "/categories/athletic-shoes",
  },
  {
    id: 2,
    title: "Urban Style Redefined",
    subtitle: "Casual Sneakers for Every Occasion",
    description: "From street style to casual elegance, find the perfect sneakers that complement your lifestyle and express your personality.",
    image: "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg",
    cta: "Explore Casual",
    href: "/categories/casual-sneakers",
  },
  {
    id: 3,
    title: "Professional Elegance",
    subtitle: "Formal Shoes for the Modern Executive",
    description: "Make a lasting impression with our collection of sophisticated formal shoes crafted for the discerning professional.",
    image: "https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg",
    cta: "Shop Formal",
    href: "/categories/formal-shoes",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === currentSlide ? "opacity-100" : "opacity-0"
            )}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm sm:text-base font-medium text-white/80 mb-4 animate-fade-in">
            {currentHero.subtitle}
          </h2>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up">
            {currentHero.title}
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-delay">
            {currentHero.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
              <Link href={currentHero.href}>
                {currentHero.cta}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              className="text-white border-white hover:bg-white/10"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <Play className={cn("mr-2 h-4 w-4", !isPlaying && "opacity-50")} />
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50"
              )}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="flex flex-col items-center text-white/70">
          <span className="text-sm mb-2 rotate-90 origin-center">Scroll</span>
          <div className="w-px h-8 bg-white/30"></div>
        </div>
      </div>
    </section>
  );
}