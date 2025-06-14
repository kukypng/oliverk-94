
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { DashboardContent } from '@/components/DashboardContent';
import { BudgetsContent } from '@/components/BudgetsContent';
import { NewBudgetContent } from '@/components/NewBudgetContent';
import { SettingsContent } from '@/components/SettingsContent';
import { AdminPanel } from '@/components/AdminPanel';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ClientsContent } from '@/components/ClientsContent';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent onTabChange={setActiveTab} />;
      case 'budgets':
        return <BudgetsContent />;
      case 'new-budget':
        return <NewBudgetContent />;
      case 'clients':
        return <ClientsContent />;
      case 'admin':
        return (
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        );
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent onTabChange={setActiveTab} />;
    }
  };

  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={false}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          <SidebarInset className="flex-1">
            {/* Header with menu button */}
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="flex items-center justify-center">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <div className="flex items-center gap-2">
                <img src="/icone.png" alt="Oliver Logo" className="h-8 w-8" />
                <h1 className="text-xl font-bold">Oliver</h1>
              </div>
            </header>
            
            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
              {renderContent()}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
};
