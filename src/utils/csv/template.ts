
/**
 * Gera o conteúdo CSV para o modelo de importação com instruções claras e cabeçalhos normalizados.
 * @returns O conteúdo do arquivo de modelo CSV como uma string.
 */
export const generateTemplateCsv = (): string => {
  // Cabeçalhos amigáveis para o usuário, que serão normalizados no momento da importação
  const headers = [
    'Tipo Aparelho', 'Marca Aparelho', 'Modelo Aparelho', 'Defeito ou Problema',
    'Servico Realizado', 'Observacoes', 'Preco Total', 'Preco Parcelado', 'Parcelas',
    'Condicao Pagamento', 'Garantia (meses)', 'Validade (dias)', 'Inclui Entrega (sim/nao)',
    'Inclui Pelicula (sim/nao)', 'Nome Cliente', 'Telefone Cliente'
  ];

  const instructions = [
    '# GUIA RAPIDO PARA IMPORTACAO DE DADOS',
    '# =====================================',
    '# 1. Preencha as colunas abaixo com os dados do orcamento. NAO altere os nomes dos cabecalhos.',
    '# 2. Campos Obrigatorios: \'Tipo Aparelho\', \'Modelo Aparelho\', \'Defeito ou Problema\', \'Servico Realizado\', \'Preco Total\'.',
    '# 3. Use ponto (.) ou virgula (,) como separador decimal para precos. Ex: 1500.50 ou 1500,50.',
    '#',
    '# DETALHES DAS COLUNAS:',
    '# -> Preco Total / Preco Parcelado: Apenas numeros. Se o preco parcelado for zero ou nao informado, as parcelas serao definidas como 1.',
    '# -> Parcelas: Numero de parcelas. Padrao: 1.',
    '# -> Condicao Pagamento: "A Vista", "Cartao de Credito", "PIX". Se vazio, sera preenchido automaticamente.',
    '# -> Garantia (meses): Numero de meses. Padrao: 3.',
    '# -> Validade (dias): Orcamento valido por quantos dias. Padrao: 15.',
    '# -> Inclui Entrega / Inclui Pelicula: Preencha com "sim" ou "nao". Padrao: "nao".',
    '# -> Campos de Cliente: Opcionais.',
    ''
  ];

  const csvContent = instructions.join('\n') + headers.join(';');
  return '\uFEFF' + csvContent; // BOM para garantir encoding correto no Excel
};
