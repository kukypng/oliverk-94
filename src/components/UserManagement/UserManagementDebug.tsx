
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { DebugInfo } from '@/types/user';

interface Props {
  debugInfo: DebugInfo | null;
  error: Error | null;
}

export const UserManagementDebug = ({ debugInfo, error }: Props) => (
  <Card className="mb-4 border-yellow-200 bg-yellow-50">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2 text-yellow-800">
        <AlertTriangle className="h-5 w-5" />
        <span>Informações de Debug</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="text-sm">
      {debugInfo ? (
        <div className="space-y-2">
          <p><strong>ID do Usuário:</strong> {debugInfo.user_id || 'N/A'}</p>
          <p><strong>Email:</strong> {debugInfo.user_email || 'N/A'}</p>
          <p><strong>Role:</strong> {debugInfo.user_role || 'N/A'}</p>
          <p><strong>Ativo:</strong> {debugInfo.is_active ? 'Sim' : 'Não'}</p>
          <p><strong>É Admin:</strong> {debugInfo.is_admin ? 'Sim' : 'Não'}</p>
        </div>
      ) : (
        <p>Carregando informações de debug...</p>
      )}
      {error && (
        <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
          <p className="text-red-800"><strong>Erro:</strong> {error.message}</p>
        </div>
      )}
    </CardContent>
  </Card>
);
