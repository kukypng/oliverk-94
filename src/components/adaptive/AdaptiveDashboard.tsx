
import React from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { MobileQuickAccess } from './MobileQuickAccess';
import { QuickAccess } from '@/components/dashboard/QuickAccess';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { LicenseStatus } from '@/components/dashboard/LicenseStatus';
import { HelpAndSupport } from '@/components/dashboard/HelpAndSupport';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, FileText, Clock } from 'lucide-react';
import { UserProfile } from '@/components/dashboard/types';

interface AdaptiveDashboardProps {
  onTabChange: (tab: string) => void;
  profile: UserProfile | null;
  weeklyGrowth: number;
  hasPermission: (permission: string) => boolean;
}

export const AdaptiveDashboard = ({ 
  onTabChange, 
  profile, 
  weeklyGrowth, 
  hasPermission 
}: AdaptiveDashboardProps) => {
  const { isMobile, isTablet, isDesktop, contentPadding } = useLayout();

  const stats = {
    totalBudgets: 0,
    weeklyGrowth
  };

  if (isMobile) {
    return (
      <div className={`${contentPadding} space-y-6 pb-24 animate-fade-in`}>
        {/* Header compacto para mobile */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Olá, {profile?.name?.split(' ')[0] || 'Usuário'}! 👋
          </h1>
          <p className="text-muted-foreground text-sm">
            Gerencie seus orçamentos de forma simples
          </p>
        </div>

        {/* Stats cards em scroll horizontal */}
        <div className="overflow-x-auto pb-2 -mx-4">
          <div className="flex gap-4 px-4 min-w-max">
            <Card className="min-w-[140px] glass-card">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Esta semana</p>
                <p className="text-lg font-bold text-green-600">+{weeklyGrowth}</p>
              </CardContent>
            </Card>
            <Card className="min-w-[140px] glass-card">
              <CardContent className="p-4 text-center">
                <FileText className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Orçamentos</p>
                <p className="text-lg font-bold">-</p>
              </CardContent>
            </Card>
            <Card className="min-w-[140px] glass-card">
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Pendentes</p>
                <p className="text-lg font-bold">-</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Access adaptado para mobile */}
        <MobileQuickAccess onTabChange={onTabChange} stats={stats} />

        {/* License status compacto */}
        <LicenseStatus />

        {/* Help section simplificado */}
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Precisa de Ajuda?</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              Entre em contato via WhatsApp para suporte
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => window.open('https://wa.me/556496028022', '_blank')}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                WhatsApp
              </button>
              <button 
                onClick={() => onTabChange('settings')}
                className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Configurações
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className={`${contentPadding} space-y-6 animate-fade-in`}>
        <DashboardHeader profile={profile} weeklyGrowth={weeklyGrowth} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickAccess onTabChange={onTabChange} hasPermission={hasPermission} />
          <div className="space-y-6">
            <LicenseStatus />
            <HelpAndSupport />
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout - mantém o layout original mas otimizado
  return (
    <div className={`${contentPadding} space-y-8 animate-fade-in`}>
      <DashboardHeader profile={profile} weeklyGrowth={weeklyGrowth} />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <QuickAccess onTabChange={onTabChange} hasPermission={hasPermission} />
        </div>
        <div className="space-y-6">
          <LicenseStatus />
          <HelpAndSupport />
        </div>
      </div>
    </div>
  );
};
