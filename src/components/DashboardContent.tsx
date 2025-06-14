
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, DollarSign, TrendingUp, Smartphone, Eye, Edit, Copy, Calendar, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardSkeleton } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/EmptyState';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const DashboardContent = () => {
  const { profile, hasPermission, user } = useAuth();
  const { showError } = useEnhancedToast();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found for dashboard stats');
        return {
          totalBudgets: 0,
          monthlyRevenue: 0,
          weeklyRevenue: 0,
          averageTicket: 0,
          monthlyGrowth: 0,
          weeklyGrowth: 0,
          topDevice: 'N/A',
          pendingBudgets: 0,
          approvedBudgets: 0,
          rejectedBudgets: 0,
          recentBudgets: []
        };
      }

      try {
        console.log('Fetching dashboard stats for user:', user.id);
        
        const { data: budgets, error } = await supabase
          .from('budgets')
          .select('id, total_price, device_model, created_at, client_name, status')
          .eq('owner_id', user.id);

        if (error) {
          console.error('Error fetching budgets for dashboard:', error);
          throw error;
        }

        console.log('Dashboard budgets fetched:', budgets?.length || 0);

        const total = budgets?.length || 0;
        const totalRevenue = budgets?.reduce((sum, budget) => sum + Number(budget.total_price), 0) || 0;
        
        // Cálculos para este mês
        const thisMonth = new Date();
        const monthlyBudgets = budgets?.filter(b => {
          const date = new Date(b.created_at);
          return date.getMonth() === thisMonth.getMonth() && date.getFullYear() === thisMonth.getFullYear();
        }) || [];
        
        // Cálculos para esta semana
        const today = new Date();
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        const weeklyBudgets = budgets?.filter(b => {
          const date = new Date(b.created_at);
          return date >= weekStart;
        }) || [];

        // Cálculos para mês anterior (para comparação)
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const lastMonthBudgets = budgets?.filter(b => {
          const date = new Date(b.created_at);
          return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
        }) || [];

        const monthlyRevenue = monthlyBudgets.reduce((sum, budget) => sum + Number(budget.total_price), 0);
        const weeklyRevenue = weeklyBudgets.reduce((sum, budget) => sum + Number(budget.total_price), 0);
        const lastMonthRevenue = lastMonthBudgets.reduce((sum, budget) => sum + Number(budget.total_price), 0);
        
        const averageTicket = total > 0 ? totalRevenue / total : 0;
        const monthlyGrowthPercent = lastMonthRevenue > 0 
          ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
          : monthlyRevenue > 0 ? 100 : 0;

        const deviceCount = budgets?.reduce((acc, budget) => {
          if (budget.device_model) {
            acc[budget.device_model] = (acc[budget.device_model] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>) || {};

        const topDevice = Object.entries(deviceCount).sort(([,a], [,b]) => b - a)[0];

        // Status dos orçamentos
        const pendingBudgets = budgets?.filter(b => b.status === 'pending').length || 0;
        const approvedBudgets = budgets?.filter(b => b.status === 'approved').length || 0;
        const rejectedBudgets = budgets?.filter(b => b.status === 'rejected').length || 0;

        return {
          totalBudgets: total,
          monthlyRevenue,
          weeklyRevenue,
          averageTicket,
          monthlyGrowth: monthlyGrowthPercent,
          weeklyGrowth: weeklyBudgets.length,
          topDevice: topDevice ? topDevice[0] : 'N/A',
          pendingBudgets,
          approvedBudgets,
          rejectedBudgets,
          recentBudgets: budgets?.slice(-5).reverse() || []
        };
      } catch (error: any) {
        console.error('Dashboard stats error:', error);
        showError({
          title: 'Erro ao carregar dados',
          description: error.message || 'Ocorreu um erro inesperado'
        });
        throw error;
      }
    },
    enabled: !!user,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (!user) {
    return (
      <div className="p-4 lg:p-8">
        <EmptyState
          icon={FileText}
          title="Faça login para continuar"
          description="Você precisa estar logado para ver seu dashboard."
        />
      </div>
    );
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    console.error('Dashboard error:', error);
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
      change: `${stats?.monthlyGrowth > 0 ? '+' : ''}${stats?.monthlyGrowth.toFixed(1)}%`,
      changeType: stats?.monthlyGrowth >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Faturamento Semanal',
      value: `R$ ${((stats?.weeklyRevenue || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: `${stats?.weeklyGrowth || 0} esta semana`,
      changeType: 'positive'
    },
    {
      title: 'Ticket Médio',
      value: `R$ ${((stats?.averageTicket || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      subtitle: `${stats?.totalBudgets || 0} orçamentos`
    },
    {
      title: 'Dispositivo Popular',
      value: stats?.topDevice || 'N/A',
      icon: Smartphone,
      color: 'text-[#fec832]',
      bgColor: 'bg-[#fec832]/10',
      subtitle: 'Mais reparado'
    },
    {
      title: 'Orçamentos Pendentes',
      value: stats?.pendingBudgets || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      subtitle: 'Aguardando aprovação'
    },
    {
      title: 'Taxa de Aprovação',
      value: `${stats?.totalBudgets > 0 ? ((stats?.approvedBudgets / stats?.totalBudgets) * 100).toFixed(1) : 0}%`,
      icon: Target,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      subtitle: `${stats?.approvedBudgets}/${stats?.totalBudgets} aprovados`
    }
  ];

  return (
    <ErrorBoundary>
      <div className="p-3 lg:p-8 space-y-4 lg:space-y-8 animate-fade-in">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-xl lg:text-3xl font-bold text-foreground">Meu Dashboard</h1>
            <p className="text-sm lg:text-base text-muted-foreground mt-1">
              Visão geral dos seus orçamentos
              {profile && (
                <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                  {profile.role.toUpperCase()}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs lg:text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span>{stats?.weeklyGrowth || 0} orçamentos esta semana</span>
          </div>
        </div>

        {/* Stats Cards - Mobile Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card 
                key={index} 
                className="glass-card hover:shadow-lg transition-all duration-200 hover:scale-[1.02] animate-scale-in border-0" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 lg:pb-3 p-3 lg:p-6">
                  <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground line-clamp-2">
                    {card.title}
                  </CardTitle>
                  <div className={`p-1.5 lg:p-2.5 rounded-xl ${card.bgColor} shadow-sm`}>
                    <Icon className={`h-3 w-3 lg:h-4 lg:w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 p-3 lg:p-6 pt-0">
                  <div className="text-sm lg:text-2xl font-bold text-foreground break-words">
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
                      <span className="text-xs text-muted-foreground hidden lg:inline">vs anterior</span>
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

        {/* Recent Budgets - Mobile Optimized */}
        <Card className="glass-card border-0 shadow-sm animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between pb-3 p-3 lg:p-6">
            <div>
              <CardTitle className="text-base lg:text-lg font-semibold text-foreground">
                Orçamentos Recentes
              </CardTitle>
              <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                Últimos 5 orçamentos criados
              </p>
            </div>
            {hasPermission('view_all_budgets') && (
              <Button size="sm" variant="outline" className="hidden lg:flex">
                Ver todos
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-3 lg:p-6">
            {stats?.recentBudgets && stats.recentBudgets.length > 0 ? (
              <div className="space-y-2 lg:space-y-3">
                {stats.recentBudgets.map((budget, index) => (
                  <div 
                    key={budget.id} 
                    className="flex items-center justify-between p-3 lg:p-4 border border-border/50 rounded-xl hover:bg-muted/30 transition-all duration-150 group animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex flex-col space-y-1 lg:space-y-2">
                        <div>
                          <p className="font-medium text-sm lg:text-base text-foreground group-hover:text-primary transition-colors truncate">
                            {budget.client_name || 'Cliente não informado'}
                          </p>
                          <p className="text-xs lg:text-sm text-muted-foreground truncate">{budget.device_model}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm lg:text-base text-foreground">
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
                      <div className="flex lg:space-x-1 ml-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hidden lg:flex">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hidden lg:flex">
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
