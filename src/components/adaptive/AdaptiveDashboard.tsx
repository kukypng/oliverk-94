
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
  const { isMobile, isTablet, contentPadding, gridCols, spacing } = useLayout();
  const { signOut } = useAuth();

  const renderMobileHeader = () => (
    <div className="sticky top-0 z-40 bg-background/98 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-sm">
              {profile?.name || 'Usuário'}
            </h2>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
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
            className="w-8 h-8 p-0"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTabletUserInfo = () => (
    <Card className="glass-card mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {profile?.name || 'Usuário'}
              </h3>
              <Badge variant="secondary" className="text-xs mt-0.5">
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
              className="gap-2 text-sm"
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
      <div className="min-h-screen bg-background w-full">
        {renderMobileHeader()}
        
        <div className={cn("w-full", spacing.xs, contentPadding)}>
          <DashboardHeader profile={profile} weeklyGrowth={weeklyGrowth} />
          
          <MobileQuickAccess 
            onTabChange={onTabChange}
            hasPermission={hasPermission}
          />
          
          <LicenseStatus />
          <HelpAndSupport />
        </div>
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className={cn("w-full", spacing.md, contentPadding)}>
        {renderTabletUserInfo()}
        
        <DashboardHeader profile={profile} weeklyGrowth={weeklyGrowth} />
        
        <div className={cn("grid gap-6", gridCols)}>
          <QuickAccess onTabChange={onTabChange} hasPermission={hasPermission} />
          <div className={spacing.md}>
            <LicenseStatus />
            <HelpAndSupport />
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className={cn("w-full", spacing.lg, contentPadding)}>
      <DashboardHeader profile={profile} weeklyGrowth={weeklyGrowth} />
      
      <div className={cn("grid gap-6", gridCols)}>
        <div className="lg:col-span-2">
          <QuickAccess onTabChange={onTabChange} hasPermission={hasPermission} />
        </div>
        <div className={spacing.md}>
          <LicenseStatus />
          <HelpAndSupport />
        </div>
      </div>
    </div>
  );
};
