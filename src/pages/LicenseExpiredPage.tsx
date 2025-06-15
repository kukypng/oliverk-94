
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { SubscriptionButton } from '@/components/SubscriptionButton';
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
    ctaTitle: isNewUser ? 'Ative sua assinatura agora' : 'Renove sua licença agora',
    ctaDescription: isNewUser
      ? 'Clique no botão abaixo para escolher seu plano e ativar sua conta.'
      : 'Clique no botão abaixo para renovar sua licença e continuar aproveitando todos os recursos do sistema.',
    buttonText: isNewUser ? 'Ativar Assinatura' : 'Renovar Assinatura',
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

          <div className="border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-slate-50">
              {pageContent.ctaTitle}
            </h3>
            <p className="text-sm mb-4 text-slate-50">
              {pageContent.ctaDescription}
            </p>
            <SubscriptionButton className="w-full bg-green-600 hover:bg-green-700 text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              {pageContent.buttonText}
            </SubscriptionButton>
          </div>

          <div className="text-xs text-gray-500 border-t pt-4">
            <p className="text-white">{pageContent.footerText}</p>
          </div>
        </CardContent>
      </Card>
    </div>;
};
