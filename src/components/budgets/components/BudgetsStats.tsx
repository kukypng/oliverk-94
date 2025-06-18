
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, DollarSign, Users } from 'lucide-react';

interface BudgetsStatsProps {
  budgets: any[];
}

export const BudgetsStats = ({ budgets }: BudgetsStatsProps) => {
  // Calculate statistics
  const totalBudgets = budgets.length;
  const totalValue = budgets.reduce((sum, budget) => sum + (parseFloat(budget.price) || 0), 0);
  const uniqueClients = new Set(budgets.map(budget => budget.client_name?.toLowerCase())).size;
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthBudgets = budgets.filter(budget => {
    const budgetDate = new Date(budget.created_at);
    return budgetDate.getMonth() === currentMonth && budgetDate.getFullYear() === currentYear;
  });

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthBudgets = budgets.filter(budget => {
    const budgetDate = new Date(budget.created_at);
    return budgetDate.getMonth() === lastMonth && budgetDate.getFullYear() === lastMonthYear;
  });

  const monthlyGrowth = lastMonthBudgets.length > 0 
    ? ((thisMonthBudgets.length - lastMonthBudgets.length) / lastMonthBudgets.length) * 100
    : thisMonthBudgets.length > 0 ? 100 : 0;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <Card className="glass-card border-0">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">Total de Orçamentos</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{totalBudgets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-green-500" />
              </div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-lg lg:text-xl font-bold text-foreground">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 lg:h-6 lg:w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">Clientes Únicos</p>
                <p className="text-xl lg:text-2xl font-bold text-foreground">{uniqueClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 lg:h-6 lg:w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs lg:text-sm font-medium text-muted-foreground">Este Mês</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xl lg:text-2xl font-bold text-foreground">{thisMonthBudgets.length}</p>
                  {monthlyGrowth !== 0 && (
                    <Badge 
                      variant={monthlyGrowth > 0 ? "default" : "destructive"}
                      className="text-xs px-2 py-0.5"
                    >
                      {monthlyGrowth > 0 ? '+' : ''}{monthlyGrowth.toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance */}
      <Card className="glass-card border-0">
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-lg lg:text-xl">Performance Mensal</CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Mês Atual</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">{thisMonthBudgets.length} orçamentos</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(thisMonthBudgets.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0))}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Mês Anterior</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">{lastMonthBudgets.length} orçamentos</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(lastMonthBudgets.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0))}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
