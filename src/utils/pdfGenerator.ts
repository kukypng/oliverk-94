
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
  try {
    // Criar um documento PDF do zero baseado no layout do template
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Configurar fonte
    doc.setFont('helvetica');
    
    // Header - Dados da loja
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(data.shop_name || 'Nome da Loja', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Endereço: ${data.shop_address || 'Não informado'}`, 20, 40);
    doc.text(`Telefone: ${data.shop_phone || 'Não informado'}`, 20, 50);
    if (data.shop_cnpj) {
      doc.text(`CNPJ: ${data.shop_cnpj}`, 20, 60);
    }
    
    // Título do orçamento
    doc.setFontSize(18);
    doc.setTextColor(255, 193, 7); // Amarelo
    doc.text('ORÇAMENTO', 20, 80);
    
    // Reset cor para preto
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    
    // Dados do cliente
    let yPos = 100;
    if (data.client_name) {
      doc.text(`Cliente: ${data.client_name}`, 20, yPos);
      yPos += 10;
    }
    if (data.client_phone) {
      doc.text(`Telefone: ${data.client_phone}`, 20, yPos);
      yPos += 10;
    }
    
    // Dados do dispositivo
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(255, 193, 7); // Amarelo
    doc.text('DISPOSITIVO', 20, yPos);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    yPos += 15;
    doc.text(`Modelo: ${data.device_model}`, 20, yPos);
    yPos += 10;
    doc.text(`Tipo: ${data.device_type}`, 20, yPos);
    yPos += 10;
    doc.text(`Problema: ${data.issue}`, 20, yPos);
    
    // Preços
    yPos += 20;
    doc.setFontSize(14);
    doc.setTextColor(255, 193, 7); // Amarelo
    doc.text('VALORES', 20, yPos);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    yPos += 15;
    
    const cashPrice = (data.cash_price / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    doc.text(`À vista: R$ ${cashPrice}`, 20, yPos);
    
    if (data.installment_price && data.installments && data.installments > 1) {
      yPos += 10;
      const installmentPrice = (data.installment_price / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      doc.text(`Parcelado: R$ ${installmentPrice} em ${data.installments}x`, 20, yPos);
    }
    
    // Garantia
    yPos += 20;
    doc.setFontSize(14);
    doc.setTextColor(255, 193, 7); // Amarelo
    doc.text('GARANTIA', 20, yPos);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    yPos += 15;
    const warrantyText = data.warranty_months === 1 
      ? `${data.warranty_months} mês` 
      : `${data.warranty_months} meses`;
    doc.text(`Garantia: ${warrantyText}`, 20, yPos);
    
    // Datas
    yPos += 20;
    doc.setFontSize(14);
    doc.setTextColor(255, 193, 7); // Amarelo
    doc.text('INFORMAÇÕES', 20, yPos);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    yPos += 15;
    
    const createdDate = new Date(data.created_at).toLocaleDateString('pt-BR');
    const validDate = new Date(data.valid_until).toLocaleDateString('pt-BR');
    
    doc.text(`Data de criação: ${createdDate}`, 20, yPos);
    yPos += 10;
    doc.text(`Válido até: ${validDate}`, 20, yPos);
    
    // Observações
    yPos += 20;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('* Garantia não cobre danos por quebra ou líquidos', 20, yPos);
    
    // Converter para blob
    const pdfBlob = doc.output('blob');
    return pdfBlob;
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Falha ao gerar o PDF do orçamento');
  }
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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    let installmentSection = '';
    if (data.installment_price && data.installments && data.installments > 1) {
      const installmentPrice = (data.installment_price / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      installmentSection = `<p><strong>Parcelado:</strong> R$ ${installmentPrice} em ${data.installments}x</p>`;
    }
    
    const warrantyText = data.warranty_months === 1 
      ? `${data.warranty_months} mês` 
      : `${data.warranty_months} meses`;
    
    const createdDate = new Date(data.created_at).toLocaleDateString('pt-BR');
    const validDate = new Date(data.valid_until).toLocaleDateString('pt-BR');
    
    tempDiv.innerHTML = `
      <div style="background: #ffc107; color: black; padding: 20px; text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 24px;">${data.shop_name || 'Nome da Loja'}</h1>
        <p style="margin: 5px 0;">${data.shop_address || 'Endereço não informado'}</p>
        <p style="margin: 5px 0;">${data.shop_phone || 'Telefone não informado'}</p>
        ${data.shop_cnpj ? `<p style="margin: 5px 0;">CNPJ: ${data.shop_cnpj}</p>` : ''}
      </div>
      
      <div style="background: #ffc107; color: black; padding: 15px; text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 20px;">ORÇAMENTO</h2>
      </div>
      
      ${data.client_name || data.client_phone ? `
        <div style="margin-bottom: 20px; background: #f8f9fa; padding: 15px;">
          <h3 style="color: #ffc107; margin-top: 0;">CLIENTE</h3>
          ${data.client_name ? `<p><strong>Nome:</strong> ${data.client_name}</p>` : ''}
          ${data.client_phone ? `<p><strong>Telefone:</strong> ${data.client_phone}</p>` : ''}
        </div>
      ` : ''}
      
      <div style="margin-bottom: 20px; background: #f8f9fa; padding: 15px;">
        <h3 style="color: #ffc107; margin-top: 0;">DISPOSITIVO</h3>
        <p><strong>Modelo:</strong> ${data.device_model}</p>
        <p><strong>Tipo:</strong> ${data.device_type}</p>
        <p><strong>Problema:</strong> ${data.issue}</p>
      </div>
      
      <div style="margin-bottom: 20px; background: #f8f9fa; padding: 15px;">
        <h3 style="color: #ffc107; margin-top: 0;">VALORES</h3>
        <p><strong>À vista:</strong> R$ ${cashPrice}</p>
        ${installmentSection}
      </div>
      
      <div style="margin-bottom: 20px; background: #f8f9fa; padding: 15px;">
        <h3 style="color: #ffc107; margin-top: 0;">GARANTIA</h3>
        <p><strong>Período:</strong> ${warrantyText}</p>
        <p style="font-size: 12px; color: #666;">* Garantia não cobre danos por quebra ou líquidos</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 15px;">
        <h3 style="color: #ffc107; margin-top: 0;">INFORMAÇÕES</h3>
        <p><strong>Data de criação:</strong> ${createdDate}</p>
        <p><strong>Válido até:</strong> ${validDate}</p>
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
