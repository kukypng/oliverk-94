
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, List, Users, Settings, Shield } from 'lucide-react';

interface QuickAccessProps {
  onTabChange: (tab: string) => void;
  hasPermission: (permission: string) => boolean;
}

const quickAccessButtons = [
  { label: 'Novo Orçamento', icon: PlusCircle, tab: 'new-budget', permission: 'create_budgets' },
  { label: 'Ver Orçamentos', icon: List, tab: 'budgets', permission: 'view_own_budgets' },
  { label: 'Clientes', icon: Users, tab: 'clients', permission: 'view_clients' },
  { label: 'Configurações', icon: Settings, tab: 'settings', permission: null },
  { label: 'Painel Admin', icon: Shield, tab: 'admin', permission: 'access_admin_panel' },
];

export const QuickAccess = ({ onTabChange, hasPermission }: QuickAccessProps) => {
  return (
    <Card className="glass-card border-0 shadow-lg animate-slide-up bg-white/50 dark:bg-black/50 backdrop-blur-xl">
      <CardHeader className="p-4 lg:p-6 pb-3">
        <CardTitle className="text-lg lg:text-xl font-semibold text-foreground">
          Acesso Rápido
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-4 lg:p-6 pt-0">
        {quickAccessButtons.map(btn => {
          if (btn.permission && !hasPermission(btn.permission)) return null;
          const Icon = btn.icon;
          return (
            <Button key={btn.tab} variant="outline" onClick={() => onTabChange(btn.tab)} className="flex-col h-24 text-center">
              <Icon className="h-6 w-6 mb-2" />
              <span>{btn.label}</span>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  );
};
