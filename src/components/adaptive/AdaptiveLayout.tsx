
import React, { ReactNode } from 'react';
import { useLayout } from '@/contexts/LayoutContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { TabletHeaderNav } from './TabletHeaderNav';
import { cn } from '@/lib/utils';

interface AdaptiveLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdaptiveLayout = ({ children, activeTab, onTabChange }: AdaptiveLayoutProps) => {
  const { isMobile, isTablet, isDesktop, showSidebar, showBottomNav } = useLayout();

  if (isDesktop) {
    return (
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar activeTab={activeTab} onTabChange={onTabChange} />
          
          <SidebarInset className="flex-1 flex flex-col">
            <header className="flex h-20 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-6 sticky top-0 z-30">
              <div className="flex items-center gap-3">
                <img src="/icone.png" alt="Oliver Logo" className="h-9 w-9" />
                <h1 className="text-2xl font-bold text-foreground">Oliver</h1>
              </div>
            </header>
            
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (isTablet) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <TabletHeaderNav 
          activeTab={activeTab} 
          onTabChange={onTabChange}
        />
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  // Mobile layout
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      
      <MobileBottomNav 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
      />
    </div>
  );
};
