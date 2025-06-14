import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { useState } from 'react';
import { toast } from 'sonner';

// Usando 'any' pois o tipo completo do orçamento é extenso
type Budget = any;

export const useExcelData = () => {
  const { showSuccess, showError, showWarning } = useEnhancedToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchAndExportBudgets = async () => {
    setIsProcessing(true);
    const toastId = toast.loading('Exportando orçamentos...');

    const exportPromise = new Promise<string>(async (resolve, reject) => {
      try {
        const { data: budgets, error } = await supabase
          .from('budgets')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw new Error('Não foi possível buscar os orçamentos.');

        if (!budgets || budgets.length === 0) {
            showWarning({ title: 'Nenhum Orçamento', description: 'Não há dados para exportar.' });
            resolve('no-data'); // Não é um erro, apenas não há dados
            return;
        }

        const formattedData = budgets.map(b => ({
          'ID': b.id,
          'Nome do Cliente': b.client_name,
          'Telefone': b.client_phone,
          'Tipo de Aparelho': b.device_type,
          'Modelo': b.device_model,
          'Problema': b.issue,
          'Preço Total': b.total_price,
          'Status': b.status,
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
        resolve('success');
      } catch (err) {
        reject(err);
      }
    });

    exportPromise
      .then((status) => {
        toast.dismiss(toastId);
        if (status === 'success') {
          showSuccess({ title: 'Exportação Concluída', description: 'O arquivo foi baixado com sucesso.' });
        }
      })
      .catch((err: any) => {
        toast.dismiss(toastId);
        showError({ title: 'Erro na Exportação', description: err.message });
      })
      .finally(() => setIsProcessing(false));
  };

  const downloadImportTemplate = () => {
    setIsProcessing(true);
    try {
        const templateData = [{'Nome do Cliente': '','Telefone do Cliente': '','Tipo de Aparelho': '','Modelo do Aparelho': '','Defeito/Problema': '','Observações': '','Preço Total': 0}];
        const instructions = [["Instruções:", "Preencha as colunas com os dados do orçamento. Não altere os nomes dos cabeçalhos."], ["", "'Preço Total' deve ser um número (ex: 1500.50)."]];

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

    const importPromise = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames.find(name => name.toLowerCase().includes('modelo'));
                
                if (!sheetName) {
                    throw new Error("Aba 'Modelo de Importação' não encontrada na planilha.");
                }
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                
                if (json.length === 0) {
                  throw new Error("A planilha está vazia ou em formato incorreto.");
                }

                console.log('Dados importados:', json);
                // A lógica para salvar no banco de dados virá em um próximo passo.
                resolve(json);

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
          showSuccess({ title: 'Arquivo Processado', description: `${(data as any[]).length} registros prontos para serem importados.` });
      })
      .catch((err: any) => {
          toast.dismiss(toastId);
          showError({ title: 'Erro na Importação', description: err.message });
      })
      .finally(() => setIsProcessing(false));
  };


  return { isProcessing, fetchAndExportBudgets, downloadImportTemplate, processImportedFile };
};
