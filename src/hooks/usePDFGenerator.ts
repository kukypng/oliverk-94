
import { useState } from 'react';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { useShopProfile } from '@/hooks/useShopProfile';
import { generateBudgetPDF } from '@/utils/pdfGenerator';

interface BudgetData {
  id: string;
  device_model: string;
  device_type: string;
  issue: string;
  total_price: number;
  installments?: number;
  warranty_months: number;
  client_name?: string;
  client_phone?: string;
  created_at: string;
  valid_until: string;
  includes_delivery?: boolean;
  includes_screen_protector?: boolean;
}

export const usePDFGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { showSuccess, showError } = useEnhancedToast();
  const { shopProfile } = useShopProfile();

  const generatePDF = async (budget: BudgetData) => {
    setIsGenerating(true);
    
    try {
      console.log('Generating PDF for budget:', budget.id);
      
      // Show loading toast
      showSuccess({
        title: "Gerando PDF...",
        description: "O arquivo está sendo preparado para download.",
      });

      await generateBudgetPDF(budget, shopProfile);
      
      showSuccess({
        title: "PDF gerado com sucesso!",
        description: "O orçamento foi baixado em formato PDF.",
      });
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      showError({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o arquivo PDF. Tente novamente.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePDF,
    isGenerating,
  };
};
