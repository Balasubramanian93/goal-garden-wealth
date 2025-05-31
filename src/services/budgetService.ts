
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
  is_tax_deductible?: boolean;
  tax_category?: string | null;
  business_purpose?: string | null;
  subcategory?: string | null;
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
    
    console.log('Processing detailed receipt, items parsed:', items.length);
    console.log('Parsed items:', items);

    if (items.length > 0) {
      // Create receipt items
      const createdItems = await receiptService.createReceiptItems(items);
      console.log('Created receipt items:', createdItems);

      // Create category spending records
      const categoryTotals = this.calculateCategoryTotals(items, user.id, expenseData.month_year, receipt.id);
      console.log('Category totals calculated:', categoryTotals);
      
      if (categoryTotals.length > 0) {
        const createdCategorySpending = await receiptService.createCategorySpending(categoryTotals);
        console.log('Created category spending records:', createdCategorySpending);
      }
    } else {
      console.log('No items parsed from OCR, creating basic category spending record');
      // If no items were parsed, create a basic category spending record for the total amount
      const basicCategorySpending = [{
        user_id: user.id,
        receipt_id: receipt.id,
        expense_id: null,
        category: expenseData.category,
        amount: expenseData.amount,
        month_year: expenseData.month_year,
      }];
      await receiptService.createCategorySpending(basicCategorySpending);
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

  // Enhanced OCR text cleaning and parsing
  cleanOcrText(text: string): string {
    return text
      .replace(/[^\w\s$.,()-]/g, ' ') // Remove special characters except basic ones
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/(\d)\s+\.(\d)/g, '$1.$2') // Fix split decimals like "5 .99" -> "5.99"
      .replace(/\$\s+(\d)/g, '$$$1') // Fix split prices like "$ 5.99" -> "$5.99"
      .replace(/(\d)\s*\$(\d)/g, '$1 $$$2') // Fix merged prices like "5$10" -> "5 $10"
      .trim();
  },

  // Enhanced receipt parsing with better validation
  parseReceiptItems(ocrText: string, receiptId: string) {
    const cleanedText = this.cleanOcrText(ocrText);
    const lines = cleanedText.split('\n').map(line => line.trim()).filter(line => line.length > 2);
    const items: Omit<any, 'id' | 'created_at'>[] = [];

    console.log('Parsing OCR text lines:', lines);

    for (const line of lines) {
      // Skip lines that are clearly not items
      if (this.shouldSkipLine(line)) {
        continue;
      }

      // Enhanced price matching - look for various price formats
      const pricePatterns = [
        /\$(\d{1,3}(?:,\d{3})*\.?\d{0,2})/g,  // $5.99, $1,234.56
        /(\d{1,3}(?:,\d{3})*\.\d{2})\s*$/g,   // 5.99 at end of line
        /(\d{1,3}(?:,\d{3})*\.\d{2})/g,       // 5.99 anywhere
      ];
      
      let priceMatch = null;
      let priceValue = 0;
      
      for (const pattern of pricePatterns) {
        const matches = Array.from(line.matchAll(pattern));
        if (matches.length > 0) {
          // Take the last match (usually the item price)
          const lastMatch = matches[matches.length - 1];
          const extractedPrice = lastMatch[1] || lastMatch[0];
          priceValue = parseFloat(extractedPrice.replace(/[\$,\s]/g, ''));
          
          if (priceValue > 0.01 && priceValue < 500) {
            priceMatch = lastMatch;
            break;
          }
        }
      }
      
      if (priceMatch && priceValue > 0) {
        // Extract item name (everything before the price)
        const priceText = priceMatch[0];
        const priceIndex = line.lastIndexOf(priceText);
        const itemNamePart = line.substring(0, priceIndex).trim();
        const cleanedItemName = this.cleanItemName(itemNamePart);
        
        if (cleanedItemName.length >= 2) {
          // Determine quantity if present
          const quantityMatch = cleanedItemName.match(/^(\d+)\s*x?\s*/i);
          const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
          const finalItemName = quantityMatch ? 
            cleanedItemName.replace(quantityMatch[0], '').trim() : cleanedItemName;

          if (finalItemName.length >= 2) {
            const category = receiptService.categorizeItem(finalItemName);
            items.push({
              receipt_id: receiptId,
              item_name: finalItemName.substring(0, 100), // Limit length
              item_price: priceValue,
              category,
              quantity: Math.min(quantity, 50), // Reasonable max quantity
            });
            
            console.log(`Parsed item: ${finalItemName} - $${priceValue} (${category})`);
          }
        }
      }
    }

    console.log('Final parsed items:', items);
    return items;
  },

  // Helper to determine if a line should be skipped
  shouldSkipLine(line: string): boolean {
    const skipPatterns = [
      /^(total|subtotal|tax|discount|change|cash|credit|debit|payment)/i,
      /^(thank you|receipt|store|address|phone|hours)/i,
      /^(date|time|cashier|register|transaction|order)/i,
      /^\d{2}[\/\-]\d{2}[\/\-]\d{2,4}/, // Date patterns
      /^\d{1,2}:\d{2}/, // Time patterns
      /^[\*\-=]{3,}/, // Separator lines
      /^[a-z]{1,2}$/i, // Single letters
      /^\d+$/, // Just numbers
      /^[\s\*\-=]+$/, // Just whitespace and separators
    ];

    return skipPatterns.some(pattern => pattern.test(line.trim()));
  },

  // Clean and validate item names
  cleanItemName(name: string): string {
    return name
      .replace(/^\d+\s*x?\s*/i, '') // Remove quantity prefix
      .replace(/[^\w\s&'-]/g, ' ') // Keep only letters, numbers, spaces, and common punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase()); // Title case
  },

  // Calculate category totals from items
  calculateCategoryTotals(items: any[], userId: string, monthYear: string, receiptId: string) {
    const categoryTotals: Record<string, number> = {};
    
    items.forEach(item => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + (item.item_price * item.quantity);
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

  // Enhanced delete expense with proper cascade deletion
  async deleteExpense(expenseId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First, get the expense to check if it has a receipt
    const { data: expense, error: fetchError } = await supabase
      .from('expenses')
      .select('receipt_id')
      .eq('id', expenseId)
      .eq('user_id', user.id) // Ensure user owns the expense
      .single();

    if (fetchError) throw fetchError;

    // If there's a receipt associated, delete all related data
    if (expense.receipt_id) {
      console.log('Deleting receipt and associated data for receipt:', expense.receipt_id);

      // Delete category spending records associated with this receipt
      const { error: categoryError } = await supabase
        .from('category_spending')
        .delete()
        .eq('receipt_id', expense.receipt_id)
        .eq('user_id', user.id);

      if (categoryError) {
        console.error('Error deleting category spending:', categoryError);
      }

      // Delete receipt items
      const { error: itemsError } = await supabase
        .from('receipt_items')
        .delete()
        .eq('receipt_id', expense.receipt_id);

      if (itemsError) {
        console.error('Error deleting receipt items:', itemsError);
      }

      // Get receipt file path for storage deletion
      const { data: receipt } = await supabase
        .from('receipts')
        .select('file_path')
        .eq('id', expense.receipt_id)
        .eq('user_id', user.id)
        .single();

      // Delete file from storage if it exists
      if (receipt?.file_path) {
        const { error: storageError } = await supabase.storage
          .from('receipts')
          .remove([receipt.file_path]);

        if (storageError) {
          console.error('Error deleting receipt file from storage:', storageError);
        }
      }

      // Delete the receipt record
      const { error: receiptError } = await supabase
        .from('receipts')
        .delete()
        .eq('id', expense.receipt_id)
        .eq('user_id', user.id);

      if (receiptError) {
        console.error('Error deleting receipt:', receiptError);
      }
    }

    // Delete any category spending records associated with this expense (non-receipt expenses)
    const { error: expenseCategoryError } = await supabase
      .from('category_spending')
      .delete()
      .eq('expense_id', expenseId)
      .eq('user_id', user.id);

    if (expenseCategoryError) {
      console.error('Error deleting expense category spending:', expenseCategoryError);
    }

    // Finally, delete the expense
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', user.id);

    if (error) throw error;

    console.log('Successfully deleted expense and all associated data');
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

  async getCurrentBudgetPeriod(monthYear: string, periodName: string): Promise<BudgetPeriod> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

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

    const { data, error } = await supabase
      .from('budget_periods')
      .insert({
        user_id: user.id,
        period: monthYear,
        period_name: periodName,
        total_income: 3500,
        total_expenses: 0,
        remaining_budget: 3500,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBudgetPeriodTotals(periodId: string): Promise<void> {
    const { error } = await supabase.rpc('update_budget_period_totals', {
      period_id: periodId
    });

    if (error) throw error;
  },

  async updateBudgetIncome(periodId: string, income: number): Promise<void> {
    const { error } = await supabase
      .from('budget_periods')
      .update({ total_income: income })
      .eq('id', periodId);

    if (error) throw error;
  }
};
