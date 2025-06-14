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
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      case 'admin':
        return (
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        );
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={false}>
        <div className="min-h-screen flex w-full bg-gold-50 dark:bg-zinc-900 font-sans">
          <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <SidebarInset className="flex-1">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-white/70 shadow-soft">
              <SidebarTrigger className="flex items-center justify-center">
                <Menu className="h-5 w-5 text-gold-400" />
              </SidebarTrigger>
              <div className="flex items-center gap-2 ml-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gold-400 rounded-lg shadow-glow-gold">
                  <span className="text-gold-900 font-bold text-lg">O</span>
                </div>
                <h1 className="text-xl font-heading font-bold text-gold-900">Oliver</h1>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gold-50/60 via-white to-gold-100/40">
              <div className="p-6">
                {renderContent()}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
};
