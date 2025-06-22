
import React, { ReactNode } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { TabletHeaderNav } from './TabletHeaderNav';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface AdaptiveLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdaptiveLayout = ({ children, activeTab, onTabChange }: AdaptiveLayoutProps) => {
  const { 
    isMobile, 
    isTablet, 
    isDesktop, 
    navHeight, 
    containerMaxWidth,
    safeArea,
    orientation
  } = useLayout();
  const { hasPermission } = useAuth();

  if (isDesktop) {
    return (
      <SidebarProvider defaultOpen={true}>
        <div className={cn("min-h-screen flex w-full bg-background", containerMaxWidth, "mx-auto")}>
          <AppSidebar activeTab={activeTab} onTabChange={onTabChange} />
          
          <SidebarInset className="flex-1 flex flex-col min-w-0">
            <header className={cn(
              "flex shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-6 sticky top-0 z-30",
              navHeight
            )}>
              <div className="flex items-center gap-3">
                <img src="/icone.png" alt="Oliver Logo" className="h-9 w-9" />
                <h1 className="text-2xl font-bold text-foreground">Oliver</h1>
              </div>
            </header>
            
            <main className="flex-1 overflow-y-auto">
              <div className="w-full h-full">
                {children}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (isTablet) {
    return (
      <div className="min-h-screen flex flex-col bg-background w-full">
        <TabletHeaderNav 
          activeTab={activeTab} 
          onTabChange={onTabChange}
        />
        
        <main className={cn(
          "flex-1 overflow-y-auto w-full",
          orientation === 'landscape' ? "pb-2" : "pb-4"
        )}>
          <div className={cn("w-full h-full", containerMaxWidth, "mx-auto")}>
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Mobile layout - otimizado para ocupar 100% da tela
  return (
    <div 
      className="min-h-screen flex flex-col bg-background w-full overflow-hidden"
      style={{
        paddingTop: `${safeArea.top}px`,
        paddingLeft: `${safeArea.left}px`,
        paddingRight: `${safeArea.right}px`,
      }}
    >
      <main className="flex-1 overflow-y-auto w-full" style={{ paddingBottom: `calc(4rem + ${safeArea.bottom}px)` }}>
        <div className="w-full min-h-full">
          {children}
        </div>
      </main>
      
      <MobileBottomNav 
        activeTab={activeTab} 
        onTabChange={onTabChange}
        hasPermission={hasPermission}
      />
    </div>
  );
};
