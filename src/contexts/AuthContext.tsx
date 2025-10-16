import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  profiles: Profile[];
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  selectProfile: (profile: Profile) => void;
  loadProfiles: () => Promise<void>;
  createProfile: (name: string, avatar_url: string) => Promise<void>; // Added this line
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfiles();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfiles();
        } else {
          setProfiles([]);
          setProfile(null);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfiles = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
     .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (data) {
      setProfiles(data);
      const savedProfileId = localStorage.getItem('selectedProfileId');
      if (savedProfileId) {
        const savedProfile = data.find(p => p.id === savedProfileId);
        if (savedProfile) {
          setProfile(savedProfile);
        }
      }
    }
  };

  const createProfile = async (name: string, avatar_url: string) => {
    if (!user) {
        throw new Error("You must be logged in to create a profile.");
    }
    const { error } = await supabase.from('profiles').insert({
        user_id: user.id,
        name,
        avatar_url
    });

    if (error) throw error;
    await loadProfiles(); // Refresh profiles after creation
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    localStorage.removeItem('selectedProfileId');
    setProfile(null);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const selectProfile = (profile: Profile) => {
    setProfile(profile);
    localStorage.setItem('selectedProfileId', profile.id);
  };

  const value = {
    user,
    profile,
    profiles,
    loading,
    signUp,
    signIn,
    signOut,
    selectProfile,
    loadProfiles,
    createProfile, // Added this line
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
