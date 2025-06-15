
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';

export const VerifyPage = () => {
  const navigate = useNavigate();
  const { showError } = useEnhancedToast();

  useEffect(() => {
    const hash = window.location.hash;
    
    // Remove o '#' inicial para facilitar a análise
    const params = new URLSearchParams(hash.substring(1));
    const type = params.get('type');

    let redirectPath = '';

    if (type === 'recovery') {
      console.log('Token de recuperação de senha detectado. Redirecionando...');
      redirectPath = '/reset-password';
    } else if (type === 'email_change') {
      console.log('Token de alteração de e-mail detectado. Redirecionando...');
      redirectPath = '/reset-email';
    }

    if (redirectPath) {
      // O hash completo (incluindo o token) é necessário na página de destino
      navigate(redirectPath + hash, { replace: true });
    } else {
      console.error('Tipo de token inválido ou ausente:', type);
      showError({
        title: 'Link Inválido',
        description: 'O link de verificação é inválido ou expirou. Por favor, tente novamente.',
      });
      navigate('/auth', { replace: true });
    }
  }, [navigate, showError]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg">Verificando seu link, por favor aguarde...</p>
    </div>
  );
};
