
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useCsvData } from '@/hooks/useCsvData';

export const DataManagementSettings = () => {
  const { isProcessing, fetchAndExportBudgets, downloadImportTemplate, processImportedFile } = useCsvData();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !isProcessing) {
      processImportedFile(file);
      event.target.value = ''; // Reseta o input para permitir selecionar o mesmo arquivo novamente
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Gestão de Dados</CardTitle>
        <CardDescription>
          Exporte seus dados de orçamentos ou importe novos dados usando um arquivo CSV.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exportar Dados
            </CardTitle>
            <CardDescription>
              Baixe um arquivo CSV com todos os seus orçamentos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchAndExportBudgets} className="w-full" disabled={isProcessing}>
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="mr-2 h-4 w-4" />
              )}
              {isProcessing ? 'Processando...' : 'Exportar Orçamentos'}
            </Button>
          </CardContent>
        </Card>

        {/* Import Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="h-5 w-5" />
              Importar Dados
            </CardTitle>
            <CardDescription>
              Faça o upload de um arquivo CSV para adicionar novos orçamentos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" asChild disabled={isProcessing}>
              <label htmlFor="import-file" className={isProcessing ? 'cursor-not-allowed' : 'cursor-pointer'}>
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="mr-2 h-4 w-4" />
                )}
                {isProcessing ? 'Processando...' : 'Selecionar Arquivo'}
                <input type="file" id="import-file" className="hidden" accept=".csv" onChange={handleFileSelect} disabled={isProcessing}/>
              </label>
            </Button>
            <Button variant="secondary" onClick={downloadImportTemplate} className="w-full" disabled={isProcessing}>
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isProcessing ? 'Processando...' : 'Baixar Modelo'}
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
