
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { CreditCard } from 'lucide-react';

interface SignupAndPayButtonProps {
  name: string;
  email: string;
  disabled?: boolean;
}

export const SignupAndPayButton: React.FC<SignupAndPayButtonProps> = ({ name, email, disabled }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscription = async () => {
    if (!name || !email) {
      toast.error("Nome e email são obrigatórios.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-mercadopago-subscription', {
        body: { 
            origin: window.location.origin,
            name,
            email 
        }
      });

      if (error) {
        const errorMessage = (error as any).context?.errorMessage || error.message;
        throw new Error(errorMessage);
      }

      if (data.init_point) {
        window.location.href = data.init_point;
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
      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl mobile-touch"
      disabled={isLoading || disabled}
    >
      <CreditCard className="w-5 h-5 mr-2" />
      Pagar R$40 e Criar Conta
    </EnhancedButton>
  );
};
