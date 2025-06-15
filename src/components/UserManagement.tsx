import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { UserEditModal } from '@/components/UserEditModal';
import { UsersTable } from '@/components/UsersTable';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Edit, Trash2, Calendar, AlertTriangle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  expiration_date: string;
  created_at: string;
  last_sign_in_at: string | null;
  budget_count: number;
}

interface DebugInfo {
  user_id: string | null;
  user_email: string | null;
  user_role: string | null;
  is_active: boolean | null;
  is_admin: boolean | null;
}

export const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { showSuccess, showError } = useEnhancedToast();
  const queryClient = useQueryClient();

  // Debug query para informações do usuário atual
  const { data: debugInfo } = useQuery({
    queryKey: ['debug-current-user'],
    queryFn: async (): Promise<DebugInfo | null> => {
      try {
        console.log('Fetching debug info for current user...');
        const { data, error } = await supabase.rpc('debug_current_user');
        
        if (error) {
          console.error('Error fetching debug info:', error);
          throw error;
        }
        
        console.log('Debug info received:', data);
        
        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn('No debug data returned');
          return null;
        }
        
        const debugData = data[0];
        return {
          user_id: debugData?.user_id || null,
          user_email: debugData?.user_email || null,
          user_role: debugData?.user_role || null,
          is_active: debugData?.is_active || null,
          is_admin: debugData?.is_admin || null,
        };
      } catch (err) {
        console.error('Failed to fetch debug info:', err);
        return null;
      }
    },
    retry: false,
  });

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async (): Promise<User[]> => {
      try {
        console.log('Fetching users via admin_get_all_users...');
        console.log('Current debug info:', debugInfo);
        
        const { data, error } = await supabase.rpc('admin_get_all_users');
        
        if (error) {
          console.error('Error fetching users:', error);
          throw error;
        }
        
        console.log('Fetched users successfully:', data);
        
        if (!data || !Array.isArray(data)) {
          console.warn('Invalid users data received:', data);
          return [];
        }
        
        return data.map((user: any) => ({
          id: user.id || '',
          name: user.name || 'Nome não disponível',
          email: user.email || 'Email não disponível',
          role: user.role || 'user',
          is_active: Boolean(user.is_active),
          expiration_date: user.expiration_date || new Date().toISOString(),
          created_at: user.created_at || new Date().toISOString(),
          last_sign_in_at: user.last_sign_in_at || null,
          budget_count: user.budget_count || 0,
        }));
      } catch (err) {
        console.error('Failed to fetch users:', err);
        throw err;
      }
    },
    retry: (failureCount, error: any) => {
      console.log(`Query retry attempt ${failureCount}, error:`, error);
      return failureCount < 2;
    },
    retryDelay: 1000,
    enabled: !!debugInfo?.is_admin,
  });

  console.log('UserManagement render - users:', users, 'isLoading:', isLoading, 'error:', error, 'debugInfo:', debugInfo);

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('Deleting user:', userId);
      const { data, error } = await supabase.rpc('admin_delete_user', {
        p_user_id: userId
      });
      if (error) {
        console.error('Delete user error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['debug-current-user'] });
      showSuccess({
        title: 'Usuário deletado',
        description: 'O usuário foi removido permanentemente do sistema.',
      });
      setUserToDelete(null);
    },
    onError: (error: any) => {
      console.error('Delete user mutation error:', error);
      showError({
        title: 'Erro ao deletar usuário',
        description: error.message || 'Ocorreu um erro ao deletar o usuário.',
      });
    },
  });

  const handleRetry = () => {
    console.log('Retrying user fetch...');
    refetch();
  };

  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id);
    }
  };

  // Renderizar informações de debug se houver erro ou solicitado
  const renderDebugSection = () => {
    if (!error && !showDebugInfo) return null;

    return (
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
  };

  // Verificar se não é admin
  if (debugInfo && !debugInfo.is_admin) {
    return (
      <>
        {renderDebugSection()}
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-yellow-600 mb-2 font-semibold">Acesso Restrito</p>
              <p className="text-sm text-muted-foreground mb-4">
                Você não tem permissões de administrador para acessar esta seção.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setShowDebugInfo(!showDebugInfo)}
              >
                {showDebugInfo ? 'Ocultar' : 'Mostrar'} Debug
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  if (error) {
    console.error('UserManagement error:', error);
    return (
      <>
        {renderDebugSection()}
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-2 font-semibold">Erro ao carregar usuários</p>
              <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
              <div className="space-y-2">
                <Button onClick={handleRetry} className="mr-2">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDebugInfo(!showDebugInfo)}
                >
                  {showDebugInfo ? 'Ocultar' : 'Mostrar'} Debug
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {renderDebugSection()}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Gerenciar Usuários</span>
            <div className="flex items-center space-x-2">
              {debugInfo && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowDebugInfo(!showDebugInfo)}
                  className="text-xs"
                >
                  Debug
                </Button>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers && filteredUsers.length > 0 ? (
            <UsersTable 
              users={filteredUsers} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? (
                <p>Nenhum usuário encontrado para "{searchTerm}"</p>
              ) : (
                <p>Nenhum usuário encontrado no sistema</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <UserEditModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['admin-users'] });
          queryClient.invalidateQueries({ queryKey: ['debug-current-user'] });
        }}
      />

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o usuário <strong>{userToDelete?.name}</strong>? 
              Esta ação é irreversível e todos os dados do usuário serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? 'Deletando...' : 'Deletar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
