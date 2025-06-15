
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
  SidebarRail,
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
    { id: 'dashboard', label: 'Dashboard', icon: Home, permission: true },
    { id: 'budgets', label: 'Orçamentos', icon: FileText, permission: true },
    { id: 'new-budget', label: 'Novo Orçamento', icon: Plus, permission: true },
    { id: 'admin', label: 'Administração', icon: Users, permission: hasRole('admin') },
    { id: 'settings', label: 'Configurações', icon: Settings, permission: true },
  ];

  return (
    <Sidebar className="border-r-border/50" collapsible="icon">
      <SidebarRail />
      <SidebarHeader className="p-4 h-20 flex items-center">
        <div className="flex items-center space-x-4 w-full">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shrink-0">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-foreground truncate">
              {profile?.name || 'Usuário'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarSeparator />
      
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navigationItems.map((item) => {
            if (!item.permission) return null;
            const Icon = item.icon;
            return (
              <SidebarMenuItem key={item.id} className="p-1">
                <SidebarMenuButton
                  onClick={() => onTabChange(item.id)}
                  isActive={activeTab === item.id}
                  className="w-full h-12 text-base font-medium rounded-lg"
                  tooltip={item.label}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground h-12 text-base font-medium rounded-lg"
            onClick={signOut}
            // @ts-ignore
            tooltip="Sair"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Sair</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
