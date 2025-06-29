"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  images: string[];
  inventory_quantity: number;
  category: {
    name: string;
    slug: string;
  };
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchWishlistItems = async () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      if (wishlist.length === 0) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            name,
            slug
          )
        `)
        .in('id', wishlist)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching wishlist items:', error);
      } else {
        setWishlistItems(data?.map(product => ({
          ...product,
          category: product.categories || { name: 'Uncategorized', slug: 'uncategorized' }
        })) || []);
      }
      setLoading(false);
    };

    fetchWishlistItems();
  }, []);

  const removeFromWishlist = (productId: string) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const updatedWishlist = wishlist.filter((id: string) => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    
    // Dispatch custom event for header to update count
    window.dispatchEvent(new Event('wishlistUpdated'));
    
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const addToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      sku: product.id,
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const moveAllToCart = () => {
    wishlistItems.forEach(product => {
      if (product.inventory_quantity > 0) {
        addToCart(product);
      }
    });

    toast({
      title: "Items Added to Cart",
      description: `${wishlistItems.filter(p => p.inventory_quantity > 0).length} items have been added to your cart.`,
    });
  };

  const clearWishlist = () => {
    localStorage.setItem('wishlist', JSON.stringify([]));
    setWishlistItems([]);
    window.dispatchEvent(new Event('wishlistUpdated'));
    
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-32"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <div className="bg-muted rounded-lg h-64 mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-4">Your Wishlist is Empty</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Save items you love to your wishlist and never lose track of them again.
              </p>
              <Button asChild size="lg">
                <Link href="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Start Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                My Wishlist
              </h1>
              <p className="text-muted-foreground">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={moveAllToCart} disabled={wishlistItems.every(p => p.inventory_quantity === 0)}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add All to Cart
              </Button>
              <Button variant="outline" onClick={clearWishlist}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={product.images[0] || '/placeholder-shoe.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Remove from Wishlist Button */}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  {/* Discount Badge */}
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                      Save ${(product.compare_at_price - product.price).toFixed(2)}
                    </Badge>
                  )}

                  {/* Out of Stock Overlay */}
                  {product.inventory_quantity === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <Badge variant="secondary" className="text-xs mb-2">
                    {product.category.name}
                  </Badge>

                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors mb-2">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-foreground">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.compare_at_price && product.compare_at_price > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.compare_at_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => addToCart(product)}
                      disabled={product.inventory_quantity === 0}
                    >
                      <ShoppingBag className="mr-2 h-3 w-3" />
                      {product.inventory_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      <Heart className="h-3 w-3 fill-current" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for recommended products */}
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}