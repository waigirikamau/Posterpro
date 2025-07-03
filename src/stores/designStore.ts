import { create } from 'zustand';
import { supabase, UserDesign, Template } from '../lib/supabase';

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
      console.error('Error fetching designs:', error);
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
      console.error('Error fetching templates:', error);
    }
  },

  createDesign: async (templateId?: string) => {
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
  },

  updateDesign: async (id: string, updates: Partial<UserDesign>) => {
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
  },

  deleteDesign: async (id: string) => {
    const { error } = await supabase
      .from('user_designs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    set(state => ({
      designs: state.designs.filter(design => design.id !== id),
      currentDesign: state.currentDesign?.id === id ? null : state.currentDesign
    }));
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