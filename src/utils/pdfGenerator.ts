
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ShopProfile } from '@/hooks/useShopProfile';

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

export const generateBudgetPDF = async (budget: BudgetData, shopProfile: ShopProfile | null) => {
  // Create a temporary container for the PDF content
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // A4 width in pixels at 96 DPI
  container.style.backgroundColor = 'white';
  container.style.padding = '40px';
  container.style.fontFamily = 'Arial, sans-serif';
  
  // Generate the PDF content HTML
  container.innerHTML = generateBudgetHTML(budget, shopProfile);
  
  // Add to document
  document.body.appendChild(container);
  
  try {
    // Generate canvas from HTML
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff'
    });
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Generate filename
    const filename = `Orcamento_${budget.device_model.replace(/\s+/g, '_')}_${budget.id.slice(0, 8)}.pdf`;
    
    // Download the PDF
    pdf.save(filename);
    
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
};

const generateBudgetHTML = (budget: BudgetData, shopProfile: ShopProfile | null): string => {
  const createdDate = new Date(budget.created_at).toLocaleDateString('pt-BR');
  const validDate = new Date(budget.valid_until).toLocaleDateString('pt-BR');
  const totalPrice = (budget.total_price / 100).toLocaleString('pt-BR', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  });

  const warrantyText = budget.warranty_months === 1 
    ? `${budget.warranty_months} mês` 
    : `${budget.warranty_months} meses`;

  return `
    <div style="max-width: 714px; margin: 0 auto; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding: 20px; background-color: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px;">
        <h1 style="margin: 0 0 10px 0; color: #92400e; font-size: 28px; font-weight: bold;">
          ${shopProfile?.shop_name || 'Assistência Técnica'}
        </h1>
        ${shopProfile?.address ? `<p style="margin: 5px 0; color: #92400e; font-size: 16px;">${shopProfile.address}</p>` : ''}
        ${shopProfile?.contact_phone ? `<p style="margin: 5px 0; color: #92400e; font-size: 16px;">Telefone: ${shopProfile.contact_phone}</p>` : ''}
        ${shopProfile?.cnpj ? `<p style="margin: 5px 0; color: #92400e; font-size: 14px;">CNPJ: ${shopProfile.cnpj}</p>` : ''}
      </div>

      <!-- Budget Title -->
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="margin: 0; color: #1f2937; font-size: 24px; font-weight: bold; text-decoration: underline;">
          ORÇAMENTO
        </h2>
      </div>

      <!-- Budget Info -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; border: 1px solid #f59e0b;">
          <strong style="color: #92400e;">Data de Criação:</strong><br>
          <span style="color: #92400e;">${createdDate}</span>
        </div>
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; border: 1px solid #f59e0b;">
          <strong style="color: #92400e;">Válido até:</strong><br>
          <span style="color: #92400e;">${validDate}</span>
        </div>
      </div>

      <!-- Client Info -->
      ${budget.client_name || budget.client_phone ? `
        <div style="margin-bottom: 25px; background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: bold;">Dados do Cliente</h3>
          ${budget.client_name ? `<p style="margin: 8px 0;"><strong>Nome:</strong> <span style="background-color: #fef3c7; padding: 2px 6px; border-radius: 3px;">${budget.client_name}</span></p>` : ''}
          ${budget.client_phone ? `<p style="margin: 8px 0;"><strong>Telefone:</strong> <span style="background-color: #fef3c7; padding: 2px 6px; border-radius: 3px;">${budget.client_phone}</span></p>` : ''}
        </div>
      ` : ''}

      <!-- Device Info -->
      <div style="margin-bottom: 25px; background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: bold;">Informações do Dispositivo</h3>
        <p style="margin: 8px 0;"><strong>Aparelho:</strong> <span style="background-color: #fef3c7; padding: 2px 6px; border-radius: 3px; font-weight: bold;">${budget.device_model}</span></p>
        <p style="margin: 8px 0;"><strong>Tipo:</strong> <span style="background-color: #fef3c7; padding: 2px 6px; border-radius: 3px;">${budget.device_type}</span></p>
        <p style="margin: 8px 0;"><strong>Problema:</strong> <span style="background-color: #fef3c7; padding: 2px 6px; border-radius: 3px;">${budget.issue}</span></p>
      </div>

      <!-- Price Info -->
      <div style="margin-bottom: 25px; background-color: #f0f9ff; padding: 20px; border-radius: 8px; border: 2px solid #0ea5e9;">
        <h3 style="margin: 0 0 15px 0; color: #0c4a6e; font-size: 18px; font-weight: bold;">Valor do Serviço</h3>
        <div style="text-align: center; background-color: #fef3c7; padding: 15px; border-radius: 6px; border: 2px solid #f59e0b;">
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #92400e;">
            R$ ${totalPrice}
          </p>
          ${budget.installments && budget.installments > 1 ? `
            <p style="margin: 10px 0 0 0; font-size: 16px; color: #92400e;">
              ou ${budget.installments}x no cartão
            </p>
          ` : ''}
        </div>
      </div>

      <!-- Warranty and Services -->
      <div style="margin-bottom: 25px; background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; font-weight: bold;">Garantia e Serviços</h3>
        <p style="margin: 8px 0;"><strong>Garantia:</strong> <span style="background-color: #fef3c7; padding: 2px 6px; border-radius: 3px;">${warrantyText}</span></p>
        
        ${budget.includes_delivery || budget.includes_screen_protector ? `
          <div style="margin-top: 15px;">
            <p style="margin: 8px 0; font-weight: bold; color: #059669;">Serviços Inclusos:</p>
            ${budget.includes_delivery ? `<p style="margin: 5px 0; color: #059669;">✓ Busca e entrega do aparelho</p>` : ''}
            ${budget.includes_screen_protector ? `<p style="margin: 5px 0; color: #059669;">✓ Película 3D de brinde</p>` : ''}
          </div>
        ` : ''}
      </div>

      <!-- Terms -->
      <div style="margin-top: 30px; padding: 20px; background-color: #fef2f2; border-radius: 8px; border: 1px solid #fca5a5;">
        <h3 style="margin: 0 0 15px 0; color: #dc2626; font-size: 16px; font-weight: bold;">Condições Importantes</h3>
        <ul style="margin: 0; padding-left: 20px; color: #dc2626;">
          <li style="margin: 5px 0;">Garantia não cobre danos por queda ou contato com líquidos</li>
          <li style="margin: 5px 0;">Orçamento válido até a data especificada</li>
          <li style="margin: 5px 0;">Valores sujeitos a alteração sem aviso prévio</li>
        </ul>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; padding: 15px; border-top: 2px solid #e5e7eb;">
        <p style="margin: 0; color: #6b7280; font-size: 12px;">
          Este documento foi gerado automaticamente pelo sistema BudgetFlow
        </p>
      </div>
    </div>
  `;
};
