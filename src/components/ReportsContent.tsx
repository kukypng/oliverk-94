
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export const ReportsContent = () => {
  return (
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground mt-2">Análise e métricas do seu negócio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="glass-card card-hover animate-scale-in">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Orçamentos</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">24</div>
            <p className="text-xs text-muted-foreground">+12% do mês passado</p>
          </CardContent>
        </Card>

        <Card className="glass-card card-hover animate-scale-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receita</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">R$ 5.420</div>
            <p className="text-xs text-muted-foreground">+8% do mês passado</p>
          </CardContent>
        </Card>

        <Card className="glass-card card-hover animate-scale-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Clientes</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">18</div>
            <p className="text-xs text-muted-foreground">+3 novos este mês</p>
          </CardContent>
        </Card>

        <Card className="glass-card card-hover animate-scale-in" style={{ animationDelay: '300ms' }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Crescimento</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">+15%</div>
            <p className="text-xs text-muted-foreground">Taxa de conversão</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="glass-card animate-slide-up">
        <CardHeader>
          <CardTitle className="text-xl">Relatórios Detalhados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Relatórios em desenvolvimento</p>
            <p className="text-sm">Em breve você terá acesso a análises detalhadas do seu negócio</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
