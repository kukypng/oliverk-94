import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Eye, Edit, Copy, TrendingUp, LifeBuoy, MessageCircle, PlusCircle, List, Users, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardSkeleton } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/EmptyState';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HelpDialog } from '@/components/HelpDialog';

interface DashboardContentProps {
  onTabChange: (tab: string) => void;
}

export const DashboardContent = ({ onTabChange }: DashboardContentProps) => {
  const { profile, hasPermission, user } = useAuth();
  const { showError } = useEnhancedToast();
  const [isHelpDialogOpen, setHelpDialogOpen] = useState(false);

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats-simplified', user?.id],
    queryFn: async () => {
      if (!user) return { weeklyGrowth: 0, recentBudgets: [] };

      try {
        const { data: budgets, error } = await supabase
          .from('budgets')
          .select('id, total_price, created_at, client_name, device_model, status')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching budgets for dashboard:', error);
          throw error;
        }
        
        const today = new Date();
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        const weeklyBudgets = budgets?.filter(b => {
          const date = new Date(b.created_at);
          return date >= weekStart;
        }) || [];

        return {
          weeklyGrowth: weeklyBudgets.length,
          recentBudgets: budgets?.slice(0, 5) || []
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

  const quickAccessButtons = [
    { label: 'Novo Orçamento', icon: PlusCircle, tab: 'new-budget', permission: 'create_budgets' },
    { label: 'Ver Orçamentos', icon: List, tab: 'budgets', permission: 'view_own_budgets' },
    { label: 'Clientes', icon: Users, tab: 'clients', permission: 'view_clients' }, // Assuming a 'view_clients' permission
    { label: 'Configurações', icon: Settings, tab: 'settings', permission: null },
    { label: 'Painel Admin', icon: Shield, tab: 'admin', permission: 'access_admin_panel' },
  ];

  return (
    <ErrorBoundary>
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in pb-24 lg:pb-0">
        {/* Header */}
        <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="animate-slide-up">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{getGreeting()}, {profile?.name || 'usuário'}!</h1>
            <div className="flex items-center space-x-2 mt-2">
              <p className="text-sm lg:text-base text-muted-foreground">
                Seja bem-vindo(a) de volta!
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
        
        {/* Quick Access */}
        <Card className="glass-card border-0 shadow-lg animate-slide-up bg-white/50 dark:bg-black/50 backdrop-blur-xl">
          <CardHeader className="p-4 lg:p-6 pb-3">
              <CardTitle className="text-lg lg:text-xl font-semibold text-foreground">
                  Acesso Rápido
              </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 lg:p-6 pt-0">
              {quickAccessButtons.map(btn => {
                if (btn.permission && !hasPermission(btn.permission)) return null;
                const Icon = btn.icon;
                return (
                  <Button key={btn.tab} variant="outline" onClick={() => onTabChange(btn.tab)} className="flex-col h-24 text-center">
                    <Icon className="h-6 w-6 mb-2" />
                    <span>{btn.label}</span>
                  </Button>
                )
              })}
          </CardContent>
        </Card>
        
        {/* Help and Support */}
        <Card className="glass-card border-0 shadow-lg animate-slide-up bg-white/50 dark:bg-black/50 backdrop-blur-xl">
          <CardHeader className="p-4 lg:p-6 pb-3">
              <CardTitle className="text-lg lg:text-xl font-semibold text-foreground">
                  Precisa de ajuda?
              </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 p-4 lg:p-6 pt-0">
              <Button onClick={() => setHelpDialogOpen(true)} className="w-full sm:w-auto">
                  <LifeBuoy className="mr-2" />
                  Ajuda & Dicas
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

        {/* Recent Budgets */}
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
              <Button size="sm" variant="outline" onClick={() => onTabChange('budgets')} className="hidden lg:flex rounded-xl border-[#fec832]/20 text-[#fec832] hover:bg-[#fec832]/10">
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
