
import { useState } from 'react';
import { generateBudgetPDF, generatePDFImage } from '@/utils/pdfGenerator';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { useShopProfile } from '@/hooks/useShopProfile';

interface BudgetData {
  id: string;
  device_model: string;
  device_type: string;
  issue: string;
  cash_price: number;
  installment_price?: number;
  installments?: number;
  warranty_months: number;
  created_at: string;
  valid_until: string;
  client_name?: string;
  client_phone?: string;
}

export const usePdfGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { showSuccess, showError, showWarning } = useEnhancedToast();
  const { shopProfile } = useShopProfile();

  const generateAndSharePDF = async (budget: BudgetData) => {
    if (!shopProfile) {
      showWarning({
        title: 'Perfil da empresa não configurado',
        description: 'Configure o perfil da sua empresa nas configurações antes de gerar PDFs.',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const pdfData = {
        // Dados do orçamento
        device_model: budget.device_model,
        device_type: budget.device_type,
        issue: budget.issue,
        cash_price: budget.cash_price,
        installment_price: budget.installment_price,
        installments: budget.installments,
        warranty_months: budget.warranty_months,
        created_at: budget.created_at,
        valid_until: budget.valid_until,
        client_name: budget.client_name,
        client_phone: budget.client_phone,
        
        // Dados da loja
        shop_name: shopProfile.shop_name,
        shop_address: shopProfile.address,
        shop_phone: shopProfile.contact_phone,
        shop_cnpj: shopProfile.cnpj,
        shop_logo_url: shopProfile.logo_url,
      };

      // Gerar PDF usando o template
      const pdfBlob = await generateBudgetPDF(pdfData);
      
      // Criar URL temporária para o PDF
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Preparar mensagem para WhatsApp
      const message = `Segue o orçamento para ${budget.device_model}. 
      
Valor à vista: R$ ${(budget.cash_price / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
${budget.installment_price && budget.installments ? 
  `Parcelado: R$ ${(budget.installment_price / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em ${budget.installments}x` : ''}

Clique no link para baixar o PDF: ${window.location.origin}

*Para enviar o PDF pelo WhatsApp:*
1. Baixe o PDF clicando no botão abaixo
2. Escolha o contato no WhatsApp
3. Anexe o PDF baixado`;
      
      // Criar link de download do PDF
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = `orcamento-${budget.device_model.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      
      // Fazer download do PDF
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // Aguardar um pouco para o download iniciar
      setTimeout(() => {
        // Abrir WhatsApp Web para seleção de contato
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://web.whatsapp.com/send?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        
        // Limpar URL temporária
        URL.revokeObjectURL(pdfUrl);
      }, 1000);
      
      showSuccess({
        title: 'PDF gerado com sucesso!',
        description: 'O PDF foi baixado. Agora selecione o contato no WhatsApp para enviar.',
      });
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      showError({
        title: 'Erro ao gerar PDF',
        description: 'Ocorreu um erro ao gerar o PDF do orçamento. Tente novamente.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePDFOnly = async (budget: BudgetData): Promise<Blob | null> => {
    if (!shopProfile) {
      showWarning({
        title: 'Perfil da empresa não configurado',
        description: 'Configure o perfil da sua empresa nas configurações antes de gerar PDFs.',
      });
      return null;
    }

    setIsGenerating(true);

    try {
      const pdfData = {
        // Dados do orçamento
        device_model: budget.device_model,
        device_type: budget.device_type,
        issue: budget.issue,
        cash_price: budget.cash_price,
        installment_price: budget.installment_price,
        installments: budget.installments,
        warranty_months: budget.warranty_months,
        created_at: budget.created_at,
        valid_until: budget.valid_until,
        client_name: budget.client_name,
        client_phone: budget.client_phone,
        
        // Dados da loja
        shop_name: shopProfile.shop_name,
        shop_address: shopProfile.address,
        shop_phone: shopProfile.contact_phone,
        shop_cnpj: shopProfile.cnpj,
        shop_logo_url: shopProfile.logo_url,
      };

      const pdfBlob = await generateBudgetPDF(pdfData);
      
      showSuccess({
        title: 'PDF gerado com sucesso!',
        description: 'O arquivo PDF foi criado com os dados do orçamento.',
      });
      
      return pdfBlob;
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      showError({
        title: 'Erro ao gerar PDF',
        description: 'Ocorreu um erro ao gerar o PDF do orçamento. Tente novamente.',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateAndSharePDF,
    generatePDFOnly,
    isGenerating,
  };
};
