
import { supabase } from '@/integrations/supabase/client';

export interface FinancialMetrics {
  id: string;
  user_id: string;
  metric_date: string;
  net_worth?: number;
  debt_to_income_ratio?: number;
  emergency_fund_months?: number;
  savings_rate?: number;
  credit_score?: number;
  financial_health_score?: number;
  created_at: string;
  updated_at: string;
}

export interface InvestmentAccount {
  id: string;
  user_id: string;
  account_name: string;
  account_type: string;
  provider_name?: string;
  current_value: number;
  cost_basis: number;
  last_updated: string;
  created_at: string;
}

export const financialMetricsService = {
  async getFinancialMetrics(): Promise<FinancialMetrics[]> {
    const { data, error } = await supabase
      .from('financial_metrics')
      .select('*')
      .order('metric_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async updateFinancialMetrics(metrics: {
    net_worth?: number;
    debt_to_income_ratio?: number;
    emergency_fund_months?: number;
    savings_rate?: number;
    credit_score?: number;
    financial_health_score?: number;
  }): Promise<FinancialMetrics> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const today = new Date().toISOString().split('T')[0];

    // Check if metrics exist for today
    const { data: existing } = await supabase
      .from('financial_metrics')
      .select('*')
      .eq('user_id', user.id)
      .eq('metric_date', today)
      .single();

    if (existing) {
      // Update existing record
      const { data, error } = await supabase
        .from('financial_metrics')
        .update(metrics)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new record
      const { data, error } = await supabase
        .from('financial_metrics')
        .insert({
          user_id: user.id,
          metric_date: today,
          ...metrics
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  async getInvestmentAccounts(): Promise<InvestmentAccount[]> {
    const { data, error } = await supabase
      .from('investment_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async addInvestmentAccount(accountData: {
    account_name: string;
    account_type: string;
    provider_name?: string;
    current_value: number;
    cost_basis: number;
  }): Promise<InvestmentAccount> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('investment_accounts')
      .insert({
        user_id: user.id,
        ...accountData
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateInvestmentAccount(accountId: string, updates: Partial<InvestmentAccount>): Promise<void> {
    const { error } = await supabase
      .from('investment_accounts')
      .update(updates)
      .eq('id', accountId);

    if (error) throw error;
  },

  async deleteInvestmentAccount(accountId: string): Promise<void> {
    const { error } = await supabase
      .from('investment_accounts')
      .delete()
      .eq('id', accountId);

    if (error) throw error;
  }
};
