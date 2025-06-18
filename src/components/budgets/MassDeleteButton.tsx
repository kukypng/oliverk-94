
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from '@/components/ui/icons';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

interface MassDeleteButtonProps {
  budgetCount: number;
  disabled?: boolean;
}

export const MassDeleteButton = ({ budgetCount, disabled = false }: MassDeleteButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const massDeleteMutation = useMutation({
    mutationFn: async () => {
      console.log('Iniciando exclusão em massa de orçamentos');
      
      const { data, error } = await supabase.rpc('delete_all_user_budgets');
      
      if (error) {
        console.error('Erro na exclusão em massa:', error);
        throw new Error(error.message || 'Erro ao excluir orçamentos');
      }
      
      console.log('Orçamentos excluídos em massa:', data);
      return data;
    },
    onSuccess: (deletedCount) => {
      console.log('Invalidando cache após exclusão em massa');
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.refetchQueries({ queryKey: ['budgets'] });
      
      toast({
        title: "Exclusão concluída",
        description: `${deletedCount} orçamento(s) foram removidos com sucesso.`,
      });
      setIsOpen(false);
    },
    onError: (error: Error) => {
      console.error('Erro na exclusão em massa:', error);
      
      let errorMessage = "Ocorreu um erro ao excluir os orçamentos.";
      
      if (error.message.includes('não autenticado')) {
        errorMessage = "Você precisa estar logado para excluir orçamentos.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro na exclusão",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleMassDelete = () => {
    console.log('Confirmando exclusão em massa de', budgetCount, 'orçamentos');
    massDeleteMutation.mutate();
  };

  if (budgetCount === 0) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm"
          disabled={disabled || massDeleteMutation.isPending}
          className="gap-2"
        >
          {massDeleteMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Excluir Todos ({budgetCount})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão em Massa</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tem certeza que deseja excluir <strong>TODOS os {budgetCount} orçamentos</strong>? 
              Esta ação não pode ser desfeita.
            </p>
            <p className="text-sm text-muted-foreground">
              Todos os orçamentos e suas respectivas partes serão removidos permanentemente.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={massDeleteMutation.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleMassDelete}
            disabled={massDeleteMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {massDeleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Excluindo...
              </>
            ) : (
              `Excluir Todos os ${budgetCount} Orçamentos`
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
