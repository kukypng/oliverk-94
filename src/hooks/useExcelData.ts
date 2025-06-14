
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

// Usando 'any' pois o tipo completo do orçamento é extenso
type Budget = any;

export const useExcelData = () => {
  const { showSuccess, showError, showWarning } = useEnhancedToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

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

      const formattedData = budgets.map(b => ({
        'Tipo de Aparelho': b.device_type,
        'Modelo': b.device_model,
        'Problema': b.issue,
        'Preço Total': Number(b.total_price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        'Condição de Pagamento': b.payment_condition,
        'Data de Criação': new Date(b.created_at).toLocaleDateString('pt-BR'),
        'Observações': b.notes,
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orçamentos');
      
      const columnWidths = Object.keys(formattedData[0] || {}).map(key => ({ wch: Math.max(key.length, 20) }));
      worksheet['!cols'] = columnWidths;

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      FileSaver.saveAs(blob, `orçamentos_exportados_${new Date().toISOString().slice(0,10)}.xlsx`);
      
      toast.dismiss(toastId);
      showSuccess({ title: 'Exportação Concluída', description: 'O arquivo foi baixado com sucesso.' });
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
        const templateData = [{'Tipo de Aparelho': '','Modelo do Aparelho': '','Defeito/Problema': '','Observações': '','Preço Total': 0}];
        const instructions = [["Instruções:", "Preencha as colunas com os dados do orçamento. Não altere os nomes dos cabeçalhos."], ["", "'Preço Total' deve ser um número (ex: 1500.50 ou 1500,50)."]];

        const wsTemplate = XLSX.utils.json_to_sheet(templateData);
        const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, wsTemplate, 'Modelo de Importação');
        XLSX.utils.book_append_sheet(workbook, wsInstructions, 'Instruções');
        
        wsTemplate['!cols'] = Object.keys(templateData[0]).map(key => ({ wch: key.length + 5 }));

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, 'modelo_importacao.xlsx');
        
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
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames.find(name => name.toLowerCase().includes('modelo'));
                
                if (!sheetName) {
                    throw new Error("Aba 'Modelo de Importação' não encontrada na planilha.");
                }
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet) as any[];
                
                if (json.length === 0) {
                  throw new Error("A planilha está vazia ou em formato incorreto.");
                }

                const newBudgets = json.map((row, index) => {
                  const priceString = String(row['Preço Total'] || '0').replace(/\./g, '').replace(',', '.');
                  const price = parseFloat(priceString);

                  if (isNaN(price) || price <= 0) {
                    throw new Error(`Preço inválido ou zerado na linha ${index + 2}. O preço deve ser um número maior que zero.`);
                  }

                  if (!row['Tipo de Aparelho'] || !row['Modelo do Aparelho'] || !row['Defeito/Problema']) {
                    throw new Error(`Dados obrigatórios faltando na linha ${index + 2}. Verifique 'Tipo de Aparelho', 'Modelo do Aparelho' e 'Defeito/Problema'.`);
                  }

                  return {
                    owner_id: user.id,
                    device_type: row['Tipo de Aparelho'],
                    device_model: row['Modelo do Aparelho'],
                    issue: row['Defeito/Problema'],
                    notes: row['Observações'] || '',
                    total_price: price,
                    status: 'pending'
                  };
                });
                
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
        reader.readAsBinaryString(file);
    });

    importPromise
      .then((data) => {
          toast.dismiss(toastId);
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
