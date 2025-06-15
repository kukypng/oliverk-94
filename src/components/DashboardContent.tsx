import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FileText } from 'lucide-react';
import { DashboardSkeleton } from '@/components/ui/loading-states';
import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { useLicenseNotifications } from '@/hooks/useLicenseNotifications';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { QuickAccess } from './dashboard/QuickAccess';
import { HelpAndSupport } from './dashboard/HelpAndSupport';
import { LicenseStatus } from './dashboard/LicenseStatus';
import { UserProfile } from './dashboard/types';
import { EnhancedDashboardSkeleton } from '@/components/ui/enhanced-loading';

interface DashboardContentProps {
  onTabChange: (tab: string) => void;
}

export const DashboardContent = ({ onTabChange }: DashboardContentProps) => {
  useLicenseNotifications();
  const { profile, hasPermission, user } = useAuth();
  const { showError } = useEnhancedToast();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-weekly-growth', user?.id],
    queryFn: async () => {
      if (!user) return { weeklyGrowth: 0 };

      try {
        const today = new Date();
        const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
        weekStart.setHours(0, 0, 0, 0);

        const { error, count } = await supabase
          .from('budgets')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id)
          .gte('created_at', weekStart.toISOString());

        if (error) {
          console.error('Error fetching weekly growth:', error);
          throw error;
        }

        return {
          weeklyGrowth: count || 0,
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
    return <EnhancedDashboardSkeleton />;
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
      <div className="p-6 lg:p-10 space-y-8 lg:space-y-10 animate-fade-in pb-24 lg:pb-10">
        <DashboardHeader profile={profile as UserProfile | null} weeklyGrowth={stats?.weeklyGrowth || 0} />
        
        <QuickAccess onTabChange={onTabChange} hasPermission={hasPermission} />
        
        <LicenseStatus />
        
        <HelpAndSupport />
      </div>
    </ErrorBoundary>
  );
};
