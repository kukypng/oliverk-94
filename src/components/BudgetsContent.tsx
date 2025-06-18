
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle } from '@/components/ui/icons';
import { EmptyState } from '@/components/EmptyState';
import { useAuth } from '@/hooks/useAuth';
import { EditBudgetModal } from '@/components/EditBudgetModal';
import { ConfirmationDialog } from './ConfirmationDialog';
import { DeleteBudgetDialog } from './budgets/DeleteBudgetDialog';
import { BudgetSearchBar } from './budgets/BudgetSearchBar';

// Import new hooks and components
import { useBudgetSearch } from './budgets/hooks/useBudgetSearch';
import { useBudgetSelection } from './budgets/hooks/useBudgetSelection';
import { useBudgetActions } from './budgets/hooks/useBudgetActions';
import { useBudgetAnimations } from './budgets/hooks/useBudgetAnimations';
import { BudgetsHeader } from './budgets/components/BudgetsHeader';
import { BudgetsList } from './budgets/components/BudgetsList';
import { BudgetsEmptyState } from './budgets/components/BudgetsEmptyState';
import { BudgetsLoadingState } from './budgets/components/BudgetsLoadingState';

export const BudgetsContent = () => {
  const { user, profile } = useAuth();

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
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in pb-24 lg:pb-0">
      {/* Header */}
      <BudgetsHeader
        totalBudgets={budgets.length}
        selectedCount={selectionStats.selectedCount}
        hasSelection={selectionStats.hasSelection}
        selectedBudgets={selectedBudgets}
        budgets={filteredBudgets}
        onDeleteComplete={handleDeleteComplete}
      />

      {/* Search Bar */}
      <div className="animate-slide-down">
        <BudgetSearchBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
          onKeyPress={handleKeyPress}
        />
      </div>
      
      {/* Content */}
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
