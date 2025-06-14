
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { UserProfile } from './types';

interface DashboardHeaderProps {
  profile: UserProfile | null;
  weeklyGrowth: number;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

export const DashboardHeader = ({ profile, weeklyGrowth }: DashboardHeaderProps) => {
  return (
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
        <span>{weeklyGrowth || 0} orçamentos esta semana</span>
      </div>
    </div>
  );
};
