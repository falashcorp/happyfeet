"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export function WishlistButton({ 
  productId, 
  size = 'lg', 
  variant = 'outline',
  className 
}: WishlistButtonProps) {
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
        description: "Item has been saved to your wishlist.",
      });
    }

    // Dispatch custom event for header to update count
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleWishlist}
      className={cn(className)}
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          size === 'icon' ? "" : "mr-2",
          isInWishlist && "fill-current text-red-500"
        )} 
      />
      {size !== 'icon' && (isInWishlist ? 'Saved' : 'Save')}
    </Button>
  );
}