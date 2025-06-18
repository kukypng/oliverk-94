
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
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from '@/components/ui/icons';

interface DeleteBudgetDialogProps {
  budget: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteBudgetDialog = ({ budget, open, onOpenChange }: DeleteBudgetDialogProps) => {
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();

  const deleteBudgetMutation = useMutation({
    mutationFn: async () => {
      if (!budget || !budget.id) {
        throw new Error('Orçamento inválido ou não encontrado');
      }

      console.log('Iniciando exclusão do orçamento:', budget.id);
      
      const { data, error } = await supabase.rpc('delete_budget_with_parts', {
        p_budget_id: budget.id
      });
      
      if (error) {
        console.error('Erro na função de exclusão:', error);
        throw new Error(error.message || 'Erro ao excluir orçamento');
      }
      
      if (data === false) {
        throw new Error('Orçamento não encontrado');
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.refetchQueries({ queryKey: ['budgets'] });
      
      showSuccess({
        title: "Orçamento excluído",
        description: "O orçamento foi removido com sucesso.",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      console.error('Erro na exclusão do orçamento:', error);
      
      let errorMessage = "Ocorreu um erro ao excluir o orçamento.";
      
      if (error.message.includes('não encontrado')) {
        errorMessage = "Orçamento não encontrado. Ele pode ter sido excluído anteriormente.";
        queryClient.invalidateQueries({ queryKey: ['budgets'] });
        onOpenChange(false);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError({
        title: "Erro ao excluir",
        description: errorMessage,
      });
    },
  });

  const handleDelete = () => {
    if (!budget || !budget.id) {
      showError({
        title: "Erro",
        description: "Orçamento inválido. Não é possível excluir.",
      });
      return;
    }

    deleteBudgetMutation.mutate();
  };

  if (!budget) {
    return null;
  }

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
            <strong>Dispositivo:</strong> {budget?.device_model || 'Não informado'}
            <br />
            <strong>Valor:</strong> R$ {((budget?.total_price || 0) / 100).toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
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
            {deleteBudgetMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
