
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, MessageCircle, Search, Filter, Download } from 'lucide-react';
import { generateWhatsAppMessage, shareViaWhatsApp } from '@/utils/whatsappUtils';
import { useToast } from '@/hooks/use-toast';
import { EditBudgetModal } from '@/components/EditBudgetModal';
import { DeleteBudgetConfirm } from '@/components/DeleteBudgetConfirm';
import { BudgetsSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/input';

export const BudgetsContent = () => {
  const { toast } = useToast();
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [deletingBudget, setDeletingBudget] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: budgets, isLoading, error, refetch } = useQuery({
    queryKey: ['budgets', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`client_name.ilike.%${searchTerm}%,device_model.ilike.%${searchTerm}%,issue.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleShareWhatsApp = (budget: any) => {
    try {
      const message = generateWhatsAppMessage(budget);
      shareViaWhatsApp(message);
      toast({
        title: "Compartilhando via WhatsApp",
        description: "O orçamento será compartilhado via WhatsApp.",
      });
    } catch (error) {
      toast({
        title: "Erro ao compartilhar",
        description: "Ocorreu um erro ao preparar o compartilhamento.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <BudgetsSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <EmptyState
          icon={MessageCircle}
          title="Erro ao carregar orçamentos"
          description="Não foi possível carregar os orçamentos. Verifique sua conexão e tente novamente."
          action={{
            label: "Tentar Novamente",
            onClick: () => refetch()
          }}
        />
      </div>
    );
  }

  const filteredBudgets = budgets || [];

  return (
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Orçamentos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os seus orçamentos ({filteredBudgets.length})
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="glass-card border-0">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente, dispositivo ou problema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card border-0 shadow-sm animate-scale-in">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lista de Orçamentos</span>
            {filteredBudgets.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filteredBudgets.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBudgets.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="font-semibold">Dispositivo</TableHead>
                    <TableHead className="font-semibold">Problema</TableHead>
                    <TableHead className="font-semibold">Valor</TableHead>
                    <TableHead className="font-semibold">Data</TableHead>
                    <TableHead className="font-semibold text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBudgets.map((budget, index) => (
                    <TableRow 
                      key={budget.id} 
                      className="hover:bg-muted/30 transition-colors border-border/30 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{budget.device_model}</p>
                          <p className="text-sm text-muted-foreground">{budget.device_type}</p>
                          {budget.client_name && (
                            <p className="text-xs text-muted-foreground">
                              {budget.client_name}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{budget.issue}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground">
                            R$ {((budget.total_price || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          {budget.installments > 1 && (
                            <p className="text-xs text-muted-foreground">
                              {budget.installments}x
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(budget.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleShareWhatsApp(budget)}
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Compartilhar no WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditingBudget(budget)}
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setDeletingBudget(budget)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={MessageCircle}
              title={searchTerm ? "Nenhum resultado encontrado" : "Nenhum orçamento encontrado"}
              description={
                searchTerm 
                  ? `Não encontramos orçamentos com "${searchTerm}". Tente uma busca diferente.`
                  : "Você ainda não criou nenhum orçamento. Comece criando seu primeiro orçamento para começar a gerenciar suas vendas."
              }
              action={
                searchTerm 
                  ? {
                      label: "Limpar busca",
                      onClick: () => setSearchTerm('')
                    }
                  : {
                      label: "Criar Primeiro Orçamento",
                      onClick: () => {
                        // This would be handled by parent component
                        console.log('Navigate to new budget');
                      }
                    }
              }
              className="border-0 shadow-none"
            />
          )}
        </CardContent>
      </Card>

      <EditBudgetModal
        budget={editingBudget}
        open={!!editingBudget}
        onOpenChange={(open) => !open && setEditingBudget(null)}
      />

      <DeleteBudgetConfirm
        budget={deletingBudget}
        open={!!deletingBudget}
        onOpenChange={(open) => !open && setDeletingBudget(null)}
      />
    </div>
  );
};
