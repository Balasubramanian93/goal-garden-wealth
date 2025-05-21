
import { create } from 'zustand';
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  progress: number;
  expectedReturn: number;
  iconType: 'Calendar' | 'Flag' | 'Target' | 'Home' | 'Briefcase';
}

interface GoalsState {
  goals: Goal[];
  loading: boolean;
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'progress'>) => Promise<void>;
  updateGoal: (id: number, goal: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: number) => Promise<void>;
  getGoalById: (id: number) => Goal | undefined;
  updateGoalCurrentAmount: (id: number, newAmount: number) => Promise<void>;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],
  loading: false,

  fetchGoals: async () => {
    try {
      set({ loading: true });
      
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        console.error("No authenticated user session found");
        set({ loading: false });
        return;
      }

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      // Transform the data to match our Goal interface
      const transformedGoals: Goal[] = data.map(goal => ({
        id: goal.id,
        name: goal.name,
        targetAmount: Number(goal.target_amount),
        currentAmount: Number(goal.current_amount),
        targetDate: goal.target_date,
        monthlyContribution: Number(goal.monthly_contribution),
        progress: goal.progress,
        expectedReturn: Number(goal.expected_return),
        iconType: goal.icon_type as Goal['iconType'],
      }));

      set({ goals: transformedGoals, loading: false });
    } catch (error: any) {
      console.error("Error fetching goals:", error.message);
      toast.error("Failed to fetch goals");
      set({ loading: false });
    }
  },

  addGoal: async (goal) => {
    try {
      const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("You must be logged in to add goals");
        return;
      }

      const { data, error } = await supabase
        .from('goals')
        .insert([
          {
            user_id: session.session.user.id,
            name: goal.name,
            target_amount: goal.targetAmount,
            current_amount: goal.currentAmount,
            target_date: goal.targetDate,
            monthly_contribution: goal.monthlyContribution,
            progress: progress,
            expected_return: goal.expectedReturn,
            icon_type: goal.iconType,
          }
        ])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        const newGoal: Goal = {
          id: data[0].id,
          name: data[0].name,
          targetAmount: Number(data[0].target_amount),
          currentAmount: Number(data[0].current_amount),
          targetDate: data[0].target_date,
          monthlyContribution: Number(data[0].monthly_contribution),
          progress: data[0].progress,
          expectedReturn: Number(data[0].expected_return),
          iconType: data[0].icon_type as Goal['iconType'],
        };
        
        set(state => ({ goals: [...state.goals, newGoal] }));
      }
    } catch (error: any) {
      console.error("Error adding goal:", error.message);
      toast.error("Failed to add goal");
    }
  },

  updateGoal: async (id, updatedGoal) => {
    try {
      const goals = get().goals;
      const existingGoal = goals.find(goal => goal.id === id);
      
      if (!existingGoal) {
        throw new Error(`Goal with id ${id} not found`);
      }

      // Recalculate progress if amounts changed
      let progress = existingGoal.progress;
      if (updatedGoal.currentAmount !== undefined || updatedGoal.targetAmount !== undefined) {
        const currentAmount = updatedGoal.currentAmount ?? existingGoal.currentAmount;
        const targetAmount = updatedGoal.targetAmount ?? existingGoal.targetAmount;
        progress = Math.round((currentAmount / targetAmount) * 100);
      }

      // Prepare update payload
      const updatePayload: any = {};
      
      if (updatedGoal.name !== undefined) updatePayload.name = updatedGoal.name;
      if (updatedGoal.targetAmount !== undefined) updatePayload.target_amount = updatedGoal.targetAmount;
      if (updatedGoal.currentAmount !== undefined) updatePayload.current_amount = updatedGoal.currentAmount;
      if (updatedGoal.targetDate !== undefined) updatePayload.target_date = updatedGoal.targetDate;
      if (updatedGoal.monthlyContribution !== undefined) updatePayload.monthly_contribution = updatedGoal.monthlyContribution;
      if (updatedGoal.expectedReturn !== undefined) updatePayload.expected_return = updatedGoal.expectedReturn;
      if (updatedGoal.iconType !== undefined) updatePayload.icon_type = updatedGoal.iconType;
      updatePayload.progress = progress;
      updatePayload.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('goals')
        .update(updatePayload)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      set(state => ({
        goals: state.goals.map(goal => {
          if (goal.id === id) {
            return {
              ...goal,
              ...updatedGoal,
              progress,
            };
          }
          return goal;
        })
      }));
    } catch (error: any) {
      console.error("Error updating goal:", error.message);
      toast.error("Failed to update goal");
    }
  },

  deleteGoal: async (id) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        goals: state.goals.filter(goal => goal.id !== id)
      }));
    } catch (error: any) {
      console.error("Error deleting goal:", error.message);
      toast.error("Failed to delete goal");
    }
  },

  getGoalById: (id) => {
    return get().goals.find(goal => goal.id === id);
  },

  updateGoalCurrentAmount: async (id, newAmount) => {
    try {
      const goals = get().goals;
      const existingGoal = goals.find(goal => goal.id === id);
      
      if (!existingGoal) {
        throw new Error(`Goal with id ${id} not found`);
      }

      const updatedAmount = existingGoal.currentAmount + newAmount;
      const progress = Math.round((updatedAmount / existingGoal.targetAmount) * 100);

      // Update in database
      const { error } = await supabase
        .from('goals')
        .update({
          current_amount: updatedAmount,
          progress,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      set(state => ({
        goals: state.goals.map(goal => {
          if (goal.id === id) {
            return {
              ...goal,
              currentAmount: updatedAmount,
              progress,
            };
          }
          return goal;
        })
      }));
    } catch (error: any) {
      console.error("Error updating goal amount:", error.message);
      toast.error("Failed to update goal amount");
    }
  }
}));
