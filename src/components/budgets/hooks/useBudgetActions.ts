
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/useToast';
import { generateWhatsAppMessage, shareViaWhatsApp } from '@/utils/whatsappUtils';
import { usePdfGeneration } from '@/hooks/usePdfGeneration';

export const useBudgetActions = () => {
  const { showSuccess, showError } = useToast();
  const { generateAndSharePDF, isGenerating } = usePdfGeneration();
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [deletingBudget, setDeletingBudget] = useState<any>(null);
  const [confirmation, setConfirmation] = useState<{
    action: () => void;
    title: string;
    description: string;
  } | null>(null);

  const handleShareWhatsApp = useCallback((budget: any) => {
    setConfirmation({
      action: () => {
        try {
          const message = generateWhatsAppMessage(budget);
          shareViaWhatsApp(message);
          showSuccess({
            title: "Redirecionando...",
            description: "Você será redirecionado para o WhatsApp para compartilhar o orçamento."
          });
        } catch (error) {
          showError({
            title: "Erro ao compartilhar",
            description: "Ocorreu um erro ao preparar o compartilhamento."
          });
        }
      },
      title: "Compartilhar via WhatsApp?",
      description: "Você será redirecionado para o WhatsApp para enviar os detalhes do orçamento."
    });
  }, [showSuccess, showError]);

  const handleViewPDF = useCallback((budget: any) => {
    setConfirmation({
      action: async () => {
        try {
          await generateAndSharePDF(budget);
        } catch (error) {
          console.error('Erro ao gerar PDF:', error);
        }
      },
      title: "Gerar e compartilhar PDF?",
      description: "Um PDF do orçamento será gerado e a opção de compartilhamento será exibida."
    });
  }, [generateAndSharePDF]);

  const handleEdit = useCallback((budget: any) => {
    setEditingBudget(budget);
  }, []);

  const handleDelete = useCallback((budget: any) => {
    setDeletingBudget(budget);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingBudget(null);
  }, []);

  const closeDelete = useCallback(() => {
    setDeletingBudget(null);
  }, []);

  const closeConfirmation = useCallback(() => {
    setConfirmation(null);
  }, []);

  const confirmAction = useCallback(() => {
    if (confirmation) {
      confirmation.action();
      setConfirmation(null);
    }
  }, [confirmation]);

  return {
    editingBudget,
    deletingBudget,
    confirmation,
    isGenerating,
    handleShareWhatsApp,
    handleViewPDF,
    handleEdit,
    handleDelete,
    closeEdit,
    closeDelete,
    closeConfirmation,
    confirmAction
  };
};
