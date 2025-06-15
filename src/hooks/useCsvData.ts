
import * as FileSaver from 'file-saver';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useQueryClient } from '@tanstack/react-query';

// Usando 'any' pois o tipo completo do orçamento é extenso
type Budget = any;

export const useCsvData = () => {
  const { showSuccess, showError, showWarning } = useEnhancedToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchAndExportBudgets = async () => {
    setIsProcessing(true);
    const toastId = toast.loading('Exportando orçamentos...');

    if (!user) {
      toast.dismiss(toastId);
      showError({ title: 'Erro de Autenticação', description: 'Você precisa estar logado para exportar dados.' });
      setIsProcessing(false);
      return;
    }

    try {
      const { data: budgets, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw new Error('Não foi possível buscar os orçamentos.');

      if (!budgets || budgets.length === 0) {
        toast.dismiss(toastId);
        showWarning({ title: 'Nenhum Orçamento', description: 'Não há dados para exportar.' });
        setIsProcessing(false);
        return;
      }

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
      
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      FileSaver.saveAs(blob, `orcamentos_exportados_${new Date().toISOString().slice(0,10)}.csv`);
      
      toast.dismiss(toastId);
      showSuccess({ title: 'Exportação Concluída', description: 'O arquivo CSV foi baixado com sucesso.' });
    } catch (err: any) {
      toast.dismiss(toastId);
      showError({ title: 'Erro na Exportação', description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImportTemplate = () => {
    setIsProcessing(true);
    try {
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
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        FileSaver.saveAs(blob, 'modelo_importacao.csv');
        
        showSuccess({ title: 'Modelo Gerado', description: 'O download do modelo foi iniciado.' });
    } catch (error) {
        console.error("Erro ao gerar modelo:", error);
        showError({ title: 'Erro ao Gerar Modelo', description: 'Não foi possível criar o arquivo de modelo.' });
    } finally {
        setIsProcessing(false);
    }
  };

  const processImportedFile = async (file: File) => {
    setIsProcessing(true);
    const toastId = toast.loading('Processando arquivo...');

    if (!user) {
      toast.dismiss(toastId);
      showError({ title: 'Erro de Autenticação', description: 'Você precisa estar logado para importar dados.' });
      setIsProcessing(false);
      return;
    }

    const importPromise = new Promise(async (resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;

                const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '' && !line.trim().startsWith('#'));
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
                    owner_id: user.id,
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
                
                if (newBudgets.length === 0) {
                  throw new Error("Nenhum orçamento válido encontrado no arquivo. Verifique se os dados obrigatórios foram preenchidos.");
                }

                const { data: insertedData, error } = await supabase
                  .from('budgets')
                  .insert(newBudgets)
                  .select();

                if (error) {
                  console.error("Erro ao salvar no Supabase:", error);
                  throw new Error(`Erro ao salvar os dados: ${error.message}`);
                }

                resolve(insertedData);

            } catch (err: any) {
                reject(err);
            }
        };
        reader.onerror = (err) => reject(new Error("Não foi possível ler o arquivo."));
        reader.readAsText(file, 'UTF-8');
    });

    importPromise
      .then((data) => {
          toast.dismiss(toastId);
          queryClient.invalidateQueries({ queryKey: ['budgets'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          queryClient.invalidateQueries({ queryKey: ['recent-budgets-for-new'] });
          showSuccess({ title: 'Importação Concluída', description: `${(data as any[]).length} orçamentos foram importados com sucesso.` });
      })
      .catch((err: any) => {
          toast.dismiss(toastId);
          showError({ title: 'Erro na Importação', description: err.message });
      })
      .finally(() => setIsProcessing(false));
  };


  return { isProcessing, fetchAndExportBudgets, downloadImportTemplate, processImportedFile };
};
