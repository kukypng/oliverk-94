
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
    <Card className="glass-card shadow-strong animate-slide-up">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-xl lg:text-2xl font-bold text-foreground">
          Acesso Rápido
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-6 pt-0">
        {quickAccessButtons.map(btn => {
          if (btn.permission && !hasPermission(btn.permission)) return null;
          const Icon = btn.icon;
          return (
            <Button 
              key={btn.tab} 
              variant="outline" 
              onClick={() => onTabChange(btn.tab)} 
              className="flex-col h-28 text-center text-sm font-medium bg-background/50 hover:bg-background/90 border-border/50 hover:border-primary/50"
            >
              <Icon className="h-7 w-7 mb-2 text-primary" />
              <span>{btn.label}</span>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  );
};
