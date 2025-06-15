
import { normalizeHeader } from './normalizer';

type BudgetInsert = any; // Manter tipo para consistencia

/**
 * Analisa o texto de um arquivo CSV, valida e prepara os dados para inserção no banco.
 * @param csvText - O conteúdo do arquivo CSV como string.
 * @param userId - O ID do usuário logado.
 * @returns Uma lista de objetos de orçamento prontos para serem inseridos.
 */
export const parseAndPrepareBudgets = (csvText: string, userId: string): BudgetInsert[] => {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '' && !line.trim().startsWith('#'));
  if (lines.length < 2) {
      throw new Error("Arquivo CSV invalido. Verifique se contem dados alem do cabecalho.");
  }

  const rawHeaders = lines[0].split(';').map(h => h.trim().replace(/^"|"$/g, ''));
  const normalizedHeaders = rawHeaders.map(normalizeHeader);

  const dataRows = lines.slice(1);

  const newBudgets = dataRows.map((line, rowIndex) => {
    const values = line.split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
    
    const rowObject: { [key: string]: string } = {};
    normalizedHeaders.forEach((header, i) => {
      rowObject[header] = values[i] || '';
    });

    const priceString = String(rowObject['preco_total'] || '0').replace(',', '.');
    const price = parseFloat(priceString);

    if (isNaN(price) || price <= 0) {
      throw new Error(`Preco total invalido ou zerado na linha ${rowIndex + 2}. O preco deve ser um numero maior que zero.`);
    }

    if (!rowObject['tipo_aparelho'] || !rowObject['modelo_aparelho'] || !rowObject['defeito_ou_problema'] || !rowObject['servico_realizado']) {
      throw new Error(`Dados obrigatorios faltando na linha ${rowIndex + 2}. Verifique 'Tipo Aparelho', 'Modelo Aparelho', 'Defeito ou Problema' e 'Servico Realizado'.`);
    }

    const installmentPriceString = String(rowObject['preco_parcelado'] || '0').replace(',', '.');
    const installmentPrice = parseFloat(installmentPriceString);

    const installments = Number(rowObject['parcelas'] || 1);
    const validityDays = Number(rowObject['validade_dias'] || 15);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validityDays);

    const paymentCondition = rowObject['condicao_pagamento'] || ((installments > 1 && installmentPrice > 0) ? 'Cartao de Credito' : 'A Vista');
    
    return {
      owner_id: userId,
      device_type: rowObject['tipo_aparelho'],
      device_brand: rowObject['marca_aparelho'] || null,
      device_model: rowObject['modelo_aparelho'],
      issue: rowObject['defeito_ou_problema'],
      part_type: rowObject['servico_realizado'],
      notes: rowObject['observacoes'] || '',
      total_price: Math.round(price * 100),
      status: 'pending',
      cash_price: Math.round(price * 100),
      installment_price: isNaN(installmentPrice) || installmentPrice <= 0 ? null : Math.round(installmentPrice * 100),
      installments: isNaN(installments) || installments <= 1 ? 1 : installments,
      payment_condition: paymentCondition,
      warranty_months: Number(rowObject['garantia_meses'] || 3),
      includes_delivery: String(rowObject['inclui_entrega_sim_nao']).toLowerCase() === 'sim',
      includes_screen_protector: String(rowObject['inclui_pelicula_sim_nao']).toLowerCase() === 'sim',
      valid_until: validUntil.toISOString(),
      client_name: rowObject['nome_cliente'] || null,
      client_phone: rowObject['telefone_cliente'] || null,
    };
  }).filter(Boolean);

  if (newBudgets.length === 0) {
    throw new Error("Nenhum orcamento valido encontrado no arquivo. Verifique se os dados foram preenchidos corretamente.");
  }
  
  return newBudgets as BudgetInsert[];
};
