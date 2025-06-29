"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Share2, Truck, Shield, RotateCcw, Info, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductGallery } from '@/components/ui/product-gallery';
import { SizeGuide } from '@/components/ui/size-guide';
import { ProductReviews } from '@/components/ui/product-reviews';
import { WishlistButton } from '@/components/ui/wishlist-button';
import { StockIndicator } from '@/components/ui/stock-indicator';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

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

const productDetails = {
  materials: [
    'Premium leather upper',
    'Breathable mesh lining',
    'Cushioned EVA midsole',
    'Durable rubber outsole',
  ],
  care: [
    'Clean with damp cloth',
    'Air dry at room temperature',
    'Use leather conditioner monthly',
    'Store in dust bag when not in use',
  ],
  sizing: [
    'True to size fit',
    'Medium width (D)',
    'Half sizes available',
    'Runs slightly narrow for wide feet',
  ],
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
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

    if (!selectedSize) {
      alert('Please select a size before adding to cart');
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: `${product.name} (Size ${selectedSize})`,
        price: product.price,
        image: product.images[0] || '',
        sku: `${product.sku}-${selectedSize}`,
      });
    }

    setQuantity(1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
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
          <ProductGallery 
            images={product.images} 
            productName={product.name}
          />

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category.name}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              
              {/* Stock Indicator */}
              <StockIndicator 
                quantity={product.inventory_quantity}
                lowStockThreshold={10}
                showProgress={true}
                maxStock={100}
                className="mb-4"
              />
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.compare_at_price.toFixed(2)}
                  </span>
                  <Badge className="bg-destructive text-destructive-foreground">
                    Save {discount}%
                  </Badge>
                </>
              )}
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Size:</label>
                <SizeGuide 
                  selectedSize={selectedSize}
                  onSizeSelect={setSelectedSize}
                  category={product.category.slug}
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "border rounded-md py-2 px-3 text-sm font-medium transition-colors",
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    )}
                  >
                    {size}
                  </button>
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
                <WishlistButton 
                  productId={product.id}
                  productName={product.name}
                  size="lg"
                  variant="outline"
                />
                <Button size="lg" variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
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

        {/* Product Information Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Product Description</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                    
                    {product.features.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Key Features</h3>
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Materials
                    </h3>
                    <ul className="space-y-2">
                      {productDetails.materials.map((material, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {material}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Sizing Information
                    </h3>
                    <ul className="space-y-2">
                      {productDetails.sizing.map((info, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {info}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Care Instructions
                    </h3>
                    <ul className="space-y-2">
                      {productDetails.care.map((instruction, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {instruction}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SKU:</span>
                        <span className="font-medium">{product.sku}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium">{product.category.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Weight:</span>
                        <span className="font-medium">1.2 lbs</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Origin:</span>
                        <span className="font-medium">Made in Italy</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Warranty:</span>
                        <span className="font-medium">1 Year</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Availability:</span>
                        <span className={cn(
                          "font-medium",
                          product.inventory_quantity > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {product.inventory_quantity > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <ProductReviews
                productId={product.id}
                averageRating={4.2}
                totalReviews={75}
                reviews={[]}
              />
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Information
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <h4 className="font-medium">Standard Shipping (Free over $100)</h4>
                        <p className="text-muted-foreground">2-3 business days • $9.99</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Express Shipping</h4>
                        <p className="text-muted-foreground">1-2 business days • $19.99</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Same Day Delivery (Douala only)</h4>
                        <p className="text-muted-foreground">Order by 2 PM • $29.99</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <RotateCcw className="h-5 w-5" />
                      Return Policy
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <h4 className="font-medium">30-Day Returns</h4>
                        <p className="text-muted-foreground">Free returns on unworn items</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Easy Process</h4>
                        <p className="text-muted-foreground">Print return label from your account</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Refund Timeline</h4>
                        <p className="text-muted-foreground">5-7 business days after we receive your return</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}