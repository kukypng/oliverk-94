
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, 
  FileText, 
  Settings, 
  Plus,
  LogOut, 
  User,
  Star,
  Shield,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { signOut, user, profile, hasRole } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'budgets', label: 'Orçamentos', icon: FileText },
    { id: 'new-budget', label: 'Novo Orçamento', icon: Plus },
    ...(hasRole('admin') ? [{ id: 'admin', label: 'Administração', icon: Users }] : []),
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-50">
      <div className="flex flex-col flex-grow bg-background border-r border-border overflow-y-auto">
        {/* Header */}
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary text-primary-foreground">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary-foreground/20 rounded-lg">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold">Oliver</span>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.name || 'Usuário'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
              <Badge variant="secondary" className="mt-1 text-xs">
                <Star className="w-3 h-3 mr-1" />
                {profile?.role === 'admin' ? 'Admin' : 
                 profile?.role === 'manager' ? 'Gerente' : 'Premium'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeTab === item.id && "bg-muted"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-border space-y-3">
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={signOut}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};
