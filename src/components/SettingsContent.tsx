
import React from 'react';
import { ProfileSettings } from '@/components/ProfileSettings';
import { CompanySettings } from '@/components/CompanySettings';
import { SecuritySettings } from '@/components/SecuritySettings';
import { DataManagementSettings } from './DataManagementSettings';
import { BudgetWarningSettings } from './BudgetWarningSettings';
import { Separator } from '@/components/ui/separator';

export const SettingsContent = () => {
  return (
    <div className="p-4 lg:p-8 space-y-8 animate-fade-in max-w-7xl mx-auto">
      <header>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          Configurações
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Gerencie seu perfil, empresa e preferências da aplicação.
        </p>
      </header>

      <div className="space-y-12">
        <section id="account-settings">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground pb-4">
            Conta e Segurança
          </h2>
          <Separator />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
            <ProfileSettings />
            <SecuritySettings />
          </div>
        </section>
        
        <section id="app-settings">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground pb-4">
            Preferências da Aplicação
          </h2>
          <Separator />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
            <CompanySettings />
            <BudgetWarningSettings />
          </div>
          <div className="pt-8">
            <DataManagementSettings />
          </div>
        </section>
      </div>
    </div>
  );
};
