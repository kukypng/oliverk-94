
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from '@/components/UserManagement';
import { AdminLogs } from '@/components/AdminLogs';
import { AdminDebugPanel } from '@/components/AdminDebugPanel';
import { Users, FileText, Shield } from 'lucide-react';

export const AdminPanel = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie usuários e monitore atividades do sistema</p>
        </div>
      </div>

      <AdminDebugPanel />

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Gerenciar Usuários</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Logs de Atividade</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="logs">
          <AdminLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};
