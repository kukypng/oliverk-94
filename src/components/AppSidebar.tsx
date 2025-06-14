
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  FileText, 
  Settings, 
  Plus,
  LogOut, 
  User,
  Star,
  Users
} from 'lucide-react';
import { ThemeToggle } from './ui/theme-toggle';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AppSidebar = ({ activeTab, onTabChange }: AppSidebarProps) => {
  const { signOut, user, profile, hasRole } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'budgets', label: 'Orçamentos', icon: FileText },
    { id: 'new-budget', label: 'Novo Orçamento', icon: Plus },
    ...(hasRole('admin') ? [{ id: 'admin', label: 'Administração', icon: Users }] : []),
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
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
               profile?.role === 'manager' ? 'Gerente' : 'Usuário'}
            </Badge>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarSeparator />
      
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  onClick={() => onTabChange(item.id)}
                  isActive={activeTab === item.id}
                  className="w-full"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={signOut}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sair
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
