
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  FileText, 
  Settings, 
  LogOut, 
  Smartphone,
  Wrench,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { signOut, user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'budgets', label: 'Orçamentos', icon: FileText },
    { id: 'new-budget', label: 'Novo Orçamento', icon: Plus },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col shadow-lg lg:shadow-none animate-slide-up">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border/50">
        <div className="flex items-center space-x-3 animate-fade-in">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-110">
            <div className="flex items-center space-x-1">
              <Smartphone className="h-5 w-5 text-primary-foreground" />
              <Wrench className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">Oliver</h1>
            <p className="text-sm text-sidebar-foreground/70">Gestão de Orçamentos</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border/50">
        <div className="flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.user_metadata?.name || user?.email}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-12 text-left font-medium rounded-xl transition-all duration-300 ease-out mobile-touch animate-fade-in",
                activeTab === item.id 
                  ? "bg-primary/10 text-primary hover:bg-primary/15 shadow-sm scale-[1.02]" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:scale-[1.01]"
              )}
              onClick={() => onTabChange(item.id)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 h-12 rounded-xl transition-all duration-300 ease-out mobile-touch"
          onClick={signOut}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
};
