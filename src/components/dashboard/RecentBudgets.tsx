
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { FileText } from 'lucide-react';
import { RecentBudgetItem } from './RecentBudgetItem';
import { Budget } from './types';

interface RecentBudgetsProps {
  recentBudgets: Budget[];
  hasPermission: (permission: string) => boolean;
  onTabChange: (tab: string) => void;
}

export const RecentBudgets = ({ recentBudgets, hasPermission, onTabChange }: RecentBudgetsProps) => {
  return (
    <Card className="glass-card shadow-strong animate-slide-up">
      <CardHeader className="flex flex-row items-start justify-between pb-4 p-6">
        <div>
          <CardTitle className="text-xl lg:text-2xl font-bold text-foreground">
            Orçamentos Recentes
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Seus últimos 5 orçamentos criados.
          </p>
        </div>
        {hasPermission('view_all_budgets') && (
          <Button size="sm" variant="outline" onClick={() => onTabChange('budgets')} className="hidden lg:flex rounded-xl border-[#fec832]/20 text-[#fec832] hover:bg-[#fec832]/10">
            Ver todos
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {recentBudgets && recentBudgets.length > 0 ? (
          <div className="space-y-3 lg:space-y-4">
            {recentBudgets.map((budget, index) => (
              <RecentBudgetItem key={budget.id} budget={budget} index={index} hasPermission={hasPermission} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="Nenhum orçamento encontrado"
            description="Você ainda não criou nenhum orçamento. Comece criando seu primeiro orçamento para acompanhar suas vendas."
            action={hasPermission('create_budgets') ? {
              label: "Criar Primeiro Orçamento",
              onClick: () => onTabChange('new-budget')
            } : undefined}
            className="border-0 shadow-none bg-transparent pt-8 pb-4"
          />
        )}
      </CardContent>
    </Card>
  );
};
