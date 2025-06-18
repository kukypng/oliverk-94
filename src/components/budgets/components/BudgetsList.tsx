
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { BudgetCard } from '../BudgetCard';
import { BudgetTableRow } from '../BudgetTableRow';

interface BudgetsListProps {
  budgets: any[];
  profile: any;
  isGenerating: boolean;
  selectedBudgets: string[];
  isAllSelected: boolean;
  onSelect: (budgetId: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  onShareWhatsApp: (budget: any) => void;
  onViewPDF: (budget: any) => void;
  onEdit: (budget: any) => void;
  onDelete: (budget: any) => void;
}

export const BudgetsList = ({
  budgets,
  profile,
  isGenerating,
  selectedBudgets,
  isAllSelected,
  onSelect,
  onSelectAll,
  onShareWhatsApp,
  onViewPDF,
  onEdit,
  onDelete
}: BudgetsListProps) => {
  return (
    <Card className="glass-card border-0 shadow-lg animate-fade-in bg-card/90 backdrop-blur-xl">
      <CardHeader className="p-4 lg:p-5">
        <CardTitle className="flex items-center justify-between text-lg lg:text-xl">
          <span>Lista de Orçamentos</span>
          {budgets.length > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-primary/8 text-primary border-primary/15 text-xs font-medium">
                {budgets.length}
              </Badge>
              {selectedBudgets.length > 0 && (
                <Badge variant="destructive" className="text-xs animate-scale-in">
                  {selectedBudgets.length} selecionado{selectedBudgets.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 lg:p-5 lg:pt-0">
        <div className="space-y-3 lg:space-y-0 p-3 lg:p-0">
          {/* Mobile Cards View */}
          <div className="block lg:hidden space-y-3">
            {budgets.map((budget, index) => (
              <div
                key={budget.id}
                className="will-change-transform gpu-accelerated"
                style={{
                  animationDelay: `${Math.min(index * 30, 300)}ms`
                }}
              >
                <BudgetCard
                  budget={budget}
                  profile={profile}
                  isGenerating={isGenerating}
                  isSelected={selectedBudgets.includes(budget.id)}
                  onSelect={onSelect}
                  onShareWhatsApp={onShareWhatsApp}
                  onViewPDF={onViewPDF}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-primary/8">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={onSelectAll}
                      className="checkbox-modern"
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Dispositivo</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Problema</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Valor</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Data</TableHead>
                  <TableHead className="font-semibold text-center text-muted-foreground">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((budget, index) => (
                  <TableRow 
                    key={budget.id} 
                    className="hover:bg-primary/3 transition-colors duration-200 border-primary/8 will-change-transform gpu-accelerated"
                    style={{
                      animationDelay: `${Math.min(index * 20, 200)}ms`
                    }}
                  >
                    <BudgetTableRow
                      budget={budget}
                      profile={profile}
                      index={index}
                      isGenerating={isGenerating}
                      isSelected={selectedBudgets.includes(budget.id)}
                      onSelect={onSelect}
                      onShareWhatsApp={onShareWhatsApp}
                      onViewPDF={onViewPDF}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
