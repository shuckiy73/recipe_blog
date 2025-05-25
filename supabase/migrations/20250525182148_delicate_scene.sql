/*
  # Initial database schema for recipe blog

  1. New Tables
    - users (handled by Supabase Auth)
    - categories
      - id (uuid, primary key)
      - name (text)
      - slug (text, unique)
      - description (text)
      - image_url (text)
      - created_at (timestamp)
    - recipes
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - ingredients (jsonb)
      - steps (jsonb)
      - cooking_time (integer)
      - servings (integer)
      - image_url (text)
      - category_id (uuid, foreign key)
      - user_id (uuid, foreign key)
      - featured (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)
    - ratings
      - id (uuid, primary key)
      - recipe_id (uuid, foreign key)
      - user_id (uuid, foreign key)
      - value (integer)
      - created_at (timestamp)
    - comments
      - id (uuid, primary key)
      - recipe_id (uuid, foreign key)
      - user_id (uuid, foreign key)
      - content (text)
      - created_at (timestamp)
    - comment_likes
      - id (uuid, primary key)
      - comment_id (uuid, foreign key)
      - user_id (uuid, foreign key)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create recipes table
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  ingredients jsonb NOT NULL,
  steps jsonb NOT NULL,
  cooking_time integer NOT NULL CHECK (cooking_time > 0),
  servings integer NOT NULL DEFAULT 1 CHECK (servings > 0),
  image_url text,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ratings table
CREATE TABLE ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  value integer NOT NULL CHECK (value >= 1 AND value <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(recipe_id, user_id)
);

-- Create comments table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create comment_likes table
CREATE TABLE comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Categories can be created by authenticated users"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Categories can be updated by authenticated users"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Recipes policies
CREATE POLICY "Recipes are viewable by everyone"
  ON recipes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Recipes can be created by authenticated users"
  ON recipes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Recipes can be updated by their authors"
  ON recipes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Recipes can be deleted by their authors"
  ON recipes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ratings policies
CREATE POLICY "Ratings are viewable by everyone"
  ON ratings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Ratings can be created by authenticated users"
  ON ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Ratings can be updated by their authors"
  ON ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Comments can be created by authenticated users"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Comments can be updated by their authors"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Comments can be deleted by their authors"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comment likes policies
CREATE POLICY "Comment likes are viewable by everyone"
  ON comment_likes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Comment likes can be created by authenticated users"
  ON comment_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Comment likes can be deleted by their authors"
  ON comment_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);