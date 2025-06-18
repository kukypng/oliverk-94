
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
    <Card className="glass-card animate-slide-down border-0">
      <CardHeader className="p-4 lg:p-5">
        <CardTitle className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">Orçamentos</h1>
              {totalBudgets > 0 && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs font-medium">
                  {totalBudgets} total
                </Badge>
              )}
            </div>
          </div>
          
          {/* Selection and actions row */}
          {(hasSelection || (!hasSelection && totalBudgets > 0)) && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-3">
              {hasSelection ? (
                <div className="flex items-center space-x-3">
                  <Badge className="bg-primary/10 text-primary border border-primary/30 animate-scale-in text-xs">
                    {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
                  </Badge>
                  <SelectedBudgetDelete
                    selectedBudgets={selectedBudgets}
                    budgets={budgets}
                    onDeleteComplete={onDeleteComplete}
                  />
                </div>
              ) : (
                <div className="flex items-center">
                  <MassDeleteButton
                    budgetCount={totalBudgets}
                    disabled={hasSelection}
                  />
                </div>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
