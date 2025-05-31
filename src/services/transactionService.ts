
import { supabase } from '@/integrations/supabase/client';

export interface TransactionTag {
  id: string;
  user_id: string;
  expense_id: string;
  tag_name: string;
  tag_type: string;
  created_at: string;
  updated_at: string;
}

export interface TaxDocument {
  id: string;
  user_id: string;
  expense_id?: string;
  document_name: string;
  document_type: string;
  tax_year: number;
  file_path?: string;
  file_size?: number;
  upload_date: string;
  created_at: string;
}

export const transactionService = {
  // Transaction Tags
  async getTransactionTags(expenseId: string): Promise<TransactionTag[]> {
    const { data, error } = await supabase
      .from('transaction_tags')
      .select('*')
      .eq('expense_id', expenseId);

    if (error) throw error;
    return data || [];
  },

  async addTransactionTag(expenseId: string, tagName: string, tagType: string = 'custom'): Promise<TransactionTag> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('transaction_tags')
      .insert({
        user_id: user.id,
        expense_id: expenseId,
        tag_name: tagName,
        tag_type: tagType
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeTransactionTag(tagId: string): Promise<void> {
    const { error } = await supabase
      .from('transaction_tags')
      .delete()
      .eq('id', tagId);

    if (error) throw error;
  },

  // Tax Documents
  async getTaxDocuments(taxYear?: number): Promise<TaxDocument[]> {
    let query = supabase
      .from('tax_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (taxYear) {
      query = query.eq('tax_year', taxYear);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async addTaxDocument(documentData: {
    expense_id?: string;
    document_name: string;
    document_type: string;
    tax_year: number;
    file_path?: string;
    file_size?: number;
  }): Promise<TaxDocument> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tax_documents')
      .insert({
        user_id: user.id,
        ...documentData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Enhanced Expense Updates
  async updateExpenseTaxInfo(expenseId: string, updates: {
    is_tax_deductible?: boolean;
    tax_category?: string;
    business_purpose?: string;
    subcategory?: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', expenseId);

    if (error) throw error;
  }
};
