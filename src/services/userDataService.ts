
import { supabase } from '@/lib/supabase';
import { Goal } from '@/store/goalsStore';

// User Profile
export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}

// Goals
export async function getUserGoals(): Promise<Goal[]> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.user.id);

  if (error) throw error;
  return data || [];
}

export async function createGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('goals')
    .insert([{ ...goal, user_id: user.user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGoal(id: number, goal: Partial<Goal>): Promise<Goal> {
  const { data, error } = await supabase
    .from('goals')
    .update(goal)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGoal(id: number): Promise<void> {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Portfolio data
export interface PortfolioAsset {
  id: number;
  user_id: string;
  name: string;
  type: string;
  value: number;
  gain: number;
}

export async function getUserPortfolio(): Promise<PortfolioAsset[]> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('portfolio_assets')
    .select('*')
    .eq('user_id', user.user.id);

  if (error) throw error;
  return data || [];
}

// Add more functions as needed for analytics, etc.
