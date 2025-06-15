import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, MessageCircle, Search, Filter, Download, Star, Clock } from 'lucide-react';
import { generateWhatsAppMessage, shareViaWhatsApp } from '@/utils/whatsappUtils';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { EditBudgetModal } from '@/components/EditBudgetModal';
import { DeleteBudgetConfirm } from '@/components/DeleteBudgetConfirm';
import { BudgetsSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { usePdfGeneration } from '@/hooks/usePdfGeneration';
import { ConfirmationDialog } from './ConfirmationDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const isBudgetOld = (createdAt: string, warningDays: number | undefined | null): boolean => {
    if (!createdAt || !warningDays) return false;
    const now = new Date();
    const budgetDate = new Date(createdAt);
    const diffTime = now.getTime() - budgetDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > warningDays;
};

export const BudgetsContent = () => {
  const {
    showSuccess,
    showError
  } = useEnhancedToast();
  const {
    user,
    profile
  } = useAuth();
  const {
    generateAndSharePDF,
    isGenerating
  } = usePdfGeneration();
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [deletingBudget, setDeletingBudget] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actualSearchTerm, setActualSearchTerm] = useState('');
  const [confirmation, setConfirmation] = useState<{
    action: () => void;
    title: string;
    description: string;
  } | null>(null);
  const {
    data: budgets,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['budgets', actualSearchTerm, user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('No user found, returning empty array');
        return [];
      }
      console.log('Fetching budgets for user:', user.id);
      let query = supabase.from('budgets').select('*').eq('owner_id', user.id).order('created_at', {
        ascending: false
      });
      if (actualSearchTerm) {
        query = query.or(`client_name.ilike.%${actualSearchTerm}%,device_model.ilike.%${actualSearchTerm}%,issue.ilike.%${actualSearchTerm}%`);
      }
      const {
        data,
        error
      } = await query;
      if (error) {
        console.error('Error fetching budgets:', error);
        throw error;
      }
      console.log('Fetched budgets:', data?.length || 0);
      return data || [];
    },
    enabled: !!user,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
  const handleSearch = () => {
    setActualSearchTerm(searchTerm);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const handleShareWhatsApp = (budget: any) => {
    setConfirmation({
      action: () => {
        try {
          const message = generateWhatsAppMessage(budget);
          shareViaWhatsApp(message);
          showSuccess({
            title: "Redirecionando...",
            description: "Você será redirecionado para o WhatsApp para compartilhar o orçamento."
          });
        } catch (error) {
          showError({
            title: "Erro ao compartilhar",
            description: "Ocorreu um erro ao preparar o compartilhamento."
          });
        }
      },
      title: "Compartilhar via WhatsApp?",
      description: "Você será redirecionado para o WhatsApp para enviar os detalhes do orçamento."
    });
  };
  const handleViewPDF = (budget: any) => {
    setConfirmation({
      action: async () => {
        try {
          await generateAndSharePDF(budget);
        } catch (error) {
          console.error('Erro ao gerar PDF:', error);
        }
      },
      title: "Gerar e compartilhar PDF?",
      description: "Um PDF do orçamento será gerado e a opção de compartilhamento será exibida."
    });
  };
  if (!user) {
    return <div className="p-4 lg:p-8">
        <EmptyState icon={MessageCircle} title="Faça login para continuar" description="Você precisa estar logado para ver seus orçamentos." />
      </div>;
  }
  if (isLoading) {
    return <BudgetsSkeleton />;
  }
  if (error) {
    console.error('Budget loading error:', error);
    return <div className="p-4 lg:p-8">
        <EmptyState icon={MessageCircle} title="Erro ao carregar orçamentos" description="Não foi possível carregar os orçamentos. Verifique sua conexão e tente novamente." action={{
        label: "Tentar Novamente",
        onClick: () => refetch()
      }} />
      </div>;
  }
  const filteredBudgets = budgets || [];
  return <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in pb-24 lg:pb-0">
      {/* Header - Premium Design */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="animate-slide-up">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Meus Orçamentos</h1>
          <div className="flex items-center space-x-2 mt-2">
            <p className="text-sm lg:text-base text-muted-foreground">
              Gerencie todos os seus orçamentos
            </p>
            <Badge variant="secondary" className="bg-[#fec832]/10 text-[#fec832] border-[#fec832]/20">
              {filteredBudgets.length}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 lg:space-x-3">
          
          
        </div>
      </div>

      {/* Search Bar - Premium Design */}
      <Card className="glass-card border-0 bg-white/50 dark:bg-black/50 backdrop-blur-xl animate-scale-in">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Buscar por cliente, dispositivo ou problema..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyPress={handleKeyPress} className="pl-12 h-12 rounded-2xl border-white/20 bg-white/50 dark:bg-black/50 text-base lg:text-sm focus:ring-[#fec832] focus:border-[#fec832]" />
            </div>
            <Button onClick={handleSearch} size="sm" className="h-12 px-6 bg-[#fec832] hover:bg-[#fec832]/90 text-black rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Search className="h-5 w-5 lg:mr-2" />
              <span className="hidden lg:inline">Buscar</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Budgets List - Mobile Optimized */}
      <Card className="glass-card border-0 shadow-lg animate-slide-up bg-white/50 dark:bg-black/50 backdrop-blur-xl">
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="flex items-center justify-between text-lg lg:text-xl">
            <span>Lista de Orçamentos</span>
            {filteredBudgets.length > 0 && <Badge variant="secondary" className="bg-[#fec832]/10 text-[#fec832] border-[#fec832]/20">
                {filteredBudgets.length}
              </Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 lg:p-6 lg:pt-0">
          {filteredBudgets.length > 0 ? <div className="space-y-3 lg:space-y-0 p-4 lg:p-0">
              {/* Mobile Cards View */}
              <div className="block lg:hidden space-y-4">
                {filteredBudgets.map((budget, index) => <div key={budget.id} className="glass-card border border-white/10 rounded-2xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] animate-fade-in" style={{
              animationDelay: `${index * 50}ms`
            }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-base text-foreground">{budget.device_model}</h3>
                          <Badge variant="secondary" className="text-xs bg-muted/50">
                            {budget.device_type}
                          </Badge>
                        </div>
                        {budget.client_name && <p className="text-sm text-muted-foreground mb-1">{budget.client_name}</p>}
                        <p className="text-sm text-muted-foreground">{budget.issue}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-foreground">
                          R$ {((budget.total_price || 0) / 100).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2
                    })}
                        </p>
                        <div className="flex items-center">
                          <p className="text-xs text-muted-foreground">
                            {new Date(budget.created_at).toLocaleDateString('pt-BR')}
                          </p>
                          {profile?.budget_warning_enabled && isBudgetOld(budget.created_at, profile.budget_warning_days) && (
                            <Badge variant="destructive" className="text-xs ml-2 animate-pulse p-1 h-auto">
                              <Clock className="h-3 w-3 mr-1" />
                              Antigo
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleShareWhatsApp(budget)} className="h-10 w-10 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950 rounded-xl">
                          <MessageCircle className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleViewPDF(budget)} disabled={isGenerating} className="h-10 w-10 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl">
                          <Eye className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingBudget(budget)} className="h-10 w-10 p-0 hover:bg-muted/20 hover:text-[#fec832] rounded-xl">
                          <Edit className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeletingBudget(budget)} className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                      
                    </div>
                  </div>)}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-white/10">
                      <TableHead className="font-semibold">Dispositivo</TableHead>
                      <TableHead className="font-semibold">Problema</TableHead>
                      <TableHead className="font-semibold">Valor</TableHead>
                      <TableHead className="font-semibold">Data</TableHead>
                      <TableHead className="font-semibold text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBudgets.map((budget, index) => <TableRow key={budget.id} className="hover:bg-muted/20 transition-colors border-white/10 animate-fade-in" style={{
                  animationDelay: `${index * 50}ms`
                }}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">{budget.device_model}</p>
                            <p className="text-sm text-muted-foreground">{budget.device_type}</p>
                            {budget.client_name && <p className="text-sm text-muted-foreground">
                                {budget.client_name}
                              </p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{budget.issue}</span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground">
                              R$ {((budget.total_price || 0) / 100).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2
                        })}
                            </p>
                            {budget.installments > 1 && <p className="text-xs text-muted-foreground">
                                {budget.installments}x
                              </p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(budget.created_at).toLocaleDateString('pt-BR')}
                            </span>
                            {profile?.budget_warning_enabled && isBudgetOld(budget.created_at, profile.budget_warning_days) && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Clock className="h-4 w-4 text-destructive animate-pulse" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Este orçamento tem mais de {profile.budget_warning_days} dias.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => handleShareWhatsApp(budget)} className="h-9 w-9 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950 rounded-xl">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleViewPDF(budget)} disabled={isGenerating} className="h-9 w-9 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setEditingBudget(budget)} className="h-9 w-9 p-0 hover:bg-muted/20 hover:text-[#fec832] rounded-xl">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeletingBudget(budget)} className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
              </div>
            </div> : <div className="p-6">
              <EmptyState icon={MessageCircle} title={actualSearchTerm ? "Nenhum resultado encontrado" : "Nenhum orçamento encontrado"} description={actualSearchTerm ? `Não encontramos orçamentos com "${actualSearchTerm}". Tente uma busca diferente.` : "Você ainda não criou nenhum orçamento. Comece criando seu primeiro orçamento para começar a gerenciar suas vendas."} action={actualSearchTerm ? {
            label: "Limpar busca",
            onClick: () => {
              setSearchTerm('');
              setActualSearchTerm('');
            }
          } : {
            label: "Criar Primeiro Orçamento",
            onClick: () => {
              console.log('Navigate to new budget');
            }
          }} className="border-0 shadow-none" />
            </div>}
        </CardContent>
      </Card>

      <EditBudgetModal budget={editingBudget} open={!!editingBudget} onOpenChange={open => !open && setEditingBudget(null)} />

      <DeleteBudgetConfirm budget={deletingBudget} open={!!deletingBudget} onOpenChange={open => !open && setDeletingBudget(null)} />

      <ConfirmationDialog open={!!confirmation} onOpenChange={() => setConfirmation(null)} onConfirm={() => {
      if (confirmation) {
        confirmation.action();
        setConfirmation(null);
      }
    }} title={confirmation?.title || ''} description={confirmation?.description || ''} />
    </div>;
};
