
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText } from 'lucide-react';
import { DashboardSkeleton } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { QuickAccess } from './dashboard/QuickAccess';
import { HelpAndSupport } from './dashboard/HelpAndSupport';
import { RecentBudgets } from './dashboard/RecentBudgets';
import { UserProfile } from './dashboard/types';

interface DashboardContentProps {
  onTabChange: (tab: string) => void;
}

export const DashboardContent = ({ onTabChange }: DashboardContentProps) => {
  const { profile, hasPermission, user } = useAuth();
  const { showError } = useEnhancedToast();

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

  return (
    <ErrorBoundary>
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in pb-24 lg:pb-0">
        <DashboardHeader profile={profile as UserProfile | null} weeklyGrowth={stats?.weeklyGrowth || 0} />
        
        <QuickAccess onTabChange={onTabChange} hasPermission={hasPermission} />
        
        <HelpAndSupport />

        <RecentBudgets 
          recentBudgets={stats?.recentBudgets || []} 
          hasPermission={hasPermission} 
          onTabChange={onTabChange} 
        />
      </div>
    </ErrorBoundary>
  );
};
