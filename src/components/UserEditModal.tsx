import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { format } from 'date-fns';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { User } from '@/types/user';

interface UserEditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserEditModal = ({ user, isOpen, onClose, onSuccess }: UserEditModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'user',
    is_active: true,
    expiration_date: '',
  });

  const [showPasswordResetConfirm, setShowPasswordResetConfirm] = useState(false);
  const [showEmailChangeDialog, setShowEmailChangeDialog] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  
  const { showSuccess, showError } = useEnhancedToast();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        role: user.role,
        is_active: user.is_active,
        expiration_date: format(new Date(user.expiration_date), "yyyy-MM-dd'T'HH:mm"),
      });
    }
  }, [user]);

  const updateUserMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user) return;
      
      const { error } = await supabase.rpc('admin_update_user', {
        p_user_id: user.id,
        p_name: data.name,
        p_role: data.role,
        p_is_active: data.is_active,
        p_expiration_date: new Date(data.expiration_date).toISOString(),
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess({
        title: 'Usuário atualizado',
        description: 'As informações do usuário foram atualizadas com sucesso.',
      });
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      showError({
        title: 'Erro ao atualizar usuário',
        description: error.message || 'Ocorreu um erro ao atualizar o usuário.',
      });
    },
  });

  const sendPasswordResetMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess({
        title: 'Email enviado',
        description: 'Um email para redefinir a senha foi enviado para o usuário.',
      });
    },
    onError: (error: any) => {
      showError({
        title: 'Erro ao enviar email',
        description: error.message || 'Ocorreu um erro ao enviar o email.',
      });
    },
  });

  const adminUpdateEmailMutation = useMutation({
    mutationFn: async (data: { userId: string, newEmail: string }) => {
      const { error } = await supabase.functions.invoke('admin-update-user-email', {
        body: { userId: data.userId, newEmail: data.newEmail },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess({
        title: 'Email do usuário alterado',
        description: 'Um e-mail de confirmação foi enviado para o novo endereço.',
      });
      setShowEmailChangeDialog(false);
      setNewEmail('');
      onSuccess(); // para atualizar a lista de usuários
    },
    onError: (error: any) => {
      showError({
        title: 'Erro ao alterar email',
        description: error.message || 'Ocorreu um erro ao alterar o email do usuário.',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserMutation.mutate(formData);
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email (somente leitura)</Label>
              <Input
                id="email"
                value={user.email}
                disabled
                className="bg-muted"
              />
            </div>

            <div>
              <Label htmlFor="role">Função</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expiration_date">Data de Expiração</Label>
              <Input
                id="expiration_date"
                type="datetime-local"
                value={formData.expiration_date}
                onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Usuário ativo</Label>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full"
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setShowPasswordResetConfirm(true)}
              disabled={sendPasswordResetMutation.isPending}
            >
              {sendPasswordResetMutation.isPending ? 'Enviando...' : 'Enviar Reset de Senha'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setShowEmailChangeDialog(true)}
              disabled={adminUpdateEmailMutation.isPending}
            >
              {adminUpdateEmailMutation.isPending ? 'Alterando...' : 'Alterar Email'}
            </Button>
          </div>
        </form>

        <ConfirmationDialog
          open={showPasswordResetConfirm}
          onOpenChange={setShowPasswordResetConfirm}
          onConfirm={() => {
            sendPasswordResetMutation.mutate();
            setShowPasswordResetConfirm(false);
          }}
          title="Confirmar Envio de Reset de Senha"
          description={`Tem certeza que deseja enviar um link de redefinição de senha para ${user.email}?`}
          confirmButtonText="Sim, Enviar"
        />

        <Dialog open={showEmailChangeDialog} onOpenChange={setShowEmailChangeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar Email do Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Email atual: <strong>{user.email}</strong>
              </p>
              <div>
                <Label htmlFor="new-email" className="text-left">Novo Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="novo.email@exemplo.com"
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEmailChangeDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (user.id && newEmail) {
                    adminUpdateEmailMutation.mutate({ userId: user.id, newEmail });
                  }
                }}
                disabled={adminUpdateEmailMutation.isPending || !newEmail}
              >
                {adminUpdateEmailMutation.isPending ? 'Alterando...' : 'Confirmar Alteração'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
