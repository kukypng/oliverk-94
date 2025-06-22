
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, FileText, Plus, Settings, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLayout } from '@/contexts/LayoutContext';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasPermission: (permission: string) => boolean;
}

export const MobileBottomNav = ({ activeTab, onTabChange, hasPermission }: MobileBottomNavProps) => {
  const { safeArea } = useLayout();
  
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Início' },
    { id: 'budgets', icon: FileText, label: 'Orçamentos' },
    { id: 'new-budget', icon: Plus, label: 'Novo', isPrimary: true },
    { id: 'admin', icon: Shield, label: 'Admin', permission: 'manage_users' },
    { id: 'settings', icon: Settings, label: 'Config' },
  ].filter(item => !item.permission || hasPermission(item.permission));

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/98 backdrop-blur-xl border-t border-border/50"
      style={{ paddingBottom: `${safeArea.bottom}px` }}
    >
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex-1 flex-col h-12 gap-0.5 relative transition-all duration-200 mx-0.5",
                item.isPrimary && "mx-1",
                item.isPrimary 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-medium" 
                  : isActive 
                    ? "text-primary bg-primary/5" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {item.isPrimary && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-xl -z-10" />
              )}
              <Icon className={cn(
                "h-4 w-4 transition-transform duration-200",
                isActive && !item.isPrimary && "scale-110",
                item.isPrimary && "h-5 w-5"
              )} />
              <span className={cn(
                "text-[10px] font-medium leading-tight",
                item.isPrimary && "font-semibold text-[11px]"
              )}>
                {item.label}
              </span>
              {isActive && !item.isPrimary && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
