
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface BudgetPDFData {
  // Dados do orçamento
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
  
  // Dados da loja
  shop_name: string;
  shop_address: string;
  shop_phone: string;
  shop_cnpj?: string;
}

export const generateBudgetPDF = async (data: BudgetPDFData): Promise<Blob> => {
  return generateProfessionalPDF(data);
};

const generateProfessionalPDF = async (data: BudgetPDFData): Promise<Blob> => {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Paleta de cores profissional
  const colors = {
    primary: [37, 99, 235], // Azul profissional
    secondary: [59, 130, 246], // Azul mais claro
    accent: [16, 185, 129], // Verde para destaques
    text: [17, 24, 39], // Cinza escuro para texto
    lightText: [107, 114, 128], // Cinza para texto secundário
    background: [249, 250, 251], // Cinza muito claro para fundos
    white: [255, 255, 255]
  };

  // HEADER PRINCIPAL - Design mais elegante
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, 0, 210, 35, 'F');
  
  // Logo placeholder (círculo)
  doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.circle(25, 17.5, 8, 'F');
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('LOGO', 25, 20, { align: 'center' });
  
  // Nome da empresa
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text(data.shop_name || 'Nome da Empresa', 45, 15);
  
  // Subtítulo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text('Assistência Técnica Especializada', 45, 22);
  
  // Informações de contato no header
  doc.setFontSize(8);
  let contactY = 28;
  if (data.shop_cnpj) {
    doc.text(`CNPJ: ${data.shop_cnpj}`, 45, contactY);
    contactY += 3;
  }
  doc.text(`${data.shop_address} | ${data.shop_phone}`, 45, contactY);

  // TÍTULO DO DOCUMENTO
  let yPos = 50;
  doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
  doc.rect(15, yPos - 5, 180, 15, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text('ORÇAMENTO DE SERVIÇO', 105, yPos + 5, { align: 'center' });

  // SEÇÃO DE INFORMAÇÕES BÁSICAS
  yPos += 25;
  
  // Container das datas
  doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setDrawColor(colors.background[0], colors.background[1], colors.background[2]);
  doc.rect(15, yPos, 180, 20, 'FD');
  
  const createdDate = new Date(data.created_at).toLocaleDateString('pt-BR');
  const validDate = new Date(data.valid_until).toLocaleDateString('pt-BR');
  
  // Data de emissão
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colors.lightText[0], colors.lightText[1], colors.lightText[2]);
  doc.text('DATA DE EMISSÃO', 20, yPos + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.text(createdDate, 20, yPos + 12);
  
  // Válido até
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colors.lightText[0], colors.lightText[1], colors.lightText[2]);
  doc.text('VÁLIDO ATÉ', 120, yPos + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.text(validDate, 120, yPos + 12);
  
  // Número do orçamento (lado direito)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colors.lightText[0], colors.lightText[1], colors.lightText[2]);
  doc.text('Nº ORÇAMENTO', 160, yPos + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  const budgetNumber = `#${Date.now().toString().slice(-6)}`;
  doc.text(budgetNumber, 160, yPos + 12);

  // SEÇÃO CLIENTE (se houver)
  yPos += 30;
  if (data.client_name || data.client_phone) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text('DADOS DO CLIENTE', 15, yPos);
    
    yPos += 8;
    doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
    doc.rect(15, yPos, 180, 15, 'F');
    
    let clientText = '';
    if (data.client_name) {
      clientText = data.client_name;
    }
    if (data.client_phone) {
      clientText += data.client_name ? ` • ${data.client_phone}` : data.client_phone;
    }
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text(clientText, 20, yPos + 8);
    yPos += 20;
  }

  // SEÇÃO DETALHES DO SERVIÇO
  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text('DETALHES DO SERVIÇO', 15, yPos);
  
  yPos += 10;
  
  // Tabela de detalhes com design moderno
  const tableHeaders = ['ITEM', 'DESCRIÇÃO'];
  const tableData = [
    ['Aparelho', data.device_type || 'Smartphone'],
    ['Modelo', data.device_model],
    ['Serviço', data.issue]
  ];
  
  // Header da tabela
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(15, yPos, 180, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.text('ITEM', 20, yPos + 6);
  doc.text('DESCRIÇÃO', 80, yPos + 6);
  
  yPos += 10;
  
  // Linhas da tabela
  tableData.forEach((row, index) => {
    const isEven = index % 2 === 0;
    doc.setFillColor(
      isEven ? colors.white[0] : colors.background[0],
      isEven ? colors.white[1] : colors.background[1],
      isEven ? colors.white[2] : colors.background[2]
    );
    doc.rect(15, yPos, 180, 8, 'F');
    
    // Bordas sutis
    doc.setDrawColor(colors.background[0], colors.background[1], colors.background[2]);
    doc.setLineWidth(0.1);
    doc.rect(15, yPos, 180, 8, 'S');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(colors.lightText[0], colors.lightText[1], colors.lightText[2]);
    doc.text(row[0], 20, yPos + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text(row[1], 80, yPos + 5);
    
    yPos += 8;
  });

  // SEÇÃO VALORES - Design destacado
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text('VALORES DO SERVIÇO', 15, yPos);
  
  yPos += 10;
  
  // Container dos valores
  doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.setLineWidth(0.5);
  const containerHeight = data.installment_price && data.installments && data.installments > 1 ? 25 : 15;
  doc.rect(15, yPos, 180, containerHeight, 'FD');
  
  // Valor à vista
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(colors.lightText[0], colors.lightText[1], colors.lightText[2]);
  doc.text('VALOR À VISTA', 20, yPos + 8);
  
  const cashPrice = (data.cash_price / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.text(cashPrice, 70, yPos + 8);
  
  // Valor parcelado (se houver)
  if (data.installment_price && data.installments && data.installments > 1) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colors.lightText[0], colors.lightText[1], colors.lightText[2]);
    doc.text('VALOR PARCELADO', 20, yPos + 18);
    
    const installmentPrice = (data.installment_price / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text(`${installmentPrice} em ${data.installments}x`, 70, yPos + 18);
  }

  // SEÇÃO GARANTIA
  yPos += containerHeight + 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text('GARANTIA', 15, yPos);
  
  yPos += 8;
  doc.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
  doc.rect(15, yPos, 180, 12, 'F');
  
  const warrantyText = data.warranty_months === 1 
    ? `${data.warranty_months} mês` 
    : `${data.warranty_months} meses`;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.text(`Prazo: ${warrantyText}`, 20, yPos + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(colors.lightText[0], colors.lightText[1], colors.lightText[2]);
  doc.text('* Garantia não cobre danos por queda, impacto ou líquidos', 20, yPos + 9);

  // SEÇÃO OBSERVAÇÕES
  yPos += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text('O QUE ESTÁ INCLUSO', 15, yPos);
  
  yPos += 8;
  doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.setLineWidth(0.3);
  doc.rect(15, yPos, 180, 20, 'FD');
  
  // Ícones e texto
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  
  // Item 1
  doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.circle(22, yPos + 6, 1.5, 'F');
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.text('✓', 22, yPos + 7, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.text('Busca e entrega do aparelho', 28, yPos + 7);
  
  // Item 2
  doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
  doc.circle(22, yPos + 13, 1.5, 'F');
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.text('✓', 22, yPos + 14, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.text('Película de proteção de brinde', 28, yPos + 14);

  // RODAPÉ ELEGANTE
  yPos += 35;
  
  // Linha decorativa
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setLineWidth(0.5);
  doc.line(15, yPos, 195, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text('Obrigado pela confiança!', 105, yPos, { align: 'center' });
  
  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(colors.lightText[0], colors.lightText[1], colors.lightText[2]);
  doc.text('Estamos prontos para cuidar do seu aparelho com o máximo cuidado e qualidade.', 105, yPos, { align: 'center' });
  
  // Converter para blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
};

export const generatePDFImage = async (data: BudgetPDFData): Promise<string> => {
  try {
    // Criar um elemento HTML temporário para capturar como imagem
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = `
      position: absolute;
      top: -9999px;
      left: -9999px;
      width: 794px;
      height: 1123px;
      background: white;
      padding: 40px;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      box-sizing: border-box;
      color: #111827;
    `;
    
    const cashPrice = (data.cash_price / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    
    let installmentSection = '';
    if (data.installment_price && data.installments && data.installments > 1) {
      const installmentPrice = (data.installment_price / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      installmentSection = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding: 15px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; border-left: 4px solid #3b82f6;">
          <div>
            <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">VALOR PARCELADO</p>
            <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #1e293b;">${installmentPrice}</p>
          </div>
          <div style="background: #3b82f6; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px;">
            ${data.installments}x
          </div>
        </div>
      `;
    }
    
    const warrantyText = data.warranty_months === 1 
      ? `${data.warranty_months} mês` 
      : `${data.warranty_months} meses`;
    
    const createdDate = new Date(data.created_at).toLocaleDateString('pt-BR');
    const validDate = new Date(data.valid_until).toLocaleDateString('pt-BR');
    const budgetNumber = `#${Date.now().toString().slice(-6)}`;
    
    tempDiv.innerHTML = `
      <!-- Header Principal -->
      <div style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 25px; border-radius: 16px; margin-bottom: 30px; color: white; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -20px; right: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%; opacity: 0.5;"></div>
        <div style="position: absolute; bottom: -30px; left: -30px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%; opacity: 0.3;"></div>
        <div style="position: relative; z-index: 2;">
          <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <div style="width: 50px; height: 50px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 20px; font-weight: bold; color: #2563eb; font-size: 12px;">LOGO</div>
            <div>
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">${data.shop_name}</h1>
              <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Assistência Técnica Especializada</p>
            </div>
          </div>
          <div style="font-size: 12px; opacity: 0.8; line-height: 1.4;">
            ${data.shop_cnpj ? `<div>CNPJ: ${data.shop_cnpj}</div>` : ''}
            <div>${data.shop_address} | ${data.shop_phone}</div>
          </div>
        </div>
      </div>
      
      <!-- Título do Documento -->
      <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px;">
        <h2 style="margin: 0; font-size: 24px; color: #2563eb; font-weight: bold; letter-spacing: 1px;">ORÇAMENTO DE SERVIÇO</h2>
      </div>
      
      <!-- Informações Básicas -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px;">
        <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Data de Emissão</p>
          <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: bold; color: #1e293b;">${createdDate}</p>
        </div>
        <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #10b981; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Válido Até</p>
          <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: bold; color: #10b981;">${validDate}</p>
        </div>
        <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Nº Orçamento</p>
          <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: bold; color: #1e293b;">${budgetNumber}</p>
        </div>
      </div>
      
      ${data.client_name || data.client_phone ? `
        <div style="margin-bottom: 30px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #0ea5e9;">
          <h3 style="color: #2563eb; margin: 0 0 15px 0; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Dados do Cliente</h3>
          <div style="font-size: 14px; color: #1e293b; line-height: 1.6;">
            ${data.client_name ? `<div style="margin-bottom: 5px;"><strong>Nome:</strong> ${data.client_name}</div>` : ''}
            ${data.client_phone ? `<div><strong>Telefone:</strong> ${data.client_phone}</div>` : ''}
          </div>
        </div>
      ` : ''}
      
      <!-- Detalhes do Serviço -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2563eb; margin-bottom: 20px; font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Detalhes do Serviço</h3>
        <div style="background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
          <!-- Header da Tabela -->
          <div style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 15px; color: white;">
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
              <div>ITEM</div>
              <div>DESCRIÇÃO</div>
            </div>
          </div>
          
          <!-- Linhas da Tabela -->
          <div style="padding: 0;">
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px; padding: 15px; border-bottom: 1px solid #f1f5f9; background: #fafafa;">
              <div style="font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase;">Aparelho</div>
              <div style="font-weight: bold; color: #1e293b; font-size: 14px;">${data.device_type || 'Smartphone'}</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px; padding: 15px; border-bottom: 1px solid #f1f5f9; background: white;">
              <div style="font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase;">Modelo</div>
              <div style="font-weight: bold; color: #1e293b; font-size: 14px;">${data.device_model}</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px; padding: 15px; background: #fafafa;">
              <div style="font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase;">Serviço</div>
              <div style="font-weight: bold; color: #1e293b; font-size: 14px;">${data.issue}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Valores -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2563eb; margin-bottom: 20px; font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Valores do Serviço</h3>
        <div style="background: white; padding: 25px; border-radius: 12px; border: 2px solid #10b981;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">VALOR À VISTA</p>
              <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold; color: #10b981;">${cashPrice}</p>
            </div>
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 25px; border-radius: 12px; text-align: center; min-width: 120px;">
              <div style="font-size: 12px; opacity: 0.9; margin-bottom: 5px;">ECONOMIA</div>
              <div style="font-size: 16px; font-weight: bold;">À VISTA</div>
            </div>
          </div>
          ${installmentSection}
        </div>
      </div>
      
      <!-- Garantia -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2563eb; margin-bottom: 15px; font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Garantia</h3>
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div>
              <p style="margin: 0; font-size: 16px; font-weight: bold; color: #92400e;">Prazo: ${warrantyText}</p>
              <p style="font-size: 12px; color: #b45309; margin: 5px 0 0 0;">* Garantia não cobre danos por queda, impacto ou líquidos</p>
            </div>
            <div style="background: #f59e0b; color: white; padding: 10px 15px; border-radius: 8px; font-weight: bold;">
              ⚡ GARANTIA
            </div>
          </div>
        </div>
      </div>
      
      <!-- O que está incluso -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2563eb; margin-bottom: 15px; font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">O que está incluso</h3>
        <div style="background: white; border: 2px solid #10b981; border-radius: 12px; padding: 20px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div style="display: flex; align-items: center;">
              <div style="width: 30px; height: 30px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; color: white; font-weight: bold;">✓</div>
              <span style="color: #1e293b; font-weight: 500;">Busca e entrega do aparelho</span>
            </div>
            <div style="display: flex; align-items: center;">
              <div style="width: 30px; height: 30px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; color: white; font-weight: bold;">✓</div>
              <span style="color: #1e293b; font-weight: 500;">Película de proteção de brinde</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Rodapé -->
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #2563eb;">
        <h4 style="color: #2563eb; font-size: 20px; margin: 0 0 10px 0; font-weight: bold;">Obrigado pela confiança!</h4>
        <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.5;">Estamos prontos para cuidar do seu aparelho com o máximo cuidado e qualidade.</p>
      </div>
    `;
    
    document.body.appendChild(tempDiv);
    
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: false
    });
    
    document.body.removeChild(tempDiv);
    
    return canvas.toDataURL('image/png', 0.9);
    
  } catch (error) {
    console.error('Erro ao gerar imagem do PDF:', error);
    throw new Error('Falha ao gerar a imagem do orçamento');
  }
};
