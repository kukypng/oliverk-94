
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SelectedBudgetDelete } from '../SelectedBudgetDelete';
import { MassDeleteButton } from '../MassDeleteButton';

interface BudgetsHeaderProps {
  totalBudgets: number;
  selectedCount: number;
  hasSelection: boolean;
  selectedBudgets: string[];
  budgets: any[];
  onDeleteComplete: () => void;
}

export const BudgetsHeader = ({
  totalBudgets,
  selectedCount,
  hasSelection,
  selectedBudgets,
  budgets,
  onDeleteComplete
}: BudgetsHeaderProps) => {
  return (
    <Card className="glass-card animate-slide-down">
      <CardHeader className="p-4 lg:p-5">
        <CardTitle className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Orçamentos</h1>
            {totalBudgets > 0 && (
              <Badge variant="secondary" className="bg-primary/8 text-primary border-primary/15 text-sm font-medium">
                {totalBudgets} total
              </Badge>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            {hasSelection && (
              <>
                <Badge className="bg-primary/10 text-primary border border-primary/20 animate-scale-in">
                  {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
                </Badge>
                <SelectedBudgetDelete
                  selectedBudgets={selectedBudgets}
                  budgets={budgets}
                  onDeleteComplete={onDeleteComplete}
                />
              </>
            )}
            
            {!hasSelection && totalBudgets > 0 && (
              <MassDeleteButton
                budgetCount={totalBudgets}
                disabled={hasSelection}
              />
            )}
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
