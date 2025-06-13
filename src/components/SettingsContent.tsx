
import React from 'react';
import { ProfileSettings } from '@/components/ProfileSettings';
import { SecuritySettings } from '@/components/SecuritySettings';

export const SettingsContent = () => {
  return (
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-2">Gerencie seu perfil e configurações de segurança</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileSettings />
        <SecuritySettings />
      </div>
    </div>
  );
};
