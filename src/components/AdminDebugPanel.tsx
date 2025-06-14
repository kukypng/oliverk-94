import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Eye, EyeOff, RefreshCw } from 'lucide-react';
interface DebugInfo {
  user_id: string | null;
  user_email: string | null;
  user_role: string | null;
  is_active: boolean | null;
  is_admin: boolean | null;
}
interface AdminDebugPanelProps {
  error?: Error | null;
  showByDefault?: boolean;
}
export const AdminDebugPanel = ({
  error,
  showByDefault = false
}: AdminDebugPanelProps) => {
  const [isVisible, setIsVisible] = useState(showByDefault);
  const {
    data: debugInfo,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['debug-current-user'],
    queryFn: async (): Promise<DebugInfo | null> => {
      try {
        console.log('AdminDebugPanel: Fetching debug info...');
        const {
          data,
          error
        } = await supabase.rpc('debug_current_user');
        if (error) {
          console.error('AdminDebugPanel: Error fetching debug info:', error);
          throw error;
        }
        console.log('AdminDebugPanel: Debug info received:', data);
        if (!data || !Array.isArray(data) || data.length === 0) {
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
        console.error('AdminDebugPanel: Failed to fetch debug info:', err);
        return null;
      }
    },
    retry: false
  });
  if (!isVisible && !error) {
    return <div className="mb-4">
        <Button variant="ghost" size="sm" onClick={() => setIsVisible(true)} className="text-xs text-muted-foreground">
          <Eye className="h-3 w-3 mr-1" />
          Mostrar Debug
        </Button>
      </div>;
  }
  return <Card className="mb-4 border-yellow-200 bg-black py-[17px]">
      <CardHeader className="bg-black px-[83px] my-[28px] mx-[12px] py-0">
        <CardTitle className="flex items-center justify-between text-yellow-800">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 bg-black/0" />
            <span className="text-[#f6f7f6]">Painel de Debug</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isLoading} className="text-yellow-700 hover:text-yellow-800">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)} className="text-yellow-700 hover:text-yellow-800">
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm bg-black py-0 px-[22px] mx-[22px]">
        {isLoading ? <div className="animate-pulse">
            <div className="h-4 bg-yellow-200 rounded mb-2"></div>
            <div className="h-4 bg-yellow-200 rounded mb-2 w-3/4"></div>
            <div className="h-4 bg-yellow-200 rounded w-1/2"></div>
          </div> : debugInfo ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-yellow-900">Informações do Usuário</h4>
              <div className="space-y-1">
                <p className="bg-black"><strong>ID:</strong> <code className="text-xs bg-yellow-100 px-1 rounded">{debugInfo.user_id || 'N/A'}</code></p>
                <p><strong>Email:</strong> {debugInfo.user_email || 'N/A'}</p>
                <p><strong>Role:</strong> 
                  <Badge className="">
                    {debugInfo.user_role || 'N/A'}
                  </Badge>
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-yellow-900">Status de Permissões</h4>
              <div className="space-y-1">
                <p><strong>Usuário Ativo:</strong> 
                  <Badge className="">
                    {debugInfo.is_active ? 'Sim' : 'Não'}
                  </Badge>
                </p>
                <p><strong>Permissão Admin:</strong> 
                  <Badge className="">
                    {debugInfo.is_admin ? 'Sim' : 'Não'}
                  </Badge>
                </p>
              </div>
            </div>
          </div> : <p className="text-yellow-700">Não foi possível carregar informações de debug</p>}
        
        {error && <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">Erro Detectado:</h4>
            <p className="text-red-800 text-sm">{error.message}</p>
            {debugInfo && !debugInfo.is_admin && <div className="mt-2 p-2 bg-red-100 rounded">
                <p className="text-red-800 text-xs">
                  <strong>Possível Causa:</strong> O usuário atual não possui permissões de administrador. 
                  Verifique se o role está correto e se o usuário está ativo.
                </p>
              </div>}
          </div>}
      </CardContent>
    </Card>;
};