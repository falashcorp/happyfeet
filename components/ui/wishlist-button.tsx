"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export function WishlistButton({ productId, size = 'lg', variant = 'outline' }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsInWishlist(wishlist.includes(productId));
  }, [productId]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter((id: string) => id !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
      
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
    } else {
      // Add to wishlist
      const updatedWishlist = [...wishlist, productId];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      setIsInWishlist(true);
      
      toast({
        title: "Added to Wishlist",
        description: "Item has been added to your wishlist.",
      });
    }

    // Dispatch custom event for header to update count
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  return (
    <Button
      size={size === 'sm' ? 'icon' : 'lg'}
      variant={variant}
      onClick={toggleWishlist}
      className={cn(
        "transition-colors",
        isInWishlist && "text-red-500 hover:text-red-600"
      )}
    >
      <Heart 
        className={cn(
          size === 'sm' ? "h-4 w-4" : "h-4 w-4",
          isInWishlist && "fill-current"
        )} 
      />
      {size === 'lg' && <span className="sr-only">Add to wishlist</span>}
    </Button>
  );
}