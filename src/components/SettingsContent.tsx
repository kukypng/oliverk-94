
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Settings, User, Bell, Shield, Palette } from 'lucide-react';

export const SettingsContent = () => {
  return (
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-2">Personalize seu sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Palette className="h-5 w-5 mr-2 text-primary" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tema</p>
                <p className="text-sm text-muted-foreground">Alternar entre modo claro e escuro</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-scale-in" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <User className="h-5 w-5 mr-2 text-primary" />
              Perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-muted-foreground">
              <User className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p>Configurações de perfil em desenvolvimento</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-scale-in" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Bell className="h-5 w-5 mr-2 text-primary" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p>Configurações de notificação em desenvolvimento</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-scale-in" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-muted-foreground">
              <Shield className="h-8 w-8 mx-auto mb-3 opacity-50" />
              <p>Configurações de segurança em desenvolvimento</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
