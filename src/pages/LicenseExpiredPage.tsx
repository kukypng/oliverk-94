import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CreditCard } from 'lucide-react';
import { SubscriptionButton } from '@/components/SubscriptionButton';

export const LicenseExpiredPage = () => {
  return <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <img src="/icones/coracao.png" alt="Licença Expirada" className="w-12 h-12" />
          </div>
          <CardTitle className="text-2xl font-bold text-[#ff0000]">
            Licença Expirada
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Sua licença de 30 dias expirou</span>
            </div>
            <p className="text-slate-50">
              Para continuar usando o sistema, você precisa renovar sua licença.
            </p>
          </div>

          <div className="border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-slate-50">
              Renove sua licença agora
            </h3>
            <p className="text-sm mb-4 text-slate-50">
              Clique no botão abaixo para renovar sua licença e continuar aproveitando todos os recursos do sistema.
            </p>
            <SubscriptionButton className="w-full bg-green-600 hover:bg-green-700 text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Renovar Assinatura
            </SubscriptionButton>
          </div>

          <div className="text-xs text-gray-500 border-t pt-4">
            <p className="text-white">Após a renovação, você terá acesso completo ao sistema por mais 30 dias.</p>
          </div>
        </CardContent>
      </Card>
    </div>;
};
