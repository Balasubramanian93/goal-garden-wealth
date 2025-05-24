import { supabase } from '@/integrations/supabase/client';

export type Expense = {
  id: string;
  shop: string;
  amount: number;
  date: string;
  category: string;
  month_year: string;
  created_at: string;
  updated_at: string;
};

export type BudgetPeriod = {
  id: string;
  period: string;
  period_name: string;
  total_income: number;
  total_expenses: number;
  remaining_budget: number;
  created_at: string;
  updated_at: string;
};

export const budgetService = {
  // Get expenses for a specific month
  async getExpenses(monthYear: string): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('month_year', monthYear)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Add a new expense
  async addExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        ...expense,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get budget periods
  async getBudgetPeriods(): Promise<BudgetPeriod[]> {
    const { data, error } = await supabase
      .from('budget_periods')
      .select('*')
      .order('period', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get or create current budget period
  async getCurrentBudgetPeriod(monthYear: string, periodName: string): Promise<BudgetPeriod> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Try to get existing period
    const { data: existing, error: fetchError } = await supabase
      .from('budget_periods')
      .select('*')
      .eq('period', monthYear)
      .eq('user_id', user.id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) {
      return existing;
    }

    // Create new period if it doesn't exist
    const { data, error } = await supabase
      .from('budget_periods')
      .insert({
        user_id: user.id,
        period: monthYear,
        period_name: periodName,
        total_income: 3500, // Default income
        total_expenses: 0,
        remaining_budget: 3500,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update budget period totals
  async updateBudgetPeriodTotals(periodId: string): Promise<void> {
    const { error } = await supabase.rpc('update_budget_period_totals', {
      period_id: periodId
    });

    if (error) throw error;
  },

  // Update budget period income
  async updateBudgetIncome(periodId: string, income: number): Promise<void> {
    const { error } = await supabase
      .from('budget_periods')
      .update({ total_income: income })
      .eq('id', periodId);

    if (error) throw error;
  }
};
