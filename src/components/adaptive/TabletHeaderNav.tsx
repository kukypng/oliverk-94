
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, FileText, Plus, Settings, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabletHeaderNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMenuToggle?: () => void;
}

export const TabletHeaderNav = ({ activeTab, onTabChange, onMenuToggle }: TabletHeaderNavProps) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'budgets', icon: FileText, label: 'Orçamentos' },
    { id: 'settings', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="flex items-center justify-between h-16 px-6 bg-card/95 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <img src="/icone.png" alt="Oliver Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-foreground">Oliver</h1>
        </div>
        
        <nav className="hidden sm:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "gap-2 transition-all duration-200",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => onTabChange('new-budget')}
          size="sm"
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Novo Orçamento
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="sm:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
