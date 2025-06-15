
import { normalizeDataString } from './normalizer';

/**
 * Formata um valor para ser inserido em uma célula CSV, escapando caracteres especiais.
 */
const formatCsvField = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  let str = normalizeDataString(String(value));

  if (str.includes(';') || str.includes('\n') || str.includes('"')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};


/**
 * Gera o conteúdo CSV para exportação a partir de uma lista de orçamentos.
 * Usa cabeçalhos limpos e dados normalizados.
 * @param budgets - A lista de orçamentos a ser exportada.
 * @returns O conteúdo do arquivo CSV como uma string.
 */
export const generateExportCsv = (budgets: any[]): string => {
  const headers = [
    'ID', 'Status', 'Nome Cliente', 'Telefone Cliente', 'Tipo Aparelho',
    'Marca Aparelho', 'Modelo', 'Problema', 'Servico Realizado', 'Preco Total',
    'Preco Parcelado', 'Parcelas', 'Condicao Pagamento', 'Garantia (meses)',
    'Inclui Entrega', 'Inclui Pelicula', 'Data Criacao',
    'Valido Ate', 'Observacoes'
  ];

  const formattedData = budgets.map(b => [
    b.id,
    b.status,
    b.client_name || '',
    b.client_phone || '',
    b.device_type,
    b.device_brand || '',
    b.device_model,
    b.issue,
    b.part_type,
    (Number(b.total_price) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
    b.installment_price ? (Number(b.installment_price) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00',
    b.installments,
    b.payment_condition,
    b.warranty_months,
    b.includes_delivery ? 'sim' : 'nao',
    b.includes_screen_protector ? 'sim' : 'nao',
    new Date(b.created_at).toLocaleDateString('pt-BR'),
    b.valid_until ? new Date(b.valid_until).toLocaleDateString('pt-BR') : '',
    b.notes || '',
  ]);

  const csvRows = [
    headers.join(';'),
    ...formattedData.map(row => row.map(formatCsvField).join(';'))
  ];
  
  const csvContent = csvRows.join('\n');
  return '\uFEFF' + csvContent; // Adiciona BOM
};
