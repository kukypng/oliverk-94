import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, List, Eye, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
interface MobileQuickAccessProps {
  onTabChange: (tab: string) => void;
  stats?: {
    totalBudgets: number;
    weeklyGrowth: number;
  };
}
export const MobileQuickAccess = ({
  onTabChange,
  stats
}: MobileQuickAccessProps) => {
  const quickActions = [{
    id: 'new-budget',
    icon: PlusCircle,
    label: 'Novo\nOrçamento',
    color: 'bg-green-500',
    description: 'Criar orçamento'
  }, {
    id: 'budgets',
    icon: List,
    label: 'Ver\nOrçamentos',
    color: 'bg-blue-500',
    description: 'Listar todos'
  }, {
    id: 'dashboard-stats',
    icon: TrendingUp,
    label: 'Estatísticas',
    color: 'bg-purple-500',
    description: 'Visualizar dados',
    action: () => {} // Scroll to stats
  }, {
    id: 'recent',
    icon: Eye,
    label: 'Recentes',
    color: 'bg-orange-500',
    description: 'Últimas atividades'
  }];
  return <Card className="glass-card shadow-strong">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map(action => {
          const Icon = action.icon;
          return <Button key={action.id} variant="outline" onClick={() => action.action ? action.action() : onTabChange(action.id)} className="h-24 flex-col gap-2 bg-background/50 hover:bg-primary hover:text-primary-foreground border border-border/50 group transition-all duration-200 hover:scale-105">
                <div className={cn("p-2 rounded-lg", action.color, "text-white group-hover:bg-white/20")}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-center leading-tight whitespace-pre-line">
                  {action.label}
                </span>
              </Button>;
        })}
        </div>

        {stats && <div className="mt-4 pt-4 border-t border-border/50">
            
            <div className="flex justify-between text-sm mt-1">
              <span className="text-muted-foreground">Orçamentos criados essa semana</span>
              <span className="font-semibold text-green-600">+{stats.weeklyGrowth}</span>
            </div>
          </div>}
      </CardContent>
    </Card>;
};