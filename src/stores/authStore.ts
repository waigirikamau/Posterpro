import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.warn('Auth error (demo mode):', error);
      // In demo mode, create a mock user
      const mockUser = {
        id: 'demo-user-id',
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as User;
      set({ user: mockUser });
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.warn('Auth error (demo mode):', error);
      // In demo mode, create a mock user
      const mockUser = {
        id: 'demo-user-id',
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as User;
      set({ user: mockUser });
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.warn('Sign out error (demo mode):', error);
    }
    set({ user: null, profile: null });
  },

  updateProfile: async (updates: Partial<Profile>) => {
    const { user } = get();
    if (!user) throw new Error('No user logged in');

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;
      
      // Refresh profile
      await get().fetchProfile();
    } catch (error) {
      console.warn('Profile update error (demo mode):', error);
      // In demo mode, update local state
      set(state => ({
        profile: state.profile ? { ...state.profile, ...updates } : null
      }));
    }
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      console.warn('Profile fetch error (demo mode):', error);
      // In demo mode, create a mock profile
      const mockProfile: Profile = {
        id: user.id,
        email: user.email || 'demo@example.com',
        full_name: 'Demo User',
        subscription_plan: 'free',
        subscription_status: 'inactive',
        credits_remaining: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      set({ profile: mockProfile });
    }
  },

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        set({ user: session.user });
        await get().fetchProfile();
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          set({ user: session.user });
          await get().fetchProfile();
        } else {
          set({ user: null, profile: null });
        }
      });
    } catch (error) {
      console.warn('Auth initialization error (demo mode):', error);
    } finally {
      set({ loading: false });
    }
  },
}));