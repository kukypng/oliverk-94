
// Tipo para um novo orçamento, mantido como 'any' para consistência com o código original.
type BudgetInsert = any;

/**
 * Gera o conteúdo CSV para exportação a partir de uma lista de orçamentos.
 * @param budgets - A lista de orçamentos a ser exportada.
 * @returns O conteúdo do arquivo CSV como uma string.
 */
export const generateExportCsv = (budgets: any[]): string => {
  const headers = [
    'ID', 'Status', 'Nome do Cliente', 'Telefone do Cliente', 'Tipo de Aparelho',
    'Marca do Aparelho', 'Modelo', 'Problema', 'Serviço Realizado', 'Preço Total',
    'Preço Parcelado', 'Parcelas', 'Condição de Pagamento', 'Garantia (meses)',
    'Inclui Entrega (sim/não)', 'Inclui Película (sim/não)', 'Data de Criação',
    'Válido Até', 'Observações'
  ];

  const formattedData = budgets.map(b => ({
    'ID': b.id,
    'Status': b.status,
    'Nome do Cliente': b.client_name || '',
    'Telefone do Cliente': b.client_phone || '',
    'Tipo de Aparelho': b.device_type,
    'Marca do Aparelho': b.device_brand || '',
    'Modelo': b.device_model,
    'Problema': b.issue,
    'Serviço Realizado': b.part_type,
    'Preço Total': (Number(b.total_price) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
    'Preço Parcelado': b.installment_price ? (Number(b.installment_price) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00',
    'Parcelas': b.installments,
    'Condição de Pagamento': b.payment_condition,
    'Garantia (meses)': b.warranty_months,
    'Inclui Entrega (sim/não)': b.includes_delivery ? 'sim' : 'não',
    'Inclui Película (sim/não)': b.includes_screen_protector ? 'sim' : 'não',
    'Data de Criação': new Date(b.created_at).toLocaleDateString('pt-BR'),
    'Válido Até': b.valid_until ? new Date(b.valid_until).toLocaleDateString('pt-BR') : '',
    'Observações': b.notes || '',
  }));

  const csvContent = [
    headers.join(';'),
    ...formattedData.map((row: any) => 
        headers.map(header => {
            let value = row[header] ?? '';
            if (typeof value === 'string' && (value.includes(';') || value.includes('"') || value.includes('\n'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(';')
    )
  ].join('\n');
  
  return '\uFEFF' + csvContent; // Adiciona BOM para garantir a codificação UTF-8 correta no Excel.
};

/**
 * Gera o conteúdo CSV para o modelo de importação.
 * @returns O conteúdo do arquivo de modelo CSV como uma string.
 */
export const generateTemplateCsv = (): string => {
  const headers = [
    'Tipo de Aparelho', 'Marca do Aparelho', 'Modelo do Aparelho', 'Defeito/Problema',
    'Serviço Realizado', 'Observações', 'Preço Total', 'Preço Parcelado', 'Parcelas',
    'Condição de Pagamento', 'Garantia (meses)', 'Validade (dias)', 'Inclui Entrega (sim/não)',
    'Inclui Película (sim/não)', 'Nome do Cliente', 'Telefone do Cliente'
  ];

  const instructions = [
    '# Instruções: Preencha as colunas com os dados do orçamento. Não altere os nomes dos cabeçalhos.',
    '# Campos Obrigatórios: \'Tipo de Aparelho\', \'Modelo do Aparelho\', \'Defeito/Problema\', \'Serviço Realizado\', \'Preço Total\'',
    '#',
    '# Coluna,Descrição',
    '# "Preço Total / Preço Parcelado","Use números, com vírgula como separador decimal (ex: 1500,50). Não use separadores de milhar."',
    '# "Parcelas","Se não houver preço parcelado, deixe \'Preço Parcelado\' com valor 0 e \'Parcelas\' com 1."',
    '# "Condição de Pagamento","Valores comuns: À Vista, Cartão de Crédito, PIX, Dinheiro. Se vazio, será preenchido automaticamente."',
    '# "Garantia (meses)","Número de meses da garantia. Padrão: 3."',
    '# "Validade (dias)","Por quantos dias o orçamento é válido. Padrão: 15."',
    '# "Inclui Entrega / Inclui Película","Preencha com \'sim\' ou \'não\'. Padrão: \'não\'."',
    '# "Nome do Cliente / Telefone do Cliente","Informações do cliente. Opcional."',
    ''
  ];

  const csvContent = instructions.join('\n') + headers.join(';');
  return '\uFEFF' + csvContent;
};

/**
 * Analisa o texto de um arquivo CSV, valida e prepara os dados para inserção no banco.
 * @param csvText - O conteúdo do arquivo CSV como string.
 * @param userId - O ID do usuário logado.
 * @returns Uma lista de objetos de orçamento prontos para serem inseridos.
 */
export const parseAndPrepareBudgets = (csvText: string, userId: string): BudgetInsert[] => {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== '' && !line.trim().startsWith('#'));
  if (lines.length < 2) {
      throw new Error("Arquivo CSV está vazio, em formato incorreto ou contém apenas cabeçalhos.");
  }

  const headers = lines[0].split(';').map(h => h.trim().replace(/^"|"$/g, ''));
  const json = lines.slice(1).map(line => {
      const values = line.split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
      const obj: { [key: string]: string } = {};
      headers.forEach((header, i) => {
          obj[header] = values[i] || '';
      });
      return obj;
  });
  
  if (json.length === 0) {
    throw new Error("Nenhum orçamento válido encontrado no arquivo. Verifique se os dados foram preenchidos corretamente.");
  }

  const newBudgets = json.filter(row => row['Modelo do Aparelho'] && row['Preço Total']).map((row, index) => {
    const priceString = String(row['Preço Total'] || '0').replace(/\./g, '').replace(',', '.');
    const price = parseFloat(priceString);

    const installmentPriceString = String(row['Preço Parcelado'] || '0').replace(/\./g, '').replace(',', '.');
    const installmentPrice = parseFloat(installmentPriceString);

    const installments = Number(row['Parcelas'] || 1);
    const validityDays = Number(row['Validade (dias)'] || 15);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validityDays);

    if (isNaN(price) || price <= 0) {
      throw new Error(`Preço inválido ou zerado na linha ${index + 2} do CSV. O preço deve ser um número maior que zero.`);
    }

    if (!row['Tipo de Aparelho'] || !row['Modelo do Aparelho'] || !row['Defeito/Problema'] || !row['Serviço Realizado']) {
      throw new Error(`Dados obrigatórios faltando na linha ${index + 2} do CSV. Verifique 'Tipo de Aparelho', 'Modelo do Aparelho', 'Defeito/Problema' e 'Serviço Realizado'.`);
    }
    
    const paymentCondition = row['Condição de Pagamento'] || ((installments > 1 && installmentPrice > 0) ? 'Cartão de Crédito' : 'À Vista');

    return {
      owner_id: userId,
      device_type: row['Tipo de Aparelho'],
      device_brand: row['Marca do Aparelho'] || null,
      device_model: row['Modelo do Aparelho'],
      issue: row['Defeito/Problema'],
      part_type: row['Serviço Realizado'],
      notes: row['Observações'] || '',
      total_price: Math.round(price * 100),
      status: 'pending',
      cash_price: Math.round(price * 100),
      installment_price: isNaN(installmentPrice) || installmentPrice <= 0 ? null : Math.round(installmentPrice * 100),
      installments: isNaN(installments) || installments <= 1 ? 1 : installments,
      payment_condition: paymentCondition,
      warranty_months: Number(row['Garantia (meses)'] || 3),
      includes_delivery: String(row['Inclui Entrega (sim/não)']).toLowerCase() === 'sim',
      includes_screen_protector: String(row['Inclui Película (sim/não)']).toLowerCase() === 'sim',
      valid_until: validUntil.toISOString(),
      client_name: row['Nome do Cliente'] || null,
      client_phone: row['Telefone do Cliente'] || null,
    };
  });
  
  return newBudgets;
};
