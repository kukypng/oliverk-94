import React, { useState } from 'react';
import { NewBudgetForm } from './NewBudgetForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Eye, Edit, Copy, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EditBudgetModal } from '@/components/EditBudgetModal';
import { useEnhancedToast } from '@/hooks/useEnhancedToast';
import { usePdfGeneration } from '@/hooks/usePdfGeneration';
import { ConfirmationDialog } from './ConfirmationDialog';
import { generateWhatsAppMessage, shareViaWhatsApp } from '@/utils/whatsappUtils';

export const NewBudgetContent = () => {
  const [showForm, setShowForm] = useState(false);
  const [copiedBudgetData, setCopiedBudgetData] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any | null>(null);
  const [confirmation, setConfirmation] = useState<{
    action: () => void;
    title: string;
    description: string;
  } | null>(null);
  const {
    user
  } = useAuth();
  const {
    showSuccess,
    showError
  } = useEnhancedToast();
  const {
    generateAndSharePDF,
    isGenerating
  } = usePdfGeneration();
  const {
    data: recentBudgets,
    isLoading
  } = useQuery({
    queryKey: ['recent-budgets-for-new', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const {
        data,
        error
      } = await supabase.from('budgets').select('*').eq('owner_id', user.id).order('created_at', {
        ascending: false
      }).limit(3);
      if (error) {
        console.error('Error fetching recent budgets:', error);
        return [];
      }
      return data;
    },
    enabled: !!user
  });
  const handleEdit = (budget: any) => {
    setSelectedBudget(budget);
    setIsEditModalOpen(true);
  };
  const handleCopy = (budget: any) => {
    const budgetToCopy = {
      ...budget
    };
    delete budgetToCopy.client_name;
    delete budgetToCopy.client_phone;
    delete budgetToCopy.status;
    delete budgetToCopy.id;
    delete budgetToCopy.created_at;
    delete budgetToCopy.updated_at;
    delete budgetToCopy.search_vector;
    setCopiedBudgetData(budgetToCopy);
    setShowForm(true);
  };
  const handleViewPdf = (budget: any) => {
    if (!budget.id) return;
    setConfirmation({
      action: async () => {
        await generateAndSharePDF(budget);
      },
      title: "Gerar e compartilhar PDF?",
      description: "Um PDF do orçamento será gerado e a opção de compartilhamento será exibida."
    });
  };

  const handleShareWhatsApp = (budget: any) => {
    setConfirmation({
      action: () => {
        try {
          const message = generateWhatsAppMessage(budget);
          shareViaWhatsApp(message);
          showSuccess({
            title: "Redirecionando...",
            description: "Você será redirecionado para o WhatsApp."
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

  const handleFormBack = () => {
    setShowForm(false);
    setCopiedBudgetData(null);
  };
  if (showForm) {
    return <NewBudgetForm onBack={handleFormBack} initialData={copiedBudgetData} />;
  }
  return <>
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Novo Orçamento</h1>
            <p className="text-muted-foreground mt-1">Crie um novo orçamento ou veja os mais recentes.</p>
          </div>
        </div>

        <Card className="glass-card animate-slide-up card-hover">
          <CardHeader>
            <CardTitle className="text-xl">Comece um Novo Orçamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Pronto para começar?</h3>
              <p className="text-muted-foreground mb-6">
                Crie um orçamento detalhado para seu cliente em poucos minutos.
              </p>
              <Button onClick={() => setShowForm(true)} size="lg" className="btn-apple mobile-touch animate-bounce-subtle">
                <Plus className="mr-2 h-5 w-5" />
                Criar Orçamento
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="animate-slide-up" style={{
        animationDelay: '200ms'
      }}>
          <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-4">Orçamentos Recentes</h2>
          <Card className="glass-card border-0">
            <CardContent className="p-4 lg:p-6 space-y-3">
              {isLoading && <>
                  <RecentBudgetSkeleton />
                  <RecentBudgetSkeleton />
                  <RecentBudgetSkeleton />
                </>}
              {!isLoading && recentBudgets && recentBudgets.length > 0 ? recentBudgets.map((budget: any, index: number) => <div key={budget.id} className="flex items-center justify-between p-4 glass-card border border-white/10 rounded-2xl hover:bg-muted/20 transition-all duration-300 group" style={{
              animationDelay: `${index * 50}ms`
            }}>
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex flex-col space-y-2">
                        <div>
                          <p className="font-semibold text-sm lg:text-base text-foreground group-hover:text-orange-600 transition-colors truncate">
                            {budget.device_model || 'Modelo não informado'}
                          </p>
                          <p className="text-xs lg:text-sm text-muted-foreground truncate">{new Date(budget.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-sm lg:text-base text-foreground">
                            R$ {((budget.total_price || 0) / 100).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                      })}
                          </p>
                          
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl text-green-600 hover:text-green-700 hover:bg-green-500/10" onClick={() => handleShareWhatsApp(budget)}>
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-orange-50 hover:text-orange-600" onClick={() => handleViewPdf(budget)} disabled={isGenerating}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-blue-500/10 hover:text-blue-600" onClick={() => handleEdit(budget)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                    </div>
                  </div>) : null}
              {!isLoading && (!recentBudgets || recentBudgets.length === 0) && <p className="text-muted-foreground text-center py-4">Nenhum orçamento recente encontrado.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
      {selectedBudget && <EditBudgetModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} budget={selectedBudget} />}
      <ConfirmationDialog
        open={!!confirmation}
        onOpenChange={() => setConfirmation(null)}
        onConfirm={() => {
          if (confirmation) {
            confirmation.action();
            setConfirmation(null);
          }
        }}
        title={confirmation?.title || ''}
        description={confirmation?.description || ''}
      />
    </>;
};
const RecentBudgetSkeleton = () => <div className="flex items-center justify-between p-4 border border-border/10 rounded-2xl">
    <div className="flex-1 min-w-0 pr-3 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <div className="flex space-x-1 ml-2">
      <Skeleton className="h-9 w-9 rounded-xl" />
      <Skeleton className="h-9 w-9 rounded-xl" />
      <Skeleton className="h-9 w-9 rounded-xl" />
    </div>
  </div>;
