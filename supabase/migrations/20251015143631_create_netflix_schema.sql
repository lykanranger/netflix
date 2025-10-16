/*
  # Netflix Clone Database Schema

  ## Overview
  This migration creates the database structure for a Netflix clone application with user authentication, 
  profile management, and personalized content lists.

  ## New Tables

  ### 1. `profiles`
  Stores user profiles (each user can have multiple profiles)
  - `id` (uuid, primary key) - Unique profile identifier
  - `user_id` (uuid, foreign key) - References auth.users, the account owner
  - `name` (text) - Profile display name
  - `avatar_url` (text) - Profile avatar image URL
  - `is_kids` (boolean) - Whether this is a kids profile
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `my_list`
  Stores movies/shows added to user's "My List"
  - `id` (uuid, primary key) - Unique entry identifier
  - `profile_id` (uuid, foreign key) - References profiles table
  - `movie_id` (integer) - TMDb movie/show ID
  - `media_type` (text) - Type of media (movie or tv)
  - `title` (text) - Movie/show title
  - `poster_path` (text) - Poster image path
  - `added_at` (timestamptz) - When item was added to list

  ## Security

  ### Row Level Security (RLS)
  All tables have RLS enabled to ensure data privacy and security.

  ### Profiles Policies
  - Users can view their own profiles
  - Users can create profiles for their account
  - Users can update their own profiles
  - Users can delete their own profiles

  ### My List Policies
  - Users can view items in their profile's list
  - Users can add items to their profile's list
  - Users can remove items from their profile's list

  ## Notes
  1. Each authenticated user can create multiple profiles (family sharing)
  2. My List is profile-specific, not user-specific
  3. All timestamps use timestamptz for proper timezone handling
  4. Foreign key constraints ensure data integrity
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  avatar_url text DEFAULT '',
  is_kids boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create my_list table
CREATE TABLE IF NOT EXISTS my_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  movie_id integer NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('movie', 'tv')),
  title text NOT NULL,
  poster_path text DEFAULT '',
  added_at timestamptz DEFAULT now(),
  UNIQUE(profile_id, movie_id, media_type)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_my_list_profile_id ON my_list(profile_id);
CREATE INDEX IF NOT EXISTS idx_my_list_movie_id ON my_list(movie_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE my_list ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profiles"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- My List policies
CREATE POLICY "Users can view own my list"
  ON my_list FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = my_list.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add to own my list"
  ON my_list FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = my_list.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can remove from own my list"
  ON my_list FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = my_list.profile_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();