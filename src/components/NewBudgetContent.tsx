
import React, { useState } from 'react';
import { NewBudgetForm } from './NewBudgetForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Eye, Edit, Copy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export const NewBudgetContent = () => {
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const { data: recentBudgets, isLoading } = useQuery({
    queryKey: ['recent-budgets-for-new', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('budgets')
        .select('id, total_price, device_model, created_at, client_name, status')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching recent budgets:', error);
        return [];
      }
      return data;
    },
    enabled: !!user,
  });

  if (showForm) {
    return <NewBudgetForm onBack={() => setShowForm(false)} />;
  }

  return (
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
      
      <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-4">Orçamentos Recentes</h2>
        <Card className="glass-card border-0 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
          <CardContent className="p-4 lg:p-6 space-y-3">
            {isLoading && (
              <>
                <RecentBudgetSkeleton />
                <RecentBudgetSkeleton />
                <RecentBudgetSkeleton />
              </>
            )}
            {!isLoading && recentBudgets && recentBudgets.length > 0 ? (
              recentBudgets.map((budget: any, index: number) => (
                <div 
                  key={budget.id} 
                  className="flex items-center justify-between p-4 glass-card border border-white/10 rounded-2xl hover:bg-muted/20 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex flex-col space-y-2">
                      <div>
                        <p className="font-semibold text-sm lg:text-base text-foreground group-hover:text-[#fec832] transition-colors truncate">
                          {budget.client_name || 'Cliente não informado'}
                        </p>
                        <p className="text-xs lg:text-sm text-muted-foreground truncate">{budget.device_model}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm lg:text-base text-foreground">
                          R$ {((budget.total_price || 0) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs capitalize ${
                            budget.status === 'approved' 
                              ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400'
                              : budget.status === 'rejected'
                              ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400'
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400'
                          }`}
                        >
                          {budget.status === 'pending' ? 'Pendente' : 
                           budget.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-[#fec832]/10 hover:text-[#fec832]">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-blue-50 hover:text-blue-600">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-purple-50 hover:text-purple-600">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : null}
            {!isLoading && (!recentBudgets || recentBudgets.length === 0) && (
              <p className="text-muted-foreground text-center py-4">Nenhum orçamento recente encontrado.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const RecentBudgetSkeleton = () => (
  <div className="flex items-center justify-between p-4 border border-border/10 rounded-2xl">
    <div className="flex-1 min-w-0 pr-3 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <div className="flex space-x-1 ml-2">
      <Skeleton className="h-9 w-9 rounded-xl" />
      <Skeleton className="h-9 w-9 rounded-xl" />
      <Skeleton className="h-9 w-9 rounded-xl" />
    </div>
  </div>
);
