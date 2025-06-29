"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface WishlistButtonProps {
  productId: string;
  productName: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
}

export function WishlistButton({ 
  productId, 
  productName, 
  className, 
  size = 'md',
  variant = 'ghost' 
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if product is in wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsInWishlist(wishlist.includes(productId));
  }, [productId]);

  const toggleWishlist = async () => {
    setIsLoading(true);
    
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      if (isInWishlist) {
        // Remove from wishlist
        const updatedWishlist = wishlist.filter((id: string) => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setIsInWishlist(false);
        
        toast({
          title: "Removed from Wishlist",
          description: `${productName} has been removed from your wishlist.`,
        });
      } else {
        // Add to wishlist
        const updatedWishlist = [...wishlist, productId];
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setIsInWishlist(true);
        
        toast({
          title: "Added to Wishlist",
          description: `${productName} has been added to your wishlist.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <Button
      variant={variant}
      size="icon"
      className={cn(
        sizeClasses[size],
        "transition-all duration-200",
        isInWishlist && "text-red-500 hover:text-red-600",
        className
      )}
      onClick={toggleWishlist}
      disabled={isLoading}
    >
      <Heart 
        className={cn(
          iconSizes[size],
          "transition-all duration-200",
          isInWishlist && "fill-current"
        )} 
      />
    </Button>
  );
}