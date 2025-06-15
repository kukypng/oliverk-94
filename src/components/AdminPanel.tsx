
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from '@/components/UserManagement';
import { AdminLogs } from '@/components/AdminLogs';
import { AdminDebugPanel } from '@/components/AdminDebugPanel';
import { AdminTestPanel } from '@/components/AdminTestPanel';
import { Users, FileText, Shield, TestTube } from 'lucide-react';

export const AdminPanel = () => {
  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="bg-primary/10 p-3 rounded-xl">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie usuários e monitore atividades do sistema</p>
        </div>
      </div>

      <Tabs defaultValue="test" className="w-full">
        <div className="overflow-x-auto pb-2 -mx-4 px-4">
          <TabsList className="grid w-full min-w-max grid-cols-4 gap-2">
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <span>Testes</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Logs</span>
            </TabsTrigger>
            <TabsTrigger value="debug" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Debug</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="test" className="mt-6">
          <AdminTestPanel />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <AdminLogs />
        </TabsContent>

        <TabsContent value="debug" className="mt-6">
          <AdminDebugPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};
