
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, DollarSign, TrendingUp, Smartphone, Eye, Edit, Copy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardSkeleton } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/EmptyState';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const DashboardContent = () => {
  const { profile, hasPermission } = useAuth();
  const { showError } = useToast();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        const { data: budgets, error } = await supabase
          .from('budgets')
          .select('id, total_price, device_model, created_at, client_name, status');

        if (error) throw error;

        const total = budgets?.length || 0;
        const totalRevenue = budgets?.reduce((sum, budget) => sum + Number(budget.total_price), 0) || 0;
        
        const thisMonth = new Date();
        const monthlyBudgets = budgets?.filter(b => {
          const date = new Date(b.created_at);
          return date.getMonth() === thisMonth.getMonth() && date.getFullYear() === thisMonth.getFullYear();
        }) || [];
        
        const monthlyRevenue = monthlyBudgets.reduce((sum, budget) => sum + Number(budget.total_price), 0);
        const averageTicket = total > 0 ? totalRevenue / total : 0;

        const deviceCount = budgets?.reduce((acc, budget) => {
          if (budget.device_model) {
            acc[budget.device_model] = (acc[budget.device_model] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>) || {};

        const topDevice = Object.entries(deviceCount).sort(([,a], [,b]) => b - a)[0];

        return {
          totalBudgets: total,
          monthlyRevenue,
          averageTicket,
          monthlyGrowth: monthlyBudgets.length,
          topDevice: topDevice ? topDevice[0] : 'N/A',
          recentBudgets: budgets?.slice(-5).reverse() || []
        };
      } catch (error: any) {
        showError({
          title: 'Erro ao carregar dados',
          description: error.message || 'Ocorreu um erro inesperado'
        });
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <EmptyState
          icon={FileText}
          title="Erro ao carregar dashboard"
          description="Não foi possível carregar os dados do dashboard. Tente novamente."
          action={{
            label: "Tentar Novamente",
            onClick: () => window.location.reload()
          }}
        />
      </div>
    );
  }

  const cards = [
    {
      title: 'Faturamento Mensal',
      value: `R$ ${((stats?.monthlyRevenue || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      title: 'Total de Orçamentos',
      value: stats?.totalBudgets || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: `+${stats?.monthlyGrowth || 0}`,
      changeType: 'positive'
    },
    {
      title: 'Ticket Médio',
      value: `R$ ${((stats?.averageTicket || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+8.2%',
      changeType: 'positive'
    },
    {
      title: 'Dispositivo Popular',
      value: stats?.topDevice || 'N/A',
      icon: Smartphone,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      subtitle: 'Mais reparado'
    }
  ];

  return (
    <ErrorBoundary>
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Visão geral dos seus orçamentos
              {profile && (
                <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                  {profile.role.toUpperCase()}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span>{stats?.monthlyGrowth || 0} orçamentos este mês</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card 
                key={index} 
                className="glass-card hover:shadow-lg transition-all duration-200 hover:scale-[1.02] animate-scale-in border-0" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2.5 rounded-xl ${card.bgColor} shadow-sm`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-2xl font-bold text-foreground">
                    {card.value}
                  </div>
                  {card.change && (
                    <div className="flex items-center space-x-1">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          card.changeType === 'positive' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {card.change}
                      </Badge>
                      <span className="text-xs text-muted-foreground">vs mês anterior</span>
                    </div>
                  )}
                  {card.subtitle && (
                    <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Budgets */}
        <Card className="glass-card border-0 shadow-sm animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                Orçamentos Recentes
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Últimos 5 orçamentos criados
              </p>
            </div>
            {hasPermission('view_all_budgets') && (
              <Button size="sm" variant="outline">
                Ver todos
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {stats?.recentBudgets && stats.recentBudgets.length > 0 ? (
              <div className="space-y-3">
                {stats.recentBudgets.map((budget, index) => (
                  <div 
                    key={budget.id} 
                    className="flex items-center justify-between p-4 border border-border/50 rounded-xl hover:bg-muted/30 transition-all duration-150 group animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {budget.client_name || 'Cliente não informado'}
                          </p>
                          <p className="text-sm text-muted-foreground">{budget.device_model}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-semibold text-foreground">
                            R$ {((budget.total_price || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs capitalize ${
                              budget.status === 'approved' 
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : budget.status === 'rejected'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}
                          >
                            {budget.status === 'pending' ? 'Pendente' : 
                             budget.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {hasPermission('edit_own_budgets') && (
                      <div className="flex space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title="Nenhum orçamento encontrado"
                description="Você ainda não criou nenhum orçamento. Comece criando seu primeiro orçamento para acompanhar suas vendas."
                action={hasPermission('create_budgets') ? {
                  label: "Criar Primeiro Orçamento",
                  onClick: () => {
                    console.log('Navigate to new budget');
                  }
                } : undefined}
                className="border-0 shadow-none"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};
