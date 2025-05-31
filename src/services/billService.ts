
import { supabase } from '@/integrations/supabase/client';

export interface BillReminder {
  id: string;
  user_id: string;
  bill_name: string;
  amount: number;
  due_date: string;
  frequency: string;
  category: string;
  vendor_name?: string;
  is_paid: boolean;
  is_recurring: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const billService = {
  async getBillReminders(): Promise<BillReminder[]> {
    const { data, error } = await supabase
      .from('bill_reminders')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async addBillReminder(billData: {
    bill_name: string;
    amount: number;
    due_date: string;
    frequency: string;
    category: string;
    vendor_name?: string;
    is_recurring?: boolean;
    notes?: string;
  }): Promise<BillReminder> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('bill_reminders')
      .insert({
        user_id: user.id,
        ...billData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBillReminder(billId: string, updates: Partial<BillReminder>): Promise<void> {
    const { error } = await supabase
      .from('bill_reminders')
      .update(updates)
      .eq('id', billId);

    if (error) throw error;
  },

  async deleteBillReminder(billId: string): Promise<void> {
    const { error } = await supabase
      .from('bill_reminders')
      .delete()
      .eq('id', billId);

    if (error) throw error;
  },

  async markBillAsPaid(billId: string): Promise<void> {
    const { error } = await supabase
      .from('bill_reminders')
      .update({ is_paid: true })
      .eq('id', billId);

    if (error) throw error;
  }
};
