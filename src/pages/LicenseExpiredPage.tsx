import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const LicenseExpiredPage = () => {
  const { profile } = useAuth();

  const isNewUser = !profile?.expiration_date;

  const pageContent = {
    icon: isNewUser
      ? <img src="/icone.png" alt="Ativar Conta" className="w-12 h-12" />
      : <img src="/icones/coracao.png" alt="Licença Expirada" className="w-12 h-12" />,
    title: isNewUser ? 'Ative sua Conta' : 'Licença Expirada',
    titleColor: isNewUser ? 'text-primary' : 'text-[#ff0000]',
    statusIcon: isNewUser ? <ShieldCheck className="w-5 h-5" /> : <Clock className="w-5 h-5" />,
    statusText: isNewUser ? 'Sua conta precisa ser ativada' : 'Sua licença expirou',
    statusColor: isNewUser ? 'text-blue-500' : 'text-red-600',
    description: isNewUser
      ? 'Para começar a usar o sistema, você precisa de uma assinatura ativa.'
      : 'Para continuar usando o sistema, você precisa renovar sua licença.',
    ctaTitle: isNewUser ? 'Como ativar sua assinatura?' : 'Como renovar sua licença?',
    ctaDescription: isNewUser
      ? 'Para ativar sua conta, entre em contato com o nosso suporte para que possamos liberar seu acesso.'
      : 'Para renovar sua licença e continuar aproveitando todos os recursos do sistema, entre em contato com nosso suporte.',
    footerText: isNewUser
      ? 'Após a ativação, você terá acesso completo ao sistema.'
      : 'Após a renovação, você terá acesso completo ao sistema.',
  };

  return <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
            {pageContent.icon}
          </div>
          <CardTitle className={`text-2xl font-bold ${pageContent.titleColor}`}>
            {pageContent.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-3">
            <div className={`flex items-center justify-center space-x-2 ${pageContent.statusColor}`}>
              {pageContent.statusIcon}
              <span className="font-medium">{pageContent.statusText}</span>
            </div>
            <p className="text-slate-50">
              {pageContent.description}
            </p>
          </div>

          <div className="border border-primary/20 bg-secondary rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-foreground">
              {pageContent.ctaTitle}
            </h3>
            <p className="text-sm text-muted-foreground">
              {pageContent.ctaDescription}
            </p>
          </div>

          <div className="text-xs text-gray-500 border-t pt-4">
            <p className="text-white">{pageContent.footerText}</p>
          </div>
        </CardContent>
      </Card>
    </div>;
};
