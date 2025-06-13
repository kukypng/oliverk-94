
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  FileText, 
  Settings, 
  Plus,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMenuToggle: () => void;
}

export const MobileNavigation = ({ activeTab, onTabChange, onMenuToggle }: MobileNavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'budgets', label: 'Orçamentos', icon: FileText },
    { id: 'new-budget', label: 'Novo', icon: Plus },
    { id: 'settings', label: 'Config', icon: Settings },
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border lg:hidden">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "h-full rounded-none flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-background border-b border-border p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl">
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Oliver</h1>
              <p className="text-xs text-muted-foreground">Gestão de Orçamentos</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );
};
