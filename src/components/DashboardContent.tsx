
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText, DollarSign, TrendingUp, Smartphone, Eye, Edit, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const DashboardContent = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Buscar estatísticas dos orçamentos
      const { data: budgets, error } = await supabase
        .from('budgets')
        .select('id, total_price, device_model, created_at, client_name, status');

      if (error) throw error;

      const total = budgets?.length || 0;
      const totalRevenue = budgets?.reduce((sum, budget) => sum + Number(budget.total_price), 0) || 0;
      
      // Calcular faturamento mensal
      const thisMonth = new Date();
      const monthlyBudgets = budgets?.filter(b => {
        const date = new Date(b.created_at);
        return date.getMonth() === thisMonth.getMonth() && date.getFullYear() === thisMonth.getFullYear();
      }) || [];
      
      const monthlyRevenue = monthlyBudgets.reduce((sum, budget) => sum + Number(budget.total_price), 0);
      const averageTicket = total > 0 ? totalRevenue / total : 0;

      // Dispositivos mais populares
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
    }
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Faturamento Mensal',
      value: `R$ ${((stats?.monthlyRevenue || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total de Orçamentos',
      value: stats?.totalBudgets || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Ticket Médio',
      value: `R$ ${((stats?.averageTicket || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Dispositivo Popular',
      value: stats?.topDevice || 'N/A',
      icon: Smartphone,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Visão geral dos seus orçamentos</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUp className="h-4 w-4" />
          <span>{stats?.monthlyGrowth || 0} orçamentos este mês</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {card.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Budgets */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Orçamentos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats?.recentBudgets && stats.recentBudgets.length > 0 ? (
            <div className="space-y-4">
              {stats.recentBudgets.map((budget) => (
                <div key={budget.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium text-gray-900">{budget.client_name}</p>
                        <p className="text-sm text-gray-500">{budget.device_model}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          R$ {((budget.total_price || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">{budget.status}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum orçamento encontrado</p>
              <p className="text-sm">Crie seu primeiro orçamento para começar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
