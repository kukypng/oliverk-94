
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Users, Calendar, DollarSign } from 'lucide-react';

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
      <Card className="card-modern border-0">
        <CardContent className="p-8 text-center">
          <div className="p-4 rounded-2xl bg-primary/10 w-fit mx-auto mb-4">
            <User className="h-12 w-12 text-primary mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum cliente encontrado</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Quando você criar orçamentos, os clientes aparecerão aqui organizados com suas estatísticas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="card-modern border-0 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-xl lg:text-2xl flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Users className="h-6 w-6" />
            </div>
            <span>Clientes ({clientList.length})</span>
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:gap-6">
        {clientList.map((client: any, index) => (
          <Card key={index} className="card-modern border-0 hover:shadow-strong transition-all duration-300 group">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <User className="h-6 w-6 lg:h-7 lg:w-7 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg lg:text-xl font-semibold text-foreground truncate mb-2">
                      {client.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1"
                      >
                        {client.budgets.length} orçamento{client.budgets.length > 1 ? 's' : ''}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-lg">
                        <Calendar className="h-3 w-3" />
                        Último: {formatDate(client.lastBudget)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between lg:justify-end lg:flex-col lg:items-end space-x-4 lg:space-x-0">
                  <div className="text-right">
                    <p className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      {formatCurrency(client.totalValue)}
                    </p>
                    <p className="text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded-lg mt-1">
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
