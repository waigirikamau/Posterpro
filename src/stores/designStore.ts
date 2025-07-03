import { create } from 'zustand';
import { supabase, UserDesign, Template } from '../lib/supabase';

// Mock data for demo mode
const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Restaurant Special',
    category: 'Restaurant',
    preview_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    color_scheme: 'from-red-500 to-orange-500',
    is_premium: false,
    is_popular: true,
    usage_count: 150,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Grand Opening',
    category: 'Event',
    preview_url: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400',
    color_scheme: 'from-purple-500 to-pink-500',
    is_premium: false,
    is_popular: true,
    usage_count: 120,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Beauty Salon',
    category: 'Beauty',
    preview_url: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400',
    color_scheme: 'from-pink-500 to-rose-500',
    is_premium: true,
    is_popular: false,
    usage_count: 80,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Business Promo',
    category: 'Business',
    preview_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    color_scheme: 'from-blue-500 to-cyan-500',
    is_premium: false,
    is_popular: true,
    usage_count: 200,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Flash Sale',
    category: 'Sale',
    preview_url: 'https://images.pexels.com/photos/3962294/pexels-photo-3962294.jpeg?auto=compress&cs=tinysrgb&w=400',
    color_scheme: 'from-yellow-500 to-orange-500',
    is_premium: false,
    is_popular: false,
    usage_count: 95,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Service Offer',
    category: 'Service',
    preview_url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
    color_scheme: 'from-green-500 to-teal-500',
    is_premium: true,
    is_popular: true,
    usage_count: 110,
    created_at: new Date().toISOString(),
  },
];

interface DesignState {
  designs: UserDesign[];
  templates: Template[];
  currentDesign: UserDesign | null;
  loading: boolean;
  fetchDesigns: () => Promise<void>;
  fetchTemplates: () => Promise<void>;
  createDesign: (templateId?: string) => Promise<UserDesign>;
  updateDesign: (id: string, updates: Partial<UserDesign>) => Promise<void>;
  deleteDesign: (id: string) => Promise<void>;
  setCurrentDesign: (design: UserDesign | null) => void;
  saveDesign: (designData: any) => Promise<void>;
}

export const useDesignStore = create<DesignState>((set, get) => ({
  designs: [],
  templates: [],
  currentDesign: null,
  loading: false,

  fetchDesigns: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('user_designs')
        .select(`
          *,
          template:templates(*)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      set({ designs: data || [] });
    } catch (error) {
      console.warn('Error fetching designs (demo mode):', error);
      // In demo mode, use empty array
      set({ designs: [] });
    } finally {
      set({ loading: false });
    }
  },

  fetchTemplates: async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('is_popular', { ascending: false });

      if (error) throw error;
      set({ templates: data || [] });
    } catch (error) {
      console.warn('Error fetching templates (demo mode):', error);
      // In demo mode, use mock templates
      set({ templates: mockTemplates });
    }
  },

  createDesign: async (templateId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const designData = {
        user_id: user.id,
        template_id: templateId || null,
      };

      const { data, error } = await supabase
        .from('user_designs')
        .insert(designData)
        .select(`
          *,
          template:templates(*)
        `)
        .single();

      if (error) throw error;
      
      set(state => ({ 
        designs: [data, ...state.designs],
        currentDesign: data 
      }));
      
      return data;
    } catch (error) {
      console.warn('Error creating design (demo mode):', error);
      // In demo mode, create a mock design
      const template = templateId ? get().templates.find(t => t.id === templateId) : null;
      const mockDesign: UserDesign = {
        id: `demo-design-${Date.now()}`,
        user_id: 'demo-user-id',
        template_id: templateId || null,
        title: 'Your Amazing Offer',
        subtitle: 'Limited Time Only',
        description: 'Get the best deals and offers from our amazing collection.',
        price: 'KES 2,999',
        original_price: 'KES 4,999',
        contact: '+254 700 123 456',
        bg_color: template?.color_scheme || 'from-purple-600 to-blue-600',
        text_color: 'text-white',
        design_data: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        template,
      };
      
      set(state => ({ 
        designs: [mockDesign, ...state.designs],
        currentDesign: mockDesign 
      }));
      
      return mockDesign;
    }
  },

  updateDesign: async (id: string, updates: Partial<UserDesign>) => {
    try {
      const { error } = await supabase
        .from('user_designs')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        designs: state.designs.map(design => 
          design.id === id ? { ...design, ...updates } : design
        ),
        currentDesign: state.currentDesign?.id === id 
          ? { ...state.currentDesign, ...updates }
          : state.currentDesign
      }));
    } catch (error) {
      console.warn('Error updating design (demo mode):', error);
      // In demo mode, update local state
      set(state => ({
        designs: state.designs.map(design => 
          design.id === id ? { ...design, ...updates } : design
        ),
        currentDesign: state.currentDesign?.id === id 
          ? { ...state.currentDesign, ...updates }
          : state.currentDesign
      }));
    }
  },

  deleteDesign: async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_designs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        designs: state.designs.filter(design => design.id !== id),
        currentDesign: state.currentDesign?.id === id ? null : state.currentDesign
      }));
    } catch (error) {
      console.warn('Error deleting design (demo mode):', error);
      // In demo mode, update local state
      set(state => ({
        designs: state.designs.filter(design => design.id !== id),
        currentDesign: state.currentDesign?.id === id ? null : state.currentDesign
      }));
    }
  },

  setCurrentDesign: (design: UserDesign | null) => {
    set({ currentDesign: design });
  },

  saveDesign: async (designData: any) => {
    const { currentDesign } = get();
    if (!currentDesign) return;

    await get().updateDesign(currentDesign.id, {
      ...designData,
      design_data: designData
    });
  },
}));