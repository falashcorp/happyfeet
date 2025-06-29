"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Grid, List, ShoppingBag, Heart, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  images: string[];
  features: string[];
  is_featured: boolean;
  category: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
}

// Generate static params for all category slugs
export async function generateStaticParams() {
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('slug');

    if (!categories) return [];

    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      if (!slug) return;

      // Fetch category by slug
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (categoryError || !categoryData) {
        notFound();
        return;
      }

      setCategory(categoryData);

      // Fetch products for this category
      let query = supabase
        .from('products')
        .select(`
          *,
          categories:category_id (
            name,
            slug
          )
        `)
        .eq('category_id', categoryData.id)
        .eq('is_active', true);

      const { data: productsData } = await query.order(sortBy);

      if (productsData) {
        setProducts(productsData.map(product => ({
          ...product,
          category: product.categories || { name: categoryData.name, slug: categoryData.slug }
        })));
      }

      setLoading(false);
    };

    fetchCategoryAndProducts();
  }, [slug, sortBy]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      sku: product.id,
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
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

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Products
            </Link>
          </Button>
          <span>/</span>
          <Link href="/categories" className="hover:text-foreground">
            Categories
          </Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden mb-6">
            <Image
              src={category.image_url || '/placeholder-category.jpg'}
              alt={category.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  {category.name}
                </h1>
                <p className="text-lg text-white/90 max-w-2xl">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="price desc">Price: High to Low</SelectItem>
                <SelectItem value="created_at desc">Newest First</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Products Grid */}
        <div className={cn(
          "grid gap-6 mb-12",
          viewMode === 'grid' 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" 
            : "grid-cols-1"
        )}>
          {filteredProducts.map((product) => (
            <Card 
              key={product.id}
              className={cn(
                "group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300",
                viewMode === 'grid' ? "hover:-translate-y-1" : "",
                viewMode === 'list' ? "flex-row" : ""
              )}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <CardContent className={cn("p-0", viewMode === 'list' ? "flex" : "")}>
                <div className={cn(
                  "relative overflow-hidden bg-muted",
                  viewMode === 'grid' ? "aspect-square" : "w-48 h-48"
                )}>
                  <Image
                    src={product.images[0] || '/placeholder-shoe.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.compare_at_price && product.compare_at_price > product.price && (
                    <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                      Save ${(product.compare_at_price - product.price).toFixed(2)}
                    </Badge>
                  )}
                  
                  <div className={cn(
                    "absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300",
                    hoveredProduct === product.id ? "opacity-100" : "opacity-0"
                  )}>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.category.name}
                    </Badge>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3 w-3",
                            i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors mb-2">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
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
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className={cn(
                        "transition-opacity",
                        viewMode === 'grid' 
                          ? "opacity-0 group-hover:opacity-100" 
                          : "opacity-100"
                      )}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No products found in this category.
            </p>
            <Button asChild>
              <Link href="/products">
                Browse All Products
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}