import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback for demo purposes - in production, these should be real values
const defaultUrl = 'https://demo.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

let supabaseClient;

try {
  supabaseClient = createClient(
    supabaseUrl || defaultUrl, 
    supabaseAnonKey || defaultKey
  );
} catch (error) {
  console.warn('Supabase client creation failed, using mock client:', error);
  // Create a mock client for demo purposes
  supabaseClient = {
    auth: {
      signInWithPassword: () => Promise.resolve({ error: new Error('Demo mode') }),
      signUp: () => Promise.resolve({ error: new Error('Demo mode') }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getUser: () => Promise.resolve({ data: { user: null } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Demo mode') }),
          order: () => Promise.resolve({ data: [], error: new Error('Demo mode') }),
        }),
        order: () => Promise.resolve({ data: [], error: new Error('Demo mode') }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: new Error('Demo mode') }),
        }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: new Error('Demo mode') }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: new Error('Demo mode') }),
      }),
    }),
  };
}

export const supabase = supabaseClient;

// Types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_plan: 'free' | 'weekly' | 'monthly';
  subscription_status: 'active' | 'inactive' | 'cancelled';
  subscription_end_date?: string;
  credits_remaining: number;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  preview_url?: string;
  color_scheme: string;
  is_premium: boolean;
  is_popular: boolean;
  usage_count: number;
  created_at: string;
}

export interface UserDesign {
  id: string;
  user_id: string;
  template_id?: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  original_price: string;
  contact: string;
  bg_color: string;
  text_color: string;
  logo_url?: string;
  design_data: any;
  created_at: string;
  updated_at: string;
  template?: Template;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method?: string;
  payment_status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  plan_type?: string;
  created_at: string;
}

export interface Download {
  id: string;
  user_id: string;
  design_id: string;
  format: 'png' | 'pdf';
  download_url?: string;
  created_at: string;
}