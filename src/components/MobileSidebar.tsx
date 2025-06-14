
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import { 
  LogOut, 
  User,
  Star,
  Shield,
  Bell
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const { signOut, user } = useAuth();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80 glass border-l border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur-xl">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-left text-xl font-bold">Menu</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full animate-fade-in">
          {/* User Info - Premium Card */}
          <div className="p-6 mb-6 glass-card border border-white/10 rounded-3xl animate-scale-in">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#fec832] to-[#fec832]/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="h-8 w-8 text-black" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-xl flex items-center justify-center border-2 border-white dark:border-black">
                  <Shield className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-foreground truncate">
                  {user?.user_metadata?.name || 'Usuário'}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {user?.email}
                </p>
                <Badge variant="secondary" className="mt-2 bg-[#fec832]/10 text-[#fec832] border-[#fec832]/20">
                  <Star className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Ações Rápidas</h3>
            
            <Button
              variant="ghost"
              className="w-full justify-start h-12 rounded-2xl hover:bg-muted/20 transition-all duration-300 hover:scale-[1.02]"
            >
              <Bell className="mr-3 h-5 w-5 text-blue-500" />
              <div className="text-left">
                <p className="text-sm font-medium">Notificações</p>
                <p className="text-xs text-muted-foreground">3 novas</p>
              </div>
            </Button>
          </div>

          {/* Theme Toggle */}
          <div className="p-4 mb-6 glass-card border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Aparência</p>
                <p className="text-xs text-muted-foreground">Tema do sistema</p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-border/50">
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-red-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
              onClick={signOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              <div className="text-left">
                <p className="text-sm font-medium">Sair da conta</p>
                <p className="text-xs opacity-70">Finalizar sessão</p>
              </div>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
