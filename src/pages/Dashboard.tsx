
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MobileNavigation } from '@/components/MobileNavigation';
import { MobileSidebar } from '@/components/MobileSidebar';
import { DashboardContent } from '@/components/DashboardContent';
import { BudgetsContent } from '@/components/BudgetsContent';
import { NewBudgetContent } from '@/components/NewBudgetContent';
import { SettingsContent } from '@/components/SettingsContent';
import { useIsMobile } from '@/hooks/use-mobile';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'budgets':
        return <BudgetsContent />;
      case 'new-budget':
        return <NewBudgetContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="hidden lg:block">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}
      
      {/* Mobile Navigation */}
      {isMobile && (
        <>
          <MobileNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            onMenuToggle={() => setIsMobileSidebarOpen(true)}
          />
          <MobileSidebar 
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />
        </>
      )}
      
      <main className="flex-1 overflow-auto pb-16 lg:pb-0">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
