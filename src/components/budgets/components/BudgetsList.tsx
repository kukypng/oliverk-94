
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { BudgetCard } from '../BudgetCard';
import { BudgetTableRow } from '../BudgetTableRow';
import { useLayout } from '@/contexts/LayoutContext';
import { cn } from '@/lib/utils';

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
  const { isMobile, isTablet, contentPadding, spacing } = useLayout();

  return (
    <Card className="glass-card border-0 shadow-lg animate-fade-in bg-white/50 dark:bg-black/50 backdrop-blur-xl w-full">
      <CardHeader className={cn("p-3 lg:p-6", isMobile && "p-3")}>
        <CardTitle className="flex items-center justify-between text-lg lg:text-xl">
          <span>Lista de Orçamentos</span>
          {budgets.length > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-[#fec832]/10 text-[#fec832] border-[#fec832]/20 font-semibold">
                {budgets.length}
              </Badge>
              {selectedBudgets.length > 0 && (
                <Badge variant="destructive" className="text-xs font-medium">
                  {selectedBudgets.length} selecionado{selectedBudgets.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className={cn("p-0 lg:p-6 lg:pt-0", isMobile && "p-0")}>
        <div className={cn(spacing.sm, isMobile ? "p-3" : isTablet ? "p-4" : "p-0")}>
          {/* Mobile Cards View - Otimizado */}
          <div className={cn("block lg:hidden", spacing.xs)}>
            {budgets.map((budget, index) => (
              <div
                key={budget.id}
                className="will-change-transform w-full"
                style={{
                  animationDelay: `${Math.min(index * 30, 300)}ms`,
                  transform: 'translateZ(0)'
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
          <div className="hidden lg:block overflow-x-auto w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="w-8">
                    <div className="opacity-60 hover:opacity-100 transition-opacity">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={onSelectAll}
                        className="w-3.5 h-3.5 transition-all duration-200 hover:scale-110 border-muted-foreground/40 data-[state=checked]:border-primary/60"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="font-bold text-foreground">Dispositivo</TableHead>
                  <TableHead className="font-bold text-foreground">Problema</TableHead>
                  <TableHead className="font-bold text-foreground">Valor</TableHead>
                  <TableHead className="font-bold text-foreground">Data</TableHead>
                  <TableHead className="font-bold text-foreground text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((budget, index) => (
                  <TableRow 
                    key={budget.id} 
                    className="hover:bg-muted/10 transition-colors duration-200 border-white/5 will-change-transform"
                    style={{
                      animationDelay: `${Math.min(index * 20, 200)}ms`,
                      transform: 'translateZ(0)'
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
