/*
  # HappyFeet E-commerce Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `image_url` (text)
      - `slug` (text, unique)
      - `created_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `compare_at_price` (decimal)
      - `sku` (text, unique)
      - `inventory_quantity` (integer)
      - `category_id` (uuid, foreign key)
      - `images` (jsonb array)
      - `features` (jsonb array)
      - `is_featured` (boolean)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `status` (text)
      - `total_amount` (decimal)
      - `shipping_address` (jsonb)
      - `billing_address` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `product_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price` (decimal)
      - `created_at` (timestamp)
    
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `avatar_url` (text)
      - `phone` (text)
      - `is_admin` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read public data
    - Add policies for users to manage their own orders
    - Add policies for admins to manage products and orders
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price decimal(10,2) NOT NULL DEFAULT 0,
  compare_at_price decimal(10,2) DEFAULT NULL,
  sku text UNIQUE NOT NULL,
  inventory_quantity integer DEFAULT 0,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  images jsonb DEFAULT '[]'::jsonb,
  features jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestampz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount decimal(10,2) NOT NULL DEFAULT 0,
  shipping_address jsonb DEFAULT '{}'::jsonb,
  billing_address jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  price decimal(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  avatar_url text DEFAULT '',
  phone text DEFAULT '',
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Products policies
CREATE POLICY "Active products are viewable by everyone"
  ON products FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Only admins can manage products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Order items policies
CREATE POLICY "Users can view order items for their orders"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all order items"
  ON order_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = true
    )
  );

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample data
INSERT INTO categories (name, description, slug, image_url) VALUES
  ('Athletic Shoes', 'High-performance athletic footwear for sports and fitness', 'athletic-shoes', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'),
  ('Casual Sneakers', 'Comfortable everyday sneakers for casual wear', 'casual-sneakers', 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg'),
  ('Formal Shoes', 'Elegant formal footwear for professional occasions', 'formal-shoes', 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg'),
  ('Sandals', 'Comfortable sandals for warm weather', 'sandals', 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg');

INSERT INTO products (name, description, price, compare_at_price, sku, inventory_quantity, category_id, images, features, is_featured, is_active) VALUES
  (
    'AirMax Pro Runner',
    'Premium running shoes with advanced cushioning technology for maximum comfort and performance.',
    89.99,
    119.99,
    'AMP-001',
    50,
    (SELECT id FROM categories WHERE slug = 'athletic-shoes'),
    '["https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg", "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg"]'::jsonb,
    '["Air cushioning", "Breathable mesh", "Durable outsole", "Lightweight design"]'::jsonb,
    true,
    true
  ),
  (
    'Urban Street Classic',
    'Stylish casual sneakers perfect for everyday wear and urban adventures.',
    69.99,
    89.99,
    'USC-002',
    75,
    (SELECT id FROM categories WHERE slug = 'casual-sneakers'),
    '["https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg", "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg"]'::jsonb,
    '["Premium leather", "Comfortable insole", "Versatile design", "Non-slip sole"]'::jsonb,
    true,
    true
  ),
  (
    'Executive Oxford',
    'Sophisticated oxford shoes crafted from premium leather for the modern professional.',
    129.99,
    159.99,
    'EO-003',
    30,
    (SELECT id FROM categories WHERE slug = 'formal-shoes'),
    '["https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg"]'::jsonb,
    '["Genuine leather", "Hand-stitched", "Classic design", "Comfortable fit"]'::jsonb,
    false,
    true
  ),
  (
    'Summer Breeze Sandals',
    'Lightweight and comfortable sandals perfect for beach days and summer outings.',
    39.99,
    49.99,
    'SBS-004',
    100,
    (SELECT id FROM categories WHERE slug = 'sandals'),
    '["https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg"]'::jsonb,
    '["Water-resistant", "Arch support", "Quick-dry straps", "Non-slip sole"]'::jsonb,
    false,
    true
  );