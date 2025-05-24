
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService, type Expense, type BudgetPeriod } from '@/services/budgetService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useBudget = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentMonthYear] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [currentPeriodName] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  // Get current month expenses
  const { data: currentMonthExpenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ['expenses', currentMonthYear],
    queryFn: () => budgetService.getExpenses(currentMonthYear),
    enabled: !!user,
  });

  // Get budget periods (history)
  const { data: budgetHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ['budget-periods'],
    queryFn: () => budgetService.getBudgetPeriods(),
    enabled: !!user,
  });

  // Get current budget period
  const { data: currentBudgetPeriod, isLoading: currentPeriodLoading } = useQuery({
    queryKey: ['current-budget-period', currentMonthYear],
    queryFn: () => budgetService.getCurrentBudgetPeriod(currentMonthYear, currentPeriodName),
    enabled: !!user,
  });

  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: (expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => 
      budgetService.addExpense(expense),
    onSuccess: async () => {
      // Refresh expenses
      queryClient.invalidateQueries({ queryKey: ['expenses', currentMonthYear] });
      
      // Update budget period totals
      if (currentBudgetPeriod) {
        await budgetService.updateBudgetPeriodTotals(currentBudgetPeriod.id);
        queryClient.invalidateQueries({ queryKey: ['current-budget-period', currentMonthYear] });
        queryClient.invalidateQueries({ queryKey: ['budget-periods'] });
      }
      
      toast({
        title: "Expense added",
        description: "Your expense has been successfully logged.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
      console.error('Error adding expense:', error);
    },
  });

  const addExpense = async (expenseData: {
    shop: string;
    amount: number;
    date: string;
    category: string;
  }) => {
    const expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'> = {
      ...expenseData,
      month_year: currentMonthYear,
    };
    
    return addExpenseMutation.mutateAsync(expense);
  };

  return {
    currentMonthExpenses,
    budgetHistory,
    currentBudgetPeriod,
    currentMonthYear,
    currentPeriodName,
    addExpense,
    isLoading: expensesLoading || historyLoading || currentPeriodLoading,
    isAddingExpense: addExpenseMutation.isPending,
  };
};
