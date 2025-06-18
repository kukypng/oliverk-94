
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, DollarSign } from 'lucide-react';

interface BudgetsClientsProps {
  budgets: any[];
}

export const BudgetsClients = ({ budgets }: BudgetsClientsProps) => {
  // Group budgets by client
  const clientStats = budgets.reduce((acc, budget) => {
    const clientName = budget.client_name || 'Cliente sem nome';
    const clientKey = clientName.toLowerCase();
    
    if (!acc[clientKey]) {
      acc[clientKey] = {
        name: clientName,
        budgets: [],
        totalValue: 0,
        lastBudget: null
      };
    }
    
    acc[clientKey].budgets.push(budget);
    acc[clientKey].totalValue += parseFloat(budget.price) || 0;
    
    const budgetDate = new Date(budget.created_at);
    if (!acc[clientKey].lastBudget || budgetDate > new Date(acc[clientKey].lastBudget)) {
      acc[clientKey].lastBudget = budget.created_at;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const clientList = Object.values(clientStats).sort((a: any, b: any) => b.budgets.length - a.budgets.length);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (clientList.length === 0) {
    return (
      <Card className="glass-card border-0">
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum cliente encontrado</h3>
          <p className="text-sm text-muted-foreground">
            Quando você criar orçamentos, os clientes aparecerão aqui.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="glass-card border-0">
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
            <Users className="h-5 w-5" />
            Clientes ({clientList.length})
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-3 lg:gap-4">
        {clientList.map((client: any, index) => (
          <Card key={index} className="glass-card border-0 hover:shadow-medium transition-all duration-200">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base lg:text-lg font-semibold text-foreground truncate">
                      {client.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {client.budgets.length} orçamento{client.budgets.length > 1 ? 's' : ''}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Último: {formatDate(client.lastBudget)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between lg:justify-end lg:flex-col lg:items-end space-x-4 lg:space-x-0">
                  <div className="text-right">
                    <p className="text-lg lg:text-xl font-bold text-foreground">
                      {formatCurrency(client.totalValue)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Valor total
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
