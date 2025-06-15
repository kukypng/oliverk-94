
/**
 * Gera o conteúdo CSV para o modelo de importação com um layout amigável, semelhante a uma planilha.
 * @returns O conteúdo do arquivo de modelo CSV como uma string.
 */
export const generateTemplateCsv = (): string => {
  const instructions = [
    'MODELO DE IMPORTACAO DE ORCAMENTOS',
    '==================================',
    '',
    'INSTRUCOES:',
    '1. Preencha uma linha para cada orcamento, seguindo as colunas definidas abaixo.',
    '2. NAO altere os nomes das colunas.',
    '3. Campos com (*) sao obrigatorios.',
    '4. Para precos, use virgula ou ponto como separador decimal (ex: 150,00 ou 150.00).',
    '5. Para colunas de sim/nao, digite exatamente "sim" ou "nao".',
    ''
  ];

  // Cabeçalhos amigáveis para o usuário, compatíveis com a exportação
  const headers = [
    'Tipo Aparelho (*)', 'Marca Aparelho', 'Modelo Aparelho (*)', 'Defeito ou Problema (*)',
    'Servico Realizado (*)', 'Observacoes', 'Preco Total (*)', 'Preco Parcelado', 'Parcelas',
    'Condicao Pagamento', 'Garantia (meses)', 'Validade (dias)', 'Inclui Entrega',
    'Inclui Pelicula'
  ];
  
  // Linha de exemplo para guiar o usuário
  const exampleRow = [
    'Smartphone', 'Samsung', 'Galaxy A12', 'Tela Trincada',
    'Troca de Frontal Completa', 'Aparelho com marcas de uso na tampa', '350,00', '400,00', '2',
    'Cartao de Credito', '3', '10', 'nao', 'sim'
  ];

  const csvContent = [
    instructions.join('\n'),
    headers.join(';'),
    exampleRow.join(';')
  ].join('\n');

  return '\uFEFF' + csvContent; // BOM para garantir encoding correto no Excel
};
