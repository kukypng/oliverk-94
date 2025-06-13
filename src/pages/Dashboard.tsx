
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DashboardContent } from '@/components/DashboardContent';
import { BudgetsContent } from '@/components/BudgetsContent';
import { NewBudgetContent } from '@/components/NewBudgetContent';
import { ClientsContent } from '@/components/ClientsContent';
import { ReportsContent } from '@/components/ReportsContent';
import { SettingsContent } from '@/components/SettingsContent';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'budgets':
        return <BudgetsContent />;
      case 'new-budget':
        return <NewBudgetContent />;
      case 'clients':
        return <ClientsContent />;
      case 'reports':
        return <ReportsContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* Mobile sidebar overlay would go here */}
      
      <main className="flex-1 overflow-auto">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
