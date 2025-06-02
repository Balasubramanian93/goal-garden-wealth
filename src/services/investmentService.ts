
import { supabase } from '@/integrations/supabase/client';

export interface Investment {
  id: string;
  user_id: string;
  investment_name: string;
  investment_type: 'Gold' | 'Equity' | 'Mutual Fund' | 'Emergency Fund' | 'Fixed Deposit' | 'Real Estate' | 'Other';
  current_value: number;
  quantity?: number;
  purchase_price?: number;
  purchase_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const investmentService = {
  async getInvestments(): Promise<Investment[]> {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Investment[];
  },

  async addInvestment(investment: Omit<Investment, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Investment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('investments')
      .insert({
        user_id: user.id,
        ...investment
      })
      .select()
      .single();

    if (error) throw error;

    // Update net worth after adding investment
    await this.updateNetWorth();
    
    return data as Investment;
  },

  async updateInvestment(id: string, updates: Partial<Investment>): Promise<void> {
    const { error } = await supabase
      .from('investments')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    // Update net worth after updating investment
    await this.updateNetWorth();
  },

  async deleteInvestment(id: string): Promise<void> {
    const { error } = await supabase
      .from('investments')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Update net worth after deleting investment
    await this.updateNetWorth();
  },

  async calculateNetWorth(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { data, error } = await supabase
      .rpc('calculate_net_worth', { user_uuid: user.id });

    if (error) throw error;
    return data || 0;
  },

  async updateNetWorth(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .rpc('update_net_worth', { user_uuid: user.id });

    if (error) throw error;
  },

  async getNetWorthHistory(): Promise<Array<{ date: string; net_worth: number }>> {
    const { data, error } = await supabase
      .from('financial_metrics')
      .select('metric_date, net_worth')
      .order('metric_date', { ascending: false })
      .limit(12);

    if (error) throw error;
    
    return data?.map(item => ({
      date: item.metric_date,
      net_worth: item.net_worth || 0
    })) || [];
  }
};
