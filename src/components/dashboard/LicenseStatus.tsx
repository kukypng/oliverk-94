import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { differenceInDays, parseISO } from 'date-fns';
import { CreditCard } from 'lucide-react';
import { SubscriptionButton } from '../SubscriptionButton';

export const LicenseStatus = () => {
  const { profile } = useAuth();

  if (!profile?.expiration_date) {
    return null;
  }

  const expirationDate = parseISO(profile.expiration_date);
  const today = new Date();
  const remainingDays = differenceInDays(expirationDate, today);

  const getStatus = () => {
    if (remainingDays < 0) {
      return {
        title: "Licença Expirada",
        description: `Sua licença expirou. Renove para continuar usando o sistema.`,
        icon: <img src="/icones/coracao.png" alt="Licença Expirada" className="h-8 w-8" />,
        cardClass: "border-red-500/30",
        showRenew: true
      };
    }
    
    if (remainingDays <= 1) {
      const dayText = remainingDays === 1 ? 'amanhã' : 'hoje';
      return {
        title: `Urgente: Sua licença expira ${dayText}!`,
        description: `Renove para não perder o acesso ao sistema.`,
        icon: <img src="/icones/coracao.png" alt="Licença Expirando" className="h-8 w-8" />,
        cardClass: "border-red-500/30",
        showRenew: true
      };
    }
    
    if (remainingDays <= 5) {
      return {
        title: "Atenção: Licença Expirando",
        description: `Sua licença expira em ${remainingDays} dias. Renove para não perder o acesso.`,
        icon: <img src="/icones/laranja.png" alt="Licença Expirando" className="h-8 w-8" />,
        cardClass: "border-orange-500/30",
        showRenew: true
      };
    }
    
    if (remainingDays <= 10) {
      return {
        title: "Atenção: Licença Expirando",
        description: `Sua licença expira em ${remainingDays} dias. Renove para não perder o acesso.`,
        icon: <img src="/icones/laranja.png" alt="Licença Expirando" className="h-8 w-8" />,
        cardClass: "border-yellow-500/30",
        showRenew: true
      };
    }

    return {
      title: "Licença Ativa",
      description: `Sua licença expira em ${remainingDays} dias.`,
      icon: <img src="/icones/limao.png" alt="Licença Ativa" className="h-8 w-8" />,
      cardClass: "border-green-500/20",
      showRenew: false
    };
  };

  const status = getStatus();

  return (
    <Card className={`glass-card shadow-strong animate-slide-up ${status.cardClass}`}>
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center space-x-4">
          {status.icon}
          <div>
            <CardTitle className="text-xl lg:text-2xl font-bold text-foreground">
              {status.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <p className="text-muted-foreground mb-6">
          {status.description}
        </p>
        {status.showRenew && (
          <SubscriptionButton className="w-full bg-green-600 hover:bg-green-700 text-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Renovar Assinatura
          </SubscriptionButton>
        )}
      </CardContent>
    </Card>
  );
};
