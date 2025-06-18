
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, FileText, Users, TrendingUp } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { EditBudgetModal } from '@/components/EditBudgetModal';
import { ConfirmationDialog } from './ConfirmationDialog';
import { DeleteBudgetDialog } from './budgets/DeleteBudgetDialog';
import { BudgetSearchBar } from './budgets/BudgetSearchBar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import new hooks and components
import { useBudgetSearch } from './budgets/hooks/useBudgetSearch';
import { useBudgetSelection } from './budgets/hooks/useBudgetSelection';
import { useBudgetActions } from './budgets/hooks/useBudgetActions';
import { useBudgetAnimations } from './budgets/hooks/useBudgetAnimations';
import { BudgetsHeader } from './budgets/components/BudgetsHeader';
import { BudgetsList } from './budgets/components/BudgetsList';
import { BudgetsEmptyState } from './budgets/components/BudgetsEmptyState';
import { BudgetsLoadingState } from './budgets/components/BudgetsLoadingState';
import { BudgetsStats } from './budgets/components/BudgetsStats';
import { BudgetsClients } from './budgets/components/BudgetsClients';

export const BudgetsContent = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('budgets');

  // Data fetching
  const { data: budgets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['budgets', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching budgets for user:', user.id);
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      
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

  // Custom hooks
  const {
    searchTerm,
    setSearchTerm,
    filteredBudgets,
    handleSearch,
    handleKeyPress,
    clearSearch,
    hasActiveSearch
  } = useBudgetSearch(budgets);

  const {
    selectedBudgets,
    handleBudgetSelect,
    handleSelectAll,
    clearSelection,
    selectionStats
  } = useBudgetSelection(filteredBudgets);

  const {
    editingBudget,
    deletingBudget,
    confirmation,
    isGenerating,
    handleShareWhatsApp,
    handleViewPDF,
    handleEdit,
    handleDelete,
    closeEdit,
    closeDelete,
    closeConfirmation,
    confirmAction
  } = useBudgetActions();

  const animations = useBudgetAnimations(filteredBudgets);

  // Handle delete completion
  const handleDeleteComplete = () => {
    clearSelection();
    refetch();
  };

  // Early returns for different states
  if (!user) {
    return (
      <div className="p-4 lg:p-8 animate-fade-in">
        <EmptyState 
          icon={MessageCircle} 
          title="Faça login para continuar" 
          description="Você precisa estar logado para ver seus orçamentos." 
        />
      </div>
    );
  }

  if (isLoading) {
    return <BudgetsLoadingState />;
  }

  if (error) {
    console.error('Budget loading error:', error);
    return (
      <div className="p-4 lg:p-8 animate-fade-in">
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

  return (
    <div className="p-3 lg:p-8 space-y-4 lg:space-y-8 animate-fade-in pb-24 lg:pb-0">
      {/* Header with Tabs */}
      <div className="space-y-4">
        <BudgetsHeader
          totalBudgets={budgets.length}
          selectedCount={selectionStats.selectedCount}
          hasSelection={selectionStats.hasSelection}
          selectedBudgets={selectedBudgets}
          budgets={filteredBudgets}
          onDeleteComplete={handleDeleteComplete}
        />

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4 bg-card/50 backdrop-blur-sm border border-primary/10 p-1 rounded-xl">
            <TabsTrigger 
              value="budgets" 
              className="flex items-center gap-2 text-xs lg:text-sm font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileText className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Orçamentos</span>
              <span className="sm:hidden">Lista</span>
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="flex items-center gap-2 text-xs lg:text-sm font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Estatísticas</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger 
              value="clients" 
              className="flex items-center gap-2 text-xs lg:text-sm font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="h-3 w-3 lg:h-4 lg:w-4" />
              <span>Clientes</span>
            </TabsTrigger>
          </TabsList>

          {/* Search Bar - Only show in budgets tab */}
          {activeTab === 'budgets' && (
            <div className="animate-slide-down mt-4">
              <BudgetSearchBar
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                onSearch={handleSearch}
                onKeyPress={handleKeyPress}
              />
            </div>
          )}

          {/* Tab Contents */}
          <TabsContent value="budgets" className="space-y-4 mt-4">
            {filteredBudgets.length > 0 ? (
              <BudgetsList
                budgets={filteredBudgets}
                profile={profile}
                isGenerating={isGenerating}
                selectedBudgets={selectedBudgets}
                isAllSelected={selectionStats.isAllSelected}
                onSelect={handleBudgetSelect}
                onSelectAll={handleSelectAll}
                onShareWhatsApp={handleShareWhatsApp}
                onViewPDF={handleViewPDF}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="animate-bounce-in">
                <BudgetsEmptyState
                  hasActiveSearch={hasActiveSearch}
                  searchTerm={searchTerm}
                  onClearSearch={clearSearch}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <BudgetsStats budgets={budgets} />
          </TabsContent>

          <TabsContent value="clients" className="mt-4">
            <BudgetsClients budgets={budgets} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <EditBudgetModal 
        budget={editingBudget} 
        open={!!editingBudget} 
        onOpenChange={(open) => !open && closeEdit()} 
      />

      <DeleteBudgetDialog
        budget={deletingBudget}
        open={!!deletingBudget}
        onOpenChange={(open) => !open && closeDelete()}
      />

      <ConfirmationDialog 
        open={!!confirmation} 
        onOpenChange={closeConfirmation} 
        onConfirm={confirmAction} 
        title={confirmation?.title || ''} 
        description={confirmation?.description || ''} 
      />
    </div>
  );
};
