import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, MessageCircle, Clock } from 'lucide-react';

export const LicenseExpiredPage = () => {
  const handleWhatsAppContact = () => {
    window.open('https://wa.me/556496028022', '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-700">
            Licença Expirada
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Sua licença de 30 dias expirou</span>
            </div>
            <p className="text-gray-600">
              Para continuar usando o sistema, você precisa renovar sua licença.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">
              Renove sua licença agora
            </h3>
            <p className="text-sm text-green-700 mb-4">
              Entre em contato conosco pelo WhatsApp para renovar sua licença e continuar aproveitando todos os recursos do sistema.
            </p>
            <Button
              onClick={handleWhatsAppContact}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Renovar pelo WhatsApp
            </Button>
          </div>

          <div className="text-xs text-gray-500 border-t pt-4">
            <p>Após a renovação, você terá acesso completo ao sistema por mais 30 dias.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
