
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ReportsContent = () => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-2">Análise e métricas do seu negócio</p>
        </div>
      </div>
      
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Relatórios e Análises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Relatórios em desenvolvimento</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
