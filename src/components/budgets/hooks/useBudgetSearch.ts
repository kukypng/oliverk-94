
import { useState, useMemo, useCallback } from 'react';

export const useBudgetSearch = (budgets: any[] = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actualSearchTerm, setActualSearchTerm] = useState('');

  const filteredBudgets = useMemo(() => {
    if (!actualSearchTerm.trim()) return budgets;
    
    const term = actualSearchTerm.toLowerCase();
    return budgets.filter(budget => 
      budget?.client_name?.toLowerCase().includes(term) ||
      budget?.device_model?.toLowerCase().includes(term) ||
      budget?.issue?.toLowerCase().includes(term)
    );
  }, [budgets, actualSearchTerm]);

  const handleSearch = useCallback(() => {
    setActualSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setActualSearchTerm('');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    actualSearchTerm,
    filteredBudgets,
    handleSearch,
    handleKeyPress,
    clearSearch,
    hasActiveSearch: !!actualSearchTerm.trim()
  };
};
