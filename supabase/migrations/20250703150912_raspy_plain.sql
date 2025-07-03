/*
  # Initial Schema for PosterPro

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `avatar_url` (text)
      - `subscription_plan` (text)
      - `subscription_status` (text)
      - `subscription_end_date` (timestamptz)
      - `credits_remaining` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `templates`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `preview_url` (text)
      - `color_scheme` (text)
      - `is_premium` (boolean)
      - `is_popular` (boolean)
      - `usage_count` (integer)
      - `created_at` (timestamptz)

    - `user_designs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `template_id` (uuid, references templates)
      - `title` (text)
      - `subtitle` (text)
      - `description` (text)
      - `price` (text)
      - `original_price` (text)
      - `contact` (text)
      - `bg_color` (text)
      - `text_color` (text)
      - `logo_url` (text)
      - `design_data` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `amount` (decimal)
      - `currency` (text)
      - `payment_method` (text)
      - `payment_status` (text)
      - `transaction_id` (text)
      - `plan_type` (text)
      - `created_at` (timestamptz)

    - `downloads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `design_id` (uuid, references user_designs)
      - `format` (text)
      - `download_url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  subscription_plan text DEFAULT 'free',
  subscription_status text DEFAULT 'inactive',
  subscription_end_date timestamptz,
  credits_remaining integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  preview_url text,
  color_scheme text DEFAULT 'from-purple-600 to-blue-600',
  is_premium boolean DEFAULT false,
  is_popular boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user_designs table
CREATE TABLE IF NOT EXISTS user_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  template_id uuid REFERENCES templates(id),
  title text DEFAULT 'Your Amazing Offer',
  subtitle text DEFAULT 'Limited Time Only',
  description text DEFAULT 'Get the best deals and offers from our amazing collection.',
  price text DEFAULT 'KES 2,999',
  original_price text DEFAULT 'KES 4,999',
  contact text DEFAULT '+254 700 123 456',
  bg_color text DEFAULT 'from-purple-600 to-blue-600',
  text_color text DEFAULT 'text-white',
  logo_url text,
  design_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'KES',
  payment_method text,
  payment_status text DEFAULT 'pending',
  transaction_id text,
  plan_type text,
  created_at timestamptz DEFAULT now()
);

-- Create downloads table
CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  design_id uuid REFERENCES user_designs(id) ON DELETE CASCADE,
  format text NOT NULL,
  download_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Templates policies (public read)
CREATE POLICY "Anyone can read templates"
  ON templates
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- User designs policies
CREATE POLICY "Users can read own designs"
  ON user_designs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own designs"
  ON user_designs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own designs"
  ON user_designs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own designs"
  ON user_designs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Downloads policies
CREATE POLICY "Users can read own downloads"
  ON downloads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own downloads"
  ON downloads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert sample templates
INSERT INTO templates (name, category, preview_url, color_scheme, is_premium, is_popular) VALUES
('Restaurant Special', 'Restaurant', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400', 'from-red-500 to-orange-500', false, true),
('Grand Opening', 'Event', 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400', 'from-purple-500 to-pink-500', false, true),
('Beauty Salon', 'Beauty', 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400', 'from-pink-500 to-rose-500', true, false),
('Business Promo', 'Business', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400', 'from-blue-500 to-cyan-500', false, true),
('Flash Sale', 'Sale', 'https://images.pexels.com/photos/3962294/pexels-photo-3962294.jpeg?auto=compress&cs=tinysrgb&w=400', 'from-yellow-500 to-orange-500', false, false),
('Service Offer', 'Service', 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400', 'from-green-500 to-teal-500', true, true),
('Food Delivery', 'Restaurant', 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400', 'from-orange-500 to-red-500', false, false),
('Wedding Event', 'Event', 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=400', 'from-purple-500 to-blue-500', true, true);

-- Function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_designs_updated_at
  BEFORE UPDATE ON user_designs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();