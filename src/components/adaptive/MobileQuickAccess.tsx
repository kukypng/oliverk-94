
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, List, Settings, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileQuickAccessProps {
  onTabChange: (tab: string) => void;
  hasPermission: (permission: string) => boolean;
}

export const MobileQuickAccess = ({
  onTabChange,
  hasPermission
}: MobileQuickAccessProps) => {
  const quickActions = [
    {
      id: 'new-budget',
      icon: PlusCircle,
      label: 'Novo\nOrçamento',
      color: 'text-green-500',
      permission: 'create_budgets'
    },
    {
      id: 'budgets',
      icon: List,
      label: 'Ver\nOrçamentos',
      color: 'text-blue-500',
      permission: 'view_own_budgets'
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Configurações',
      color: 'text-slate-500',
      permission: null
    },
    {
      id: 'admin',
      icon: Shield,
      label: 'Painel\nAdmin',
      color: 'text-red-500',
      permission: 'manage_users'
    }
  ];

  const visibleActions = quickActions.filter(action => 
    !action.permission || hasPermission(action.permission)
  );

  return (
    <Card className="glass-card shadow-strong">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {visibleActions.map(action => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="outline"
                onClick={() => onTabChange(action.id)}
                className="h-24 flex-col gap-2 bg-background/50 hover:bg-primary hover:text-primary-foreground border border-border/50 group transition-all duration-200 hover:scale-105"
              >
                <div className="p-2 rounded-lg bg-background/10 group-hover:bg-white/20">
                  <Icon className={cn("h-5 w-5", action.color, "group-hover:text-white")} />
                </div>
                <span className="text-xs font-medium text-center leading-tight whitespace-pre-line">
                  {action.label}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
