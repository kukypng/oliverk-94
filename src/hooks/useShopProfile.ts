
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

  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Verificar tamanho do arquivo (3MB = 3145728 bytes)
      if (file.size > 3145728) {
        throw new Error('O arquivo deve ter no máximo 3MB');
      }

      // Verificar tipo do arquivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Apenas imagens PNG, JPEG, WebP e GIF são permitidas');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/logo.${fileExt}`;

      // Upload do arquivo
      const { data, error } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, {
          upsert: true
        });

      if (error) throw error;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      return publicUrl;
    },
    onSuccess: async (logoUrl) => {
      // Atualizar o perfil com a nova URL da logo
      await createOrUpdateMutation.mutateAsync({ 
        ...shopProfile,
        logo_url: logoUrl 
      });
      
      showSuccess({
        title: 'Logo enviada com sucesso',
        description: 'A logo da empresa foi atualizada.',
      });
    },
    onError: (error) => {
      console.error('Error uploading logo:', error);
      showError({
        title: 'Erro ao enviar logo',
        description: error.message || 'Ocorreu um erro ao enviar a logo.',
      });
    },
  });

  const removeLogoMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !shopProfile?.logo_url) throw new Error('No logo to remove');

      // Extrair o caminho do arquivo da URL
      const urlParts = shopProfile.logo_url.split('/');
      const fileName = `${user.id}/${urlParts[urlParts.length - 1]}`;

      // Remover do storage
      const { error } = await supabase.storage
        .from('company-logos')
        .remove([fileName]);

      if (error) throw error;

      // Atualizar o perfil removendo a URL da logo
      await createOrUpdateMutation.mutateAsync({ 
        ...shopProfile,
        logo_url: null 
      });
    },
    onSuccess: () => {
      showSuccess({
        title: 'Logo removida',
        description: 'A logo da empresa foi removida com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error removing logo:', error);
      showError({
        title: 'Erro ao remover logo',
        description: 'Ocorreu um erro ao remover a logo.',
      });
    },
  });

  return {
    shopProfile,
    isLoading,
    saveProfile: createOrUpdateMutation.mutate,
    isSaving: createOrUpdateMutation.isPending,
    uploadLogo: uploadLogoMutation.mutate,
    isUploadingLogo: uploadLogoMutation.isPending,
    removeLogo: removeLogoMutation.mutate,
    isRemovingLogo: removeLogoMutation.isPending,
  };
};
