
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface DeleteBudgetConfirmProps {
  budget: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteBudgetConfirm = ({ budget, open, onOpenChange }: DeleteBudgetConfirmProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteBudgetMutation = useMutation({
    mutationFn: async () => {
      console.log('Iniciando exclusão do orçamento:', budget.id);
      
      // Verificar se o usuário está autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Usuário não autenticado');
      }
      
      console.log('Usuário autenticado:', user.id);
      
      // Usar a função segura de exclusão
      const { data, error } = await supabase.rpc('delete_budget_with_parts', {
        p_budget_id: budget.id
      });
      
      console.log('Resultado da função delete_budget_with_parts:', { data, error });
      
      if (error) {
        console.error('Erro na função de exclusão:', error);
        throw new Error(error.message || 'Erro ao excluir orçamento');
      }
      
      if (!data) {
        throw new Error('Orçamento não encontrado ou você não tem permissão para excluí-lo');
      }
      
      console.log('Orçamento excluído com sucesso');
      return data;
    },
    onSuccess: () => {
      console.log('Invalidando cache de orçamentos');
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Orçamento excluído",
        description: "O orçamento e suas partes foram removidos com sucesso.",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      console.error('Erro na exclusão do orçamento:', error);
      
      let errorMessage = "Ocorreu um erro ao excluir o orçamento.";
      
      if (error.message.includes('Acesso negado')) {
        errorMessage = "Você não tem permissão para excluir este orçamento.";
      } else if (error.message.includes('não encontrado')) {
        errorMessage = "Orçamento não encontrado.";
      } else if (error.message.includes('não autenticado')) {
        errorMessage = "Você precisa estar logado para excluir orçamentos.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro ao excluir",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    console.log('Iniciando processo de exclusão para orçamento:', budget.id);
    deleteBudgetMutation.mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
            <br />
            <br />
            <strong>Cliente:</strong> {budget?.client_name || 'Não informado'}
            <br />
            <strong>Dispositivo:</strong> {budget?.device_model}
            <br />
            <br />
            <em>Todas as partes do orçamento também serão removidas.</em>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteBudgetMutation.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteBudgetMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteBudgetMutation.isPending ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
