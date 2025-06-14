import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, DollarSign, TrendingUp, Smartphone, Eye, Edit, Copy, Calendar, Target, Clock, Users, LifeBuoy, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardSkeleton } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/EmptyState';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HelpDialog } from '@/components/HelpDialog';
import { DashboardChart } from '@/components/DashboardChart';

export const DashboardContent = () => {
  const { profile, hasPermission, user } = useAuth();
  const { showError } = useEnhancedToast();
  const [isHelpDialogOpen, setHelpDialogOpen] = useState(false);

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
          recentBudgets: [],
          chartData: [],
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

        // Chart data processing for the last 6 months
        const monthlyRevenueData = Array.from({ length: 6 }).map((_, i) => {
            const d = new Date();
            d.setDate(1); // Set to start of month to avoid issues
            d.setMonth(d.getMonth() - i);
            return {
                month: d.toLocaleString('pt-BR', { month: 'short' }),
                year: d.getFullYear(),
                revenue: 0,
            };
        }).reverse();

        budgets?.forEach(budget => {
            if(!budget.total_price) return;
            const budgetDate = new Date(budget.created_at);
            const monthIndex = monthlyRevenueData.findIndex(entry => 
                entry.month === budgetDate.toLocaleString('pt-BR', { month: 'short' }) &&
                entry.year === budgetDate.getFullYear()
            );

            if (monthIndex > -1) {
                monthlyRevenueData[monthIndex].revenue += Number(budget.total_price) / 100;
            }
        });

        const chartData = monthlyRevenueData.map(d => ({
            name: d.month.charAt(0).toUpperCase() + d.month.slice(1),
            Faturamento: parseFloat(d.revenue.toFixed(2))
        }));

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
          recentBudgets: budgets?.slice(-5).reverse() || [],
          chartData,
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

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
      bgColor: 'bg-green-50 dark:bg-green-950',
      change: `${stats?.monthlyGrowth > 0 ? '+' : ''}${stats?.monthlyGrowth.toFixed(1)}%`,
      changeType: stats?.monthlyGrowth >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Faturamento Semanal',
      value: `R$ ${((stats?.weeklyRevenue || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      change: `${stats?.weeklyGrowth || 0} esta semana`,
      changeType: 'positive'
    },
    {
      title: 'Ticket Médio',
      value: `R$ ${((stats?.averageTicket || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
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
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      subtitle: 'Aguardando aprovação'
    },
    {
      title: 'Taxa de Aprovação',
      value: `${stats?.totalBudgets > 0 ? ((stats?.approvedBudgets / stats?.totalBudgets) * 100).toFixed(1) : 0}%`,
      icon: Target,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
      subtitle: `${stats?.approvedBudgets}/${stats?.totalBudgets} aprovados`
    }
  ];

  return (
    <ErrorBoundary>
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in pb-24 lg:pb-0">
        {/* Header - Premium Mobile Design */}
        <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="animate-slide-up">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{getGreeting()}, {profile?.name || 'usuário'}!</h1>
            <div className="flex items-center space-x-2 mt-2">
              <p className="text-sm lg:text-base text-muted-foreground">
                Visão geral dos seus orçamentos
              </p>
              {profile && (
                <Badge variant="secondary" className="bg-[#fec832]/10 text-[#fec832] border-[#fec832]/20 text-xs">
                  {profile.role.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground glass-card p-3 rounded-2xl border border-white/10 animate-scale-in">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span>{stats?.weeklyGrowth || 0} orçamentos esta semana</span>
          </div>
        </div>

        {/* Stats Cards - Improved Mobile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card 
                key={index} 
                className="glass-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-scale-in border-0 bg-white/50 dark:bg-black/50 backdrop-blur-xl" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 p-4 lg:p-6">
                  <CardTitle className="text-sm lg:text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2.5 lg:p-3 rounded-2xl ${card.bgColor} shadow-lg`}>
                    <Icon className={`h-4 w-4 lg:h-5 lg:w-5 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 p-4 lg:p-6 pt-0">
                  <div className="text-lg lg:text-2xl font-bold text-foreground break-words">
                    {card.value}
                  </div>
                  {card.change && (
                    <div className="flex items-center space-x-1">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          card.changeType === 'positive' 
                            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400' 
                            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400'
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

        {/* Chart */}
        {stats?.chartData && stats.chartData.length > 0 && (
          <DashboardChart data={stats.chartData} />
        )}
        
        {/* Quick Access */}
        <Card className="glass-card border-0 shadow-lg animate-slide-up bg-white/50 dark:bg-black/50 backdrop-blur-xl">
          <CardHeader className="p-4 lg:p-6 pb-3">
              <CardTitle className="text-lg lg:text-xl font-semibold text-foreground">
                  Acesso Rápido
              </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 p-4 lg:p-6 pt-0">
              <Button onClick={() => setHelpDialogOpen(true)} className="w-full sm:w-auto">
                  <LifeBuoy className="mr-2" />
                  Ajuda
              </Button>
              <Button 
                  variant="outline" 
                  onClick={() => window.open('https://wa.me/556496028022', '_blank')}
                  className="w-full sm:w-auto text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
              >
                  <MessageCircle className="mr-2" />
                  Suporte WhatsApp
              </Button>
          </CardContent>
        </Card>

        {/* Recent Budgets - Premium Mobile Design */}
        <Card className="glass-card border-0 shadow-lg animate-slide-up bg-white/50 dark:bg-black/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4 p-4 lg:p-6">
            <div>
              <CardTitle className="text-lg lg:text-xl font-semibold text-foreground">
                Orçamentos Recentes
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Últimos 5 orçamentos criados
              </p>
            </div>
            {hasPermission('view_all_budgets') && (
              <Button size="sm" variant="outline" className="hidden lg:flex rounded-xl border-[#fec832]/20 text-[#fec832] hover:bg-[#fec832]/10">
                Ver todos
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            {stats?.recentBudgets && stats.recentBudgets.length > 0 ? (
              <div className="space-y-3 lg:space-y-4">
                {stats.recentBudgets.map((budget, index) => (
                  <div 
                    key={budget.id} 
                    className="flex items-center justify-between p-4 lg:p-5 glass-card border border-white/10 rounded-2xl hover:bg-muted/20 transition-all duration-300 group animate-fade-in hover:scale-[1.01]"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex flex-col space-y-2">
                        <div>
                          <p className="font-semibold text-sm lg:text-base text-foreground group-hover:text-[#fec832] transition-colors truncate">
                            {budget.client_name || 'Cliente não informado'}
                          </p>
                          <p className="text-xs lg:text-sm text-muted-foreground truncate">{budget.device_model}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm lg:text-base text-foreground">
                            R$ {((budget.total_price || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs capitalize ${
                              budget.status === 'approved' 
                                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400'
                                : budget.status === 'rejected'
                                ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400'
                            }`}
                          >
                            {budget.status === 'pending' ? 'Pendente' : 
                             budget.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {hasPermission('edit_own_budgets') && (
                      <div className="flex space-x-1 ml-2 opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-[#fec832]/10 hover:text-[#fec832]">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-blue-50 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-purple-50 hover:text-purple-600">
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
        <HelpDialog open={isHelpDialogOpen} onOpenChange={setHelpDialogOpen} />
      </div>
    </ErrorBoundary>
  );
};
