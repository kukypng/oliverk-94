
import * as FileSaver from 'file-saver';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { useState } from 'react';
import { toast } from 'sonner';
import { User } from '@/types/user';
import { generateUsersExportCsv } from '@/utils/csv';

export const useUserExport = () => {
  const { showSuccess, showError, showWarning } = useEnhancedToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportUsers = async () => {
    setIsExporting(true);
    const toastId = toast.loading('Exportando usuários...');

    try {
      const { data: users, error } = await supabase.rpc('admin_get_all_users');

      if (error) {
        throw new Error(error.message || 'Não foi possível buscar os usuários.');
      }
      
      if (!users || users.length === 0) {
        toast.dismiss(toastId);
        showWarning({ title: 'Nenhum Usuário', description: 'Não há dados de usuários para exportar.' });
        setIsExporting(false);
        return;
      }

      const csvContent = generateUsersExportCsv(users as User[]);
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      FileSaver.saveAs(blob, `usuarios_exportados_${new Date().toISOString().slice(0,10)}.csv`);
      
      toast.dismiss(toastId);
      showSuccess({ title: 'Exportação Concluída', description: `${(users as User[]).length} usuários foram exportados com sucesso.` });
    } catch (err: any) {
      toast.dismiss(toastId);
      showError({ title: 'Erro na Exportação', description: err.message });
    } finally {
      setIsExporting(false);
    }
  };

  return { isExporting, exportUsers };
};
