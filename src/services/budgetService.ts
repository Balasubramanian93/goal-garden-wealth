import { supabase } from '@/integrations/supabase/client';
import { receiptService, type Receipt } from './receiptService';

export type Expense = {
  id: string;
  shop: string;
  amount: number;
  date: string;
  category: string;
  month_year: string;
  created_at: string;
  updated_at: string;
  receipt_id?: string | null;
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

  // Add a new expense with optional receipt processing
  async addExpenseWithReceipt(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>, receiptFile?: File): Promise<{expense: Expense, receipt?: Receipt}> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let receiptId: string | undefined;
    let receipt: Receipt | undefined;

    // If receipt file is provided, upload and process it
    if (receiptFile) {
      try {
        const filePath = await receiptService.uploadReceiptFile(receiptFile);
        receipt = await receiptService.createReceipt({
          file_name: receiptFile.name,
          file_path: filePath,
          total_amount: expense.amount,
          store_name: expense.shop,
          receipt_date: expense.date,
        });
        receiptId = receipt.id;
      } catch (error) {
        console.error('Error processing receipt:', error);
        // Continue without receipt if upload fails
      }
    }

    // Create the expense record
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        ...expense,
        user_id: user.id,
        receipt_id: receiptId,
      })
      .select()
      .single();

    if (error) throw error;

    return { expense: data, receipt };
  },

  // Process detailed receipt with OCR and item categorization
  async processDetailedReceipt(file: File, ocrText: string, expenseData: {
    shop: string;
    amount: number;
    date: string;
    category: string;
    month_year: string;
  }): Promise<{expense: Expense, receipt: Receipt}> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Upload receipt file
    const filePath = await receiptService.uploadReceiptFile(file);

    // Create receipt record
    const receipt = await receiptService.createReceipt({
      file_name: file.name,
      file_path: filePath,
      total_amount: expenseData.amount,
      store_name: expenseData.shop,
      receipt_date: expenseData.date,
    });

    // Parse items from OCR text
    const items = this.parseReceiptItems(ocrText, receipt.id);
    
    if (items.length > 0) {
      // Create receipt items
      await receiptService.createReceiptItems(items);

      // Create category spending records
      const categoryTotals = this.calculateCategoryTotals(items, user.id, expenseData.month_year, receipt.id);
      await receiptService.createCategorySpending(categoryTotals);
    }

    // Create expense record linked to receipt
    const { data: expense, error } = await supabase
      .from('expenses')
      .insert({
        ...expenseData,
        user_id: user.id,
        receipt_id: receipt.id,
      })
      .select()
      .single();

    if (error) throw error;

    return { expense, receipt };
  },

  // Parse items from OCR text
  parseReceiptItems(ocrText: string, receiptId: string) {
    const lines = ocrText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const items: Omit<any, 'id' | 'created_at'>[] = [];

    for (const line of lines) {
      // Look for lines with prices (contains $ and numbers)
      const priceMatch = line.match(/\$?(\d+\.?\d{0,2})/);
      if (priceMatch && !line.toLowerCase().includes('total') && !line.toLowerCase().includes('tax')) {
        const price = parseFloat(priceMatch[1]);
        if (price > 0 && price < 1000) { // Reasonable item price range
          // Extract item name (everything before the price)
          const itemName = line.replace(/\$?\d+\.?\d{0,2}.*$/, '').trim();
          if (itemName.length > 2) {
            const category = receiptService.categorizeItem(itemName);
            items.push({
              receipt_id: receiptId,
              item_name: itemName,
              item_price: price,
              category,
              quantity: 1,
            });
          }
        }
      }
    }

    return items;
  },

  // Calculate category totals from items
  calculateCategoryTotals(items: any[], userId: string, monthYear: string, receiptId: string) {
    const categoryTotals: Record<string, number> = {};
    
    items.forEach(item => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.item_price;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      user_id: userId,
      receipt_id: receiptId,
      expense_id: null,
      category,
      amount,
      month_year: monthYear,
    }));
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

  // Update an expense
  async updateExpense(expenseId: string, updates: Partial<Expense>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', expenseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete an expense
  async deleteExpense(expenseId: string): Promise<void> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId);

    if (error) throw error;
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
