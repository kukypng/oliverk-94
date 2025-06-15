
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EnhancedButton, EnhancedButtonProps } from '@/components/ui/enhanced-button';

interface SubscriptionButtonProps extends Omit<EnhancedButtonProps, 'onClick' | 'loading'> {
  children?: React.ReactNode;
}

export const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({ children, ...props }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscription = async () => {
    if (!user) {
      toast.info("Você precisa fazer login para assinar.", {
        action: {
          label: 'Fazer Login',
          onClick: () => navigate('/auth'),
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-mercadopago-subscription', {
        body: { origin: window.location.origin }
      });

      if (error) {
        const errorMessage = (error as any).context?.errorMessage || error.message;
        throw new Error(errorMessage);
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Não foi possível iniciar o processo de assinatura.");
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast.error("Erro ao criar assinatura", {
        description: error.message || "Por favor, tente novamente mais tarde."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EnhancedButton
      onClick={handleSubscription}
      loading={isLoading}
      loadingText="Processando..."
      {...props}
    >
      {children}
    </EnhancedButton>
  );
};
