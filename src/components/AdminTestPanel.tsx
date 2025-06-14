import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
interface TestResult {
  test_name: string;
  result: boolean;
  details: string;
}
interface DebugInfo {
  user_id: string | null;
  user_email: string | null;
  user_role: string | null;
  is_active: boolean | null;
  is_admin: boolean | null;
}
export const AdminTestPanel = () => {
  const {
    showSuccess,
    showError
  } = useEnhancedToast();
  const queryClient = useQueryClient();

  // Debug query para informações do usuário atual
  const {
    data: debugInfo,
    isLoading: debugLoading,
    refetch: refetchDebug
  } = useQuery({
    queryKey: ['debug-current-user-test'],
    queryFn: async (): Promise<DebugInfo | null> => {
      try {
        console.log('AdminTestPanel: Fetching debug info...');
        const {
          data,
          error
        } = await supabase.rpc('debug_current_user');
        if (error) {
          console.error('AdminTestPanel: Error fetching debug info:', error);
          throw error;
        }
        console.log('AdminTestPanel: Debug info received:', data);
        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn('AdminTestPanel: No debug data returned');
          return null;
        }
        const debugData = data[0];
        return {
          user_id: debugData?.user_id || null,
          user_email: debugData?.user_email || null,
          user_role: debugData?.user_role || null,
          is_active: debugData?.is_active || null,
          is_admin: debugData?.is_admin || null
        };
      } catch (err) {
        console.error('AdminTestPanel: Failed to fetch debug info:', err);
        return null;
      }
    },
    retry: false
  });

  // Test permissions query
  const {
    data: testResults,
    isLoading: testLoading,
    refetch: refetchTests
  } = useQuery({
    queryKey: ['test-admin-permissions'],
    queryFn: async (): Promise<TestResult[]> => {
      try {
        console.log('AdminTestPanel: Running permission tests...');
        const {
          data,
          error
        } = await supabase.rpc('test_admin_permissions');
        if (error) {
          console.error('AdminTestPanel: Error running tests:', error);
          throw error;
        }
        console.log('AdminTestPanel: Test results received:', data);
        if (!data || !Array.isArray(data)) {
          console.warn('AdminTestPanel: No test data returned');
          return [];
        }
        return data.map((test: any) => ({
          test_name: test.test_name || 'Unknown Test',
          result: Boolean(test.result),
          details: test.details || 'No details'
        }));
      } catch (err) {
        console.error('AdminTestPanel: Failed to run tests:', err);
        throw err;
      }
    },
    retry: false
  });

  // Test users query
  const {
    data: usersTest,
    isLoading: usersLoading,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['test-admin-users'],
    queryFn: async () => {
      try {
        console.log('AdminTestPanel: Testing user fetch...');
        const {
          data,
          error
        } = await supabase.rpc('admin_get_all_users');
        if (error) {
          console.error('AdminTestPanel: Error fetching users:', error);
          return {
            success: false,
            error: error.message,
            count: 0
          };
        }
        console.log('AdminTestPanel: Users fetched successfully:', data?.length || 0);
        return {
          success: true,
          error: null,
          count: data?.length || 0
        };
      } catch (err: any) {
        console.error('AdminTestPanel: Failed to fetch users:', err);
        return {
          success: false,
          error: err.message,
          count: 0
        };
      }
    },
    enabled: !!debugInfo?.is_admin,
    retry: false
  });
  const refreshAllTests = async () => {
    try {
      await Promise.all([refetchDebug(), refetchTests(), refetchUsers()]);
      showSuccess({
        title: 'Testes atualizados',
        description: 'Todos os testes foram executados novamente.'
      });
    } catch (error) {
      showError({
        title: 'Erro ao atualizar testes',
        description: 'Ocorreu um erro ao executar os testes.'
      });
    }
  };
  const getStatusIcon = (success: boolean | null) => {
    if (success === null) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />;
  };
  const getStatusColor = (success: boolean | null) => {
    if (success === null) return 'border-yellow-200 bg-yellow-50';
    return success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50';
  };
  return <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Painel de Testes Administrativos</span>
            <Button onClick={refreshAllTests} variant="outline" size="sm" disabled={debugLoading || testLoading || usersLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Testes
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Debug Info Section */}
          <div className="">
            <h3 className="font-semibold mb-3 flex items-center">
              {getStatusIcon(debugInfo?.is_admin)}
              <span className="ml-2">Informações do Usuário Atual</span>
            </h3>
            {debugLoading ? <p className="text-sm text-muted-foreground">Carregando...</p> : debugInfo ? <div className="grid grid-cols-2 gap-4 text-sm">
                <div><strong>ID:</strong> {debugInfo.user_id || 'N/A'}</div>
                <div><strong>Email:</strong> {debugInfo.user_email || 'N/A'}</div>
                <div><strong>Role:</strong> {debugInfo.user_role || 'N/A'}</div>
                <div><strong>Ativo:</strong> {debugInfo.is_active ? 'Sim' : 'Não'}</div>
                <div><strong>É Admin:</strong> {debugInfo.is_admin ? 'Sim' : 'Não'}</div>
                <div><strong>Status:</strong> {debugInfo.is_admin ? 'Administrador Ativo' : debugInfo.user_role === 'admin' ? 'Admin Inativo' : 'Usuário Regular'}</div>
              </div> : <p className="text-sm text-red-600">Erro ao carregar informações do usuário</p>}
          </div>

          {/* Permission Tests Section */}
          <div className="space-y-3">
            <h3 className="font-semibold">Testes de Permissão</h3>
            {testLoading ? <p className="text-sm text-muted-foreground">Executando testes...</p> : testResults && testResults.length > 0 ? <div className="space-y-2">
                {testResults.map((test, index) => <div key={index} className="">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getStatusIcon(test.result)}
                        <span className="ml-2 font-medium">{test.test_name}</span>
                      </div>
                      <span className={`text-sm ${test.result ? 'text-green-600' : 'text-red-600'}`}>
                        {test.result ? 'Passou' : 'Falhou'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{test.details}</p>
                  </div>)}
              </div> : <p className="text-sm text-yellow-600">Nenhum teste disponível</p>}
          </div>

          {/* Users Access Test Section */}
          <div className="">
            <h3 className="font-semibold mb-3 flex items-center">
              {getStatusIcon(usersTest?.success)}
              <span className="ml-2">Teste de Acesso aos Usuários</span>
            </h3>
            {usersLoading ? <p className="text-sm text-muted-foreground">Testando acesso...</p> : usersTest ? <div className="text-sm">
                {usersTest.success ? <div className="space-y-1">
                    <p className="text-green-600">✅ Acesso concedido com sucesso</p>
                    <p><strong>Usuários encontrados:</strong> {usersTest.count}</p>
                  </div> : <div className="space-y-1">
                    <p className="text-red-600">❌ Acesso negado</p>
                    <p><strong>Erro:</strong> {usersTest.error}</p>
                  </div>}
              </div> : <p className="text-sm text-muted-foreground">Teste não executado</p>}
          </div>

          {/* Summary */}
          <div className="p-4 rounded-lg bg-zinc-800">
            <h3 className="font-semibold mb-2">Resumo do Sistema</h3>
            <div className="text-sm space-y-1">
              <p><strong>Status do Admin:</strong> {debugInfo?.is_admin ? <span className="text-green-600">Funcionando corretamente</span> : debugInfo?.user_role === 'admin' ? <span className="text-yellow-600">Usuário admin existe mas está inativo</span> : <span className="text-red-600">Usuário não é administrador</span>}</p>
              <p><strong>Acesso aos Usuários:</strong> {usersTest?.success ? <span className="text-green-600">Funcionando ({usersTest.count} usuários)</span> : <span className="text-red-600">Bloqueado</span>}</p>
              <p><strong>Testes de Permissão:</strong> {testResults ? <span className="text-green-600">{testResults.filter(t => t.result).length}/{testResults.length} passaram</span> : <span className="text-yellow-600">Não executados</span>}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};