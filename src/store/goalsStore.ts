
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addGoal: (goal: Omit<Goal, 'id' | 'progress'>) => void;
  updateGoal: (id: number, goal: Partial<Goal>) => void;
  deleteGoal: (id: number) => void;
  getGoalById: (id: number) => Goal | undefined;
}

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set, get) => ({
      goals: [
        {
          id: 1,
          name: "Child's Education",
          targetAmount: 5000000,
          currentAmount: 2000000,
          targetDate: "2040",
          monthlyContribution: 15000,
          progress: 40,
          expectedReturn: 12,
          iconType: 'Calendar'
        },
        {
          id: 2,
          name: "Retirement (FIRE)",
          targetAmount: 50000000,
          currentAmount: 10000000,
          targetDate: "2035",
          monthlyContribution: 75000,
          progress: 20,
          expectedReturn: 10,
          iconType: 'Flag'
        },
        {
          id: 3,
          name: "Dream Home",
          targetAmount: 8000000,
          currentAmount: 1200000,
          targetDate: "2028",
          monthlyContribution: 50000,
          progress: 15,
          expectedReturn: 8,
          iconType: 'Target'
        }
      ],
      addGoal: (goal) => {
        set((state) => {
          const newId = state.goals.length > 0 
            ? Math.max(...state.goals.map(g => g.id)) + 1 
            : 1;
          
          const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
          
          return { 
            goals: [...state.goals, { ...goal, id: newId, progress }] 
          };
        });
      },
      updateGoal: (id, updatedGoal) => {
        set((state) => {
          const goals = state.goals.map(goal => {
            if (goal.id === id) {
              const newGoal = { ...goal, ...updatedGoal };
              // Recalculate progress if amounts changed
              if (updatedGoal.currentAmount !== undefined || updatedGoal.targetAmount !== undefined) {
                const currentAmount = updatedGoal.currentAmount ?? goal.currentAmount;
                const targetAmount = updatedGoal.targetAmount ?? goal.targetAmount;
                newGoal.progress = Math.round((currentAmount / targetAmount) * 100);
              }
              return newGoal;
            }
            return goal;
          });
          
          return { goals };
        });
      },
      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter(goal => goal.id !== id)
        }));
      },
      getGoalById: (id) => {
        return get().goals.find(goal => goal.id === id);
      }
    }),
    {
      name: 'goals-storage',
    }
  )
);
