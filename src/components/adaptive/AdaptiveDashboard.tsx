import React from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { QuickAccess } from '@/components/dashboard/QuickAccess';
import { MobileQuickAccess } from './MobileQuickAccess';
import { LicenseStatus } from '@/components/dashboard/LicenseStatus';
import { HelpAndSupport } from '@/components/dashboard/HelpAndSupport';
import { UserProfile } from '@/components/dashboard/types';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
  const { isMobile, isTablet, contentPadding } = useLayout();
  const { signOut } = useAuth();

  const renderMobileHeader = () => (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              {profile?.name || 'Usuário'}
            </h2>
            <Badge variant="secondary" className="text-xs">
              {profile?.role.toUpperCase() || 'USER'}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="w-9 h-9 p-0"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTabletUserInfo = () => (
    <Card className="glass-card mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {profile?.name || 'Usuário'}
              </h3>
              <Badge variant="secondary" className="text-xs mt-1">
                {profile?.role.toUpperCase() || 'USER'}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {renderMobileHeader()}
        
        <div className="p-4 space-y-6">
          <DashboardHeader profile={profile} weeklyGrowth={weeklyGrowth} />
          
          <MobileQuickAccess 
            onTabChange={onTabChange}
            stats={{ totalBudgets: 0, weeklyGrowth }}
          />
          
          <LicenseStatus />
          <HelpAndSupport />
        </div>
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className={cn("space-y-6", contentPadding)}>
        {renderTabletUserInfo()}
        
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

  // Desktop layout
  return (
    <div className={cn("space-y-6", contentPadding)}>
      <DashboardHeader profile={profile} weeklyGrowth={weeklyGrowth} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
