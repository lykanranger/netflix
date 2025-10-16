import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string;
  is_kids: boolean;
  created_at: string;
  updated_at: string;
};

export type MyListItem = {
  id: string;
  profile_id: string;
  movie_id: number;
  media_type: 'movie' | 'tv';
  title: string;
  poster_path: string;
  added_at: string;
};
