
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
  // Criar PDF profissional diretamente
  return generateProfessionalPDF(data);
};

const generateProfessionalPDF = async (data: BudgetPDFData): Promise<Blob> => {
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Configurações de cores
  const primaryColor = [64, 64, 64]; // Cinza escuro
  const textColor = [0, 0, 0]; // Preto para texto destacado
  const lightGray = [245, 245, 245];
  const mediumGray = [128, 128, 128];
  
  // Header - Nome da empresa
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(data.shop_name || 'Nome da Empresa', 105, 15, { align: 'center' });
  
  // Informações da empresa
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  
  if (data.shop_cnpj) {
    doc.text(`CNPJ: ${data.shop_cnpj}`, 105, 22, { align: 'center' });
  }
  doc.text(`Endereço: ${data.shop_address}`, 105, 28, { align: 'center' });
  doc.text(`Contato: ${data.shop_phone}`, 105, 34, { align: 'center' });
  
  // Título do orçamento
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('ORÇAMENTO DE SERVIÇO', 105, 55, { align: 'center' });
  
  // Seção de datas
  let yPos = 75;
  
  // Data do Orçamento
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Data do Orçamento:', 20, yPos);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  const createdDate = new Date(data.created_at).toLocaleDateString('pt-BR');
  doc.text(createdDate, 20, yPos + 6);
  
  // Válido Até - aumentei o espaçamento
  yPos += 20;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Válido Até:', 20, yPos);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  const validDate = new Date(data.valid_until).toLocaleDateString('pt-BR');
  doc.text(validDate, 20, yPos + 6);
  
  // Cliente (se houver) - aumentei o espaçamento
  if (data.client_name || data.client_phone) {
    yPos += 30;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Cliente:', 20, yPos);
    
    if (data.client_name) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(data.client_name, 20, yPos + 6);
    }
    
    if (data.client_phone) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
      doc.text(`Tel: ${data.client_phone}`, 20, yPos + 12);
    }
  }
  
  // Detalhes do Aparelho e Serviço - aumentei mais o espaçamento
  yPos += 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Detalhes do Aparelho e Serviço', 20, yPos);
  
  // Tabela de detalhes
  yPos += 10;
  
  // Header da tabela
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(20, yPos, 170, 10, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Item', 25, yPos + 6);
  doc.text('Descrição', 100, yPos + 6);
  
  // Linha 1 - Aparelho
  yPos += 10;
  doc.setFillColor(255, 255, 255);
  doc.rect(20, yPos, 170, 8, 'F');
  doc.setDrawColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  doc.rect(20, yPos, 170, 8, 'S');
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Aparelho', 25, yPos + 5);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(data.device_model, 100, yPos + 5);
  
  // Linha 2 - Serviço
  yPos += 8;
  doc.setFillColor(255, 255, 255);
  doc.rect(20, yPos, 170, 8, 'F');
  doc.rect(20, yPos, 170, 8, 'S');
  
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Serviço Solicitado', 25, yPos + 5);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(data.issue, 100, yPos + 5);
  
  // Linha 3 - Marca/Tipo
  yPos += 8;
  doc.setFillColor(255, 255, 255);
  doc.rect(20, yPos, 170, 8, 'F');
  doc.rect(20, yPos, 170, 8, 'S');
  
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Marca da Peça', 25, yPos + 5);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(data.device_type || 'Original', 100, yPos + 5);
  
  // Seção Valores
  yPos += 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Valores', 20, yPos);
  
  yPos += 15;
  
  // Valor à Vista
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Valor à Vista:', 20, yPos);
  
  const cashPrice = (data.cash_price / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(cashPrice, 20, yPos + 8);
  
  // Valor Parcelado (se houver)
  if (data.installment_price && data.installments && data.installments > 1) {
    yPos += 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Valor Parcelado:', 20, yPos);
    
    const installmentPrice = (data.installment_price / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`${installmentPrice} em até ${data.installments}x`, 20, yPos + 8);
  }
  
  // Seção Garantia
  yPos += 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Garantia', 20, yPos);
  
  yPos += 15;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Prazo da Garantia:', 20, yPos);
  
  const warrantyText = data.warranty_months === 1 
    ? `${data.warranty_months} mês` 
    : `${data.warranty_months} meses`;
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(warrantyText, 20, yPos + 6);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  doc.text('A garantia não cobre danos causados por quebra ou contato com líquidos.', 20, yPos + 15);
  
  // Seção Observações
  yPos += 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Observações', 20, yPos);
  
  // Caixa de observações
  yPos += 10;
  doc.setFillColor(240, 248, 255);
  doc.rect(20, yPos, 170, 20, 'F');
  doc.setDrawColor(70, 130, 180);
  doc.setLineWidth(0.5);
  doc.line(15, yPos, 15, yPos + 20);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text('- Inclui busca e entrega do aparelho', 25, yPos + 7);
  doc.text('- Inclui película de proteção', 25, yPos + 14);
  
  // Rodapé
  yPos = 280;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Agradecemos a preferência!', 105, yPos, { align: 'center' });
  
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
      font-family: Arial, sans-serif;
      box-sizing: border-box;
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
        <div style="margin-top: 20px;">
          <h4 style="color: #404040; margin-bottom: 5px;">Valor Parcelado:</h4>
          <p style="color: #ffc107; font-size: 16px; font-weight: bold; margin: 0;">${installmentPrice} em até ${data.installments}x</p>
        </div>
      `;
    }
    
    const warrantyText = data.warranty_months === 1 
      ? `${data.warranty_months} mês` 
      : `${data.warranty_months} meses`;
    
    const createdDate = new Date(data.created_at).toLocaleDateString('pt-BR');
    const validDate = new Date(data.valid_until).toLocaleDateString('pt-BR');
    
    tempDiv.innerHTML = `
      <div style="background: #f5f5f5; padding: 20px; text-align: center; margin-bottom: 30px; border-radius: 8px;">
        <h1 style="margin: 0; font-size: 24px; color: #404040; font-weight: bold;">${data.shop_name}</h1>
        ${data.shop_cnpj ? `<p style="margin: 5px 0; color: #808080; font-size: 12px;">CNPJ: ${data.shop_cnpj}</p>` : ''}
        <p style="margin: 5px 0; color: #808080; font-size: 12px;">Endereço: ${data.shop_address}</p>
        <p style="margin: 5px 0; color: #808080; font-size: 12px;">Contato: ${data.shop_phone}</p>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="margin: 0; font-size: 20px; color: #404040; font-weight: bold;">ORÇAMENTO DE SERVIÇO</h2>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <h4 style="color: #404040; margin-bottom: 5px;">Data do Orçamento:</h4>
          <p style="color: #ffc107; font-weight: bold; margin: 0;">${createdDate}</p>
        </div>
        <div>
          <h4 style="color: #404040; margin-bottom: 5px;">Válido Até:</h4>
          <p style="color: #ffc107; font-weight: bold; margin: 0;">${validDate}</p>
        </div>
      </div>
      
      ${data.client_name || data.client_phone ? `
        <div style="margin-bottom: 30px; background: #f8f9fa; padding: 15px; border-radius: 8px;">
          <h3 style="color: #404040; margin-top: 0; margin-bottom: 10px;">Cliente</h3>
          ${data.client_name ? `<p style="margin: 5px 0; color: #404040;"><strong>Nome:</strong> ${data.client_name}</p>` : ''}
          ${data.client_phone ? `<p style="margin: 5px 0; color: #808080;"><strong>Telefone:</strong> ${data.client_phone}</p>` : ''}
        </div>
      ` : ''}
      
      <div style="margin-bottom: 30px;">
        <h3 style="color: #404040; margin-bottom: 15px;">Detalhes do Aparelho e Serviço</h3>
        <table style="width: 100%; border-collapse: collapse; background: white;">
          <thead>
            <tr style="background: #f5f5f5;">
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left; color: #404040;">Item</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left; color: #404040;">Descrição</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ddd; padding: 10px; color: #404040;">Aparelho</td>
              <td style="border: 1px solid #ddd; padding: 10px; color: #ffc107; font-weight: bold;">${data.device_model}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 10px; color: #404040;">Serviço Solicitado</td>
              <td style="border: 1px solid #ddd; padding: 10px; color: #ffc107; font-weight: bold;">${data.issue}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 10px; color: #404040;">Marca da Peça</td>
              <td style="border: 1px solid #ddd; padding: 10px; color: #ffc107; font-weight: bold;">${data.device_type || 'Original'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h3 style="color: #404040; margin-bottom: 15px;">Valores</h3>
        <div>
          <h4 style="color: #404040; margin-bottom: 5px;">Valor à Vista:</h4>
          <p style="color: #ffc107; font-size: 18px; font-weight: bold; margin: 0;">${cashPrice}</p>
        </div>
        ${installmentSection}
      </div>
      
      <div style="margin-bottom: 30px;">
        <h3 style="color: #404040; margin-bottom: 15px;">Garantia</h3>
        <div>
          <h4 style="color: #404040; margin-bottom: 5px;">Prazo da Garantia:</h4>
          <p style="color: #ffc107; font-weight: bold; margin: 0;">${warrantyText}</p>
          <p style="font-size: 12px; color: #808080; margin-top: 10px;">A garantia não cobre danos causados por quebra ou contato com líquidos.</p>
        </div>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h3 style="color: #404040; margin-bottom: 15px;">Observações</h3>
        <div style="background: #f0f8ff; border-left: 4px solid #4682b4; padding: 15px;">
          <p style="color: #ffc107; margin: 5px 0;">- Inclui busca e entrega do aparelho</p>
          <p style="color: #ffc107; margin: 5px 0;">- Inclui película de proteção</p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 40px;">
        <h4 style="color: #404040; font-size: 16px;">Agradecemos a preferência!</h4>
      </div>
    `;
    
    document.body.appendChild(tempDiv);
    
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false
    });
    
    document.body.removeChild(tempDiv);
    
    return canvas.toDataURL('image/png', 0.8);
    
  } catch (error) {
    console.error('Erro ao gerar imagem do PDF:', error);
    throw new Error('Falha ao gerar a imagem do orçamento');
  }
};
