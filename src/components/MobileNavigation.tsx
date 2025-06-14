
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
      {/* Bottom Navigation - Apple-inspired */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="glass border-t border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur-xl">
          <div className="grid grid-cols-4 h-20 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    "h-full rounded-xl flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-all duration-300 ease-out mx-1",
                    isActive 
                      ? "text-[#fec832] bg-[#fec832]/10 scale-105" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/20 hover:scale-105"
                  )}
                  onClick={() => onTabChange(item.id)}
                >
                  <div className={cn(
                    "relative transition-all duration-300 ease-out",
                    isActive && "animate-bounce-subtle"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive && "text-[#fec832] scale-110"
                    )} />
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#fec832] rounded-full animate-pulse" />
                    )}
                  </div>
                  <span className={cn(
                    "text-xs transition-all duration-300",
                    isActive ? "text-[#fec832] font-semibold" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                </Button>
              );
            })}
          </div>
          <div className="pb-safe-bottom" />
        </div>
      </div>

      {/* Mobile Header - Premium Design */}
      <div className="lg:hidden glass-card border-0 border-b border-white/10 sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#fec832] to-[#fec832]/80 rounded-2xl shadow-lg">
                <FileText className="h-6 w-6 text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-black animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Oliver</h1>
              <p className="text-xs text-muted-foreground">Gestão Premium</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMenuToggle}
            className="h-10 w-10 rounded-2xl hover:bg-muted/20 transition-all duration-300 hover:scale-110"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );
};
