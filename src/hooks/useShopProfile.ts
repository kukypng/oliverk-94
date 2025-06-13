
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';

export interface ShopProfile {
  id: string;
  user_id: string;
  shop_name: string;
  address: string;
  contact_phone: string;
  cnpj?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export const useShopProfile = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useEnhancedToast();
  const queryClient = useQueryClient();

  const { data: shopProfile, isLoading } = useQuery({
    queryKey: ['shop-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log('Fetching shop profile for user:', user.id);
      const { data, error } = await supabase
        .from('shop_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching shop profile:', error);
        throw error;
      }
      
      console.log('Shop profile loaded:', data);
      return data as ShopProfile | null;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const createOrUpdateMutation = useMutation({
    mutationFn: async (profileData: Partial<ShopProfile>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const payload = {
        user_id: user.id,
        shop_name: profileData.shop_name || '',
        address: profileData.address || '',
        contact_phone: profileData.contact_phone || '',
        cnpj: profileData.cnpj || null,
        logo_url: profileData.logo_url || null,
      };

      console.log('Saving shop profile:', payload);

      if (shopProfile?.id) {
        // Update existing profile
        const { data, error } = await supabase
          .from('shop_profiles')
          .update(payload)
          .eq('id', shopProfile.id)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('shop_profiles')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-profile', user?.id] });
      showSuccess({
        title: 'Perfil da empresa salvo',
        description: 'As informações da empresa foram atualizadas com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error saving shop profile:', error);
      showError({
        title: 'Erro ao salvar',
        description: 'Ocorreu um erro ao salvar as informações da empresa.',
      });
    },
  });

  return {
    shopProfile,
    isLoading,
    saveProfile: createOrUpdateMutation.mutate,
    isSaving: createOrUpdateMutation.isPending,
  };
};
