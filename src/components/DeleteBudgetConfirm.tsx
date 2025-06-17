
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
      // Verificar se o budget existe e tem ID
      if (!budget || !budget.id) {
        throw new Error('Orçamento inválido ou não encontrado');
      }

      console.log('Iniciando exclusão do orçamento:', budget.id);
      console.log('Dados do orçamento:', budget);
      
      // Verificar se o usuário está autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Erro de autenticação:', authError);
        throw new Error('Usuário não autenticado');
      }
      
      console.log('Usuário autenticado:', user.id);
      
      // Primeiro, verificar se o orçamento existe e pertence ao usuário
      const { data: existingBudget, error: fetchError } = await supabase
        .from('budgets')
        .select('id, owner_id, device_model, client_name')
        .eq('id', budget.id)
        .single();
      
      if (fetchError) {
        console.error('Erro ao buscar orçamento:', fetchError);
        if (fetchError.code === 'PGRST116') {
          throw new Error('Orçamento não encontrado no banco de dados');
        }
        throw new Error(`Erro ao verificar orçamento: ${fetchError.message}`);
      }
      
      if (!existingBudget) {
        console.error('Orçamento não encontrado:', budget.id);
        throw new Error('Orçamento não encontrado');
      }
      
      console.log('Orçamento encontrado:', existingBudget);
      
      if (existingBudget.owner_id !== user.id) {
        console.error('Usuário não é o proprietário do orçamento');
        throw new Error('Você não tem permissão para excluir este orçamento');
      }
      
      // Usar a função segura de exclusão
      const { data, error } = await supabase.rpc('delete_budget_with_parts', {
        p_budget_id: budget.id
      });
      
      console.log('Resultado da função delete_budget_with_parts:', { data, error });
      
      if (error) {
        console.error('Erro na função de exclusão:', error);
        throw new Error(error.message || 'Erro ao excluir orçamento');
      }
      
      if (data === false) {
        console.error('Função retornou false - orçamento não encontrado ou sem permissão');
        throw new Error('Orçamento não encontrado ou você não tem permissão para excluí-lo');
      }
      
      console.log('Orçamento excluído com sucesso');
      return data;
    },
    onSuccess: () => {
      console.log('Invalidando cache de orçamentos');
      // Force refresh dos dados
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.refetchQueries({ queryKey: ['budgets'] });
      
      toast({
        title: "Orçamento excluído",
        description: "O orçamento e suas partes foram removidos com sucesso.",
      });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      console.error('Erro na exclusão do orçamento:', error);
      
      let errorMessage = "Ocorreu um erro ao excluir o orçamento.";
      
      if (error.message.includes('Acesso negado') || error.message.includes('não tem permissão')) {
        errorMessage = "Você não tem permissão para excluir este orçamento.";
      } else if (error.message.includes('não encontrado')) {
        errorMessage = "Orçamento não encontrado. Ele pode ter sido excluído por outro usuário.";
        // Force refresh para atualizar a lista
        queryClient.invalidateQueries({ queryKey: ['budgets'] });
      } else if (error.message.includes('não autenticado')) {
        errorMessage = "Você precisa estar logado para excluir orçamentos.";
      } else if (error.message.includes('inválido')) {
        errorMessage = "Dados do orçamento são inválidos.";
      } else if (error.message.includes('banco de dados')) {
        errorMessage = "Orçamento não encontrado no banco de dados. A lista será atualizada.";
        // Force refresh para remover itens que não existem mais
        queryClient.invalidateQueries({ queryKey: ['budgets'] });
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro ao excluir",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Se for erro de orçamento não encontrado, fechar o diálogo e atualizar a lista
      if (error.message.includes('não encontrado')) {
        onOpenChange(false);
      }
    },
  });

  const handleDelete = () => {
    // Verificar se o budget existe antes de tentar excluir
    if (!budget || !budget.id) {
      console.error('Budget é nulo ou não tem ID:', budget);
      toast({
        title: "Erro",
        description: "Orçamento inválido. Não é possível excluir.",
        variant: "destructive",
      });
      return;
    }

    console.log('Iniciando processo de exclusão para orçamento:', budget.id);
    deleteBudgetMutation.mutate();
  };

  // Se não há budget válido, não renderizar o diálogo
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
