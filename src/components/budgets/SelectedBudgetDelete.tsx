
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from '@/components/ui/icons';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SelectedBudgetDeleteProps {
  selectedBudgets: string[];
  budgets: any[];
  onDeleteComplete: () => void;
}

export const SelectedBudgetDelete = ({ selectedBudgets, budgets, onDeleteComplete }: SelectedBudgetDeleteProps) => {
  const { showSuccess, showError } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const deleteSelectedBudgetsMutation = useMutation({
    mutationFn: async () => {
      console.log('Iniciando exclusão dos orçamentos selecionados:', selectedBudgets);
      
      const results = [];
      for (const budgetId of selectedBudgets) {
        try {
          const { data, error } = await supabase.rpc('delete_budget_with_parts', {
            p_budget_id: budgetId
          });
          
          if (error) {
            console.error(`Erro ao excluir orçamento ${budgetId}:`, error);
            throw new Error(`Erro ao excluir orçamento: ${error.message}`);
          }
          
          if (data === false) {
            console.error(`Orçamento ${budgetId} não encontrado`);
            throw new Error('Orçamento não encontrado');
          }
          
          results.push(budgetId);
          console.log(`Orçamento ${budgetId} excluído com sucesso`);
        } catch (error) {
          console.error(`Falha ao excluir orçamento ${budgetId}:`, error);
          throw error;
        }
      }
      
      return results;
    },
    onSuccess: (deletedBudgets) => {
      console.log('Orçamentos excluídos com sucesso:', deletedBudgets);
      
      showSuccess({
        title: "Orçamentos excluídos",
        description: `${deletedBudgets.length} orçamento(s) foram removidos com sucesso.`,
      });
      
      setIsOpen(false);
      onDeleteComplete();
    },
    onError: (error: Error) => {
      console.error('Erro na exclusão dos orçamentos:', error);
      
      let errorMessage = "Ocorreu um erro ao excluir os orçamentos selecionados.";
      
      if (error.message.includes('não autenticado')) {
        errorMessage = "Você precisa estar logado para excluir orçamentos.";
      } else if (error.message.includes('não encontrado')) {
        errorMessage = "Alguns orçamentos não foram encontrados. Eles podem ter sido excluídos anteriormente.";
        // Atualizar a lista mesmo assim
        onDeleteComplete();
        setIsOpen(false);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError({
        title: "Erro na exclusão",
        description: errorMessage,
      });
    },
  });

  const handleDeleteSelected = () => {
    console.log('Confirmando exclusão de', selectedBudgets.length, 'orçamentos selecionados');
    deleteSelectedBudgetsMutation.mutate();
  };

  if (selectedBudgets.length === 0) {
    return null;
  }

  const selectedBudgetDetails = budgets.filter(budget => selectedBudgets.includes(budget.id));

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm"
          disabled={deleteSelectedBudgetsMutation.isPending}
          className="gap-2"
        >
          {deleteSelectedBudgetsMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Excluir Selecionados ({selectedBudgets.length})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Tem certeza que deseja excluir <strong>{selectedBudgets.length} orçamento(s) selecionado(s)</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            
            <div className="max-h-40 overflow-y-auto space-y-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              {selectedBudgetDetails.map((budget) => (
                <div key={budget.id} className="text-sm border-b border-gray-200 dark:border-gray-700 pb-1">
                  <strong>Cliente:</strong> {budget.client_name || 'Não informado'} - 
                  <strong> Dispositivo:</strong> {budget.device_model || 'Não informado'}
                </div>
              ))}
            </div>
            
            <p className="text-sm text-muted-foreground">
              Todas as partes dos orçamentos também serão removidas permanentemente.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteSelectedBudgetsMutation.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteSelected}
            disabled={deleteSelectedBudgetsMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteSelectedBudgetsMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Excluindo...
              </>
            ) : (
              `Excluir ${selectedBudgets.length} Orçamento(s)`
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
