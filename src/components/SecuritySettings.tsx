import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, MessageCircle, Lock } from 'lucide-react';
export const SecuritySettings = () => {
  const handleSupportContact = () => {
    window.open('https://wa.me/556496028022', '_blank');
  };
  return <Card style={{
    animationDelay: '100ms'
  }} className="glass-card animate-scale-in card-hover py-0 px-0 my-[11px] mx-0">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          Segurança
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Suporte WhatsApp</p>
                <p className="text-sm text-muted-foreground">
                  Entre em contato com nosso suporte
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSupportContact} className="text-green-600 border-green-600 hover:bg-green-50">
              Contatar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
};