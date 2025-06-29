"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShoppingBag, Heart, Star, Truck, Shield, RotateCcw, Share2, Ruler, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';
import { ProductGallery } from '@/components/ui/product-gallery';
import { ProductReviews } from '@/components/ui/product-reviews';
import { WishlistButton } from '@/components/ui/wishlist-button';
import { StockIndicator } from '@/components/ui/stock-indicator';
import { SizeGuide } from '@/components/ui/size-guide';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  sku: string;
  inventory_quantity: number;
  images: string[];
  features: string[];
  is_featured: boolean;
  is_active: boolean;
  category: {
    name: string;
    slug: string;
  };
}

// Required for static export
export async function generateStaticParams() {
  try {
    const { data: products } = await supabase
      .from('products')
      .select('id')
      .eq('is_active', true);

    if (!products) return [];

    return products.map((product) => ({
      productId: product.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            name,
            slug
          )
        `)
        .eq('id', productId)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        notFound();
        return;
      }

      setProduct({
        ...data,
        category: data.categories || { name: 'Uncategorized', slug: 'uncategorized' }
      });
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        sku: product.sku,
      });
    }

    // Reset quantity after adding to cart
    setQuantity(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-32"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const discount = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const sizes = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">
            Products
          </Link>
          <span>/</span>
          <Link href={`/categories/${product.category.slug}`} className="hover:text-foreground">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <ProductGallery 
              images={product.images} 
              productName={product.name}
              discount={discount}
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category.name}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.0) • 127 reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.compare_at_price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Indicator */}
            <StockIndicator quantity={product.inventory_quantity} />

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Size</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-primary hover:text-primary/80"
                >
                  <Ruler className="h-4 w-4 mr-1" />
                  Size Guide
                </Button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className="h-10"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="quantity" className="text-sm font-medium">
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-border rounded-md px-3 py-1 bg-background"
                  >
                    {Array.from({ length: Math.min(10, product.inventory_quantity) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.inventory_quantity === 0 || !selectedSize}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <WishlistButton productId={product.id} />
                <Button size="lg" variant="outline">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              {!selectedSize && (
                <p className="text-sm text-muted-foreground">
                  Please select a size to add to cart
                </p>
              )}
            </div>

            {/* Product Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium text-sm mb-1">Free Shipping</h4>
                  <p className="text-xs text-muted-foreground">On orders over $100</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium text-sm mb-1">30-Day Returns</h4>
                  <p className="text-xs text-muted-foreground">Easy returns policy</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium text-sm mb-1">Warranty</h4>
                  <p className="text-xs text-muted-foreground">1-year warranty</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="care">Care Instructions</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Product Description</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {product.description}
                  </p>
                  
                  {product.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Key Features</h4>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">SKU:</span>
                        <span className="font-medium">{product.sku}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium">{product.category.name}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Material:</span>
                        <span className="font-medium">Premium Leather</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Sole Type:</span>
                        <span className="font-medium">Rubber</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Weight:</span>
                        <span className="font-medium">1.2 lbs</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Origin:</span>
                        <span className="font-medium">Made in Italy</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Heel Height:</span>
                        <span className="font-medium">1 inch</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Width:</span>
                        <span className="font-medium">Medium (D)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="care" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Care Instructions</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Cleaning</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Wipe with a damp cloth to remove surface dirt</li>
                        <li>• Use leather cleaner for deeper cleaning</li>
                        <li>• Allow to air dry naturally</li>
                        <li>• Avoid direct heat or sunlight</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Storage</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Store in a cool, dry place</li>
                        <li>• Use shoe trees to maintain shape</li>
                        <li>• Keep away from moisture</li>
                        <li>• Rotate wear to extend lifespan</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Maintenance</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Apply leather conditioner monthly</li>
                        <li>• Polish regularly to maintain shine</li>
                        <li>• Replace laces when worn</li>
                        <li>• Professional cleaning recommended annually</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <ProductReviews productId={product.id} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Size Guide Modal */}
        {showSizeGuide && (
          <SizeGuide 
            isOpen={showSizeGuide}
            onClose={() => setShowSizeGuide(false)}
            category={product.category.name}
          />
        )}
      </div>
    </div>
  );
}