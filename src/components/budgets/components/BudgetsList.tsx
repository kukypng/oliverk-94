
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
    <Card className="glass-card border-0 shadow-lg animate-slide-up bg-white/50 dark:bg-black/50 backdrop-blur-xl">
      <CardHeader className="p-4 lg:p-6">
        <CardTitle className="flex items-center justify-between text-lg lg:text-xl">
          <span>Lista de Orçamentos</span>
          {budgets.length > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-[#fec832]/10 text-[#fec832] border-[#fec832]/20 animate-fade-in">
                {budgets.length}
              </Badge>
              {selectedBudgets.length > 0 && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  {selectedBudgets.length} selecionado{selectedBudgets.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 lg:p-6 lg:pt-0">
        <div className="space-y-3 lg:space-y-0 p-4 lg:p-0">
          {/* Mobile Cards View */}
          <div className="block lg:hidden space-y-4">
            {budgets.map((budget, index) => (
              <div
                key={budget.id}
                className="animate-fade-in hover:animate-scale-in"
                style={{
                  animationDelay: `${index * 50}ms`
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
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={onSelectAll}
                      className="w-4 h-4 transition-all duration-200 hover:scale-110"
                    />
                  </TableHead>
                  <TableHead className="font-semibold">Dispositivo</TableHead>
                  <TableHead className="font-semibold">Problema</TableHead>
                  <TableHead className="font-semibold">Valor</TableHead>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((budget, index) => (
                  <TableRow 
                    key={budget.id} 
                    className="hover:bg-muted/20 transition-all duration-300 border-white/10 animate-fade-in hover:scale-[1.01]"
                    style={{
                      animationDelay: `${index * 30}ms`
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
