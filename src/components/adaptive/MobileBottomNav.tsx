
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, FileText, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileBottomNav = ({ activeTab, onTabChange }: MobileBottomNavProps) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Início' },
    { id: 'budgets', icon: FileText, label: 'Orçamentos' },
    { id: 'new-budget', icon: Plus, label: 'Novo', isPrimary: true },
    { id: 'settings', icon: Settings, label: 'Config' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border pb-safe-bottom">
      <div className="flex items-center justify-around h-16 px-2">
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
                "flex-1 flex-col h-14 gap-1 relative transition-all duration-200",
                item.isPrimary && "mx-2",
                item.isPrimary 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full" 
                  : isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.isPrimary && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-full -z-10" />
              )}
              <Icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive && !item.isPrimary && "scale-110",
                item.isPrimary && "h-6 w-6"
              )} />
              <span className={cn(
                "text-xs font-medium",
                item.isPrimary && "font-semibold"
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
