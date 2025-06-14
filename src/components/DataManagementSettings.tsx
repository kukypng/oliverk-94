
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Download, FileSpreadsheet } from 'lucide-react';

export const DataManagementSettings = () => {
  const handleExport = () => {
    // Lógica de exportação será implementada aqui
    console.log('Exportando dados...');
  };

  const handleDownloadTemplate = () => {
    // Lógica de download do modelo será implementada aqui
    console.log('Baixando modelo...');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Arquivo selecionado:', file.name);
      // Lógica de processamento do arquivo será implementada aqui
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Gestão de Dados</CardTitle>
        <CardDescription>
          Exporte seus dados de orçamentos ou importe novos dados usando uma planilha.
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
              Baixe uma planilha com todos os seus orçamentos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExport} className="w-full">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exportar Orçamentos
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
              Faça o upload de uma planilha para adicionar novos orçamentos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" asChild>
              <label htmlFor="import-file" className="cursor-pointer">
                <UploadCloud className="mr-2 h-4 w-4" />
                Selecionar Arquivo
                <input type="file" id="import-file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileSelect} />
              </label>
            </Button>
            <Button variant="secondary" onClick={handleDownloadTemplate} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Baixar Modelo
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
