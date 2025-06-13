
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
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budget.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Orçamento excluído",
        description: "O orçamento foi removido com sucesso.",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir o orçamento.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
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
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
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
