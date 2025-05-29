
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Calendar, TrendingUp, Award } from "lucide-react";
import { useBudget } from "@/hooks/useBudget";
import { useGoalsStore } from "@/store/goalsStore";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AchievementBadgesWidget = () => {
  const { user } = useAuth();
  const { currentBudgetPeriod, currentMonthExpenses } = useBudget();
  const { goals } = useGoalsStore();

  const { data: portfolioAssets = [] } = useQuery({
    queryKey: ['portfolio-assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio-assets')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const calculateAchievements = () => {
    const achievements = [];

    // Budget-based achievements
    if (currentBudgetPeriod) {
      const budgetUtilization = currentBudgetPeriod.total_expenses / currentBudgetPeriod.total_income;
      
      if (budgetUtilization <= 0.8) {
        achievements.push({
          title: "Budget Master",
          description: "Stayed under 80% of monthly budget",
          icon: Trophy,
          color: "bg-green-100 text-green-700",
          earned: true
        });
      }

      if (currentBudgetPeriod.remaining_budget > 0) {
        achievements.push({
          title: "Surplus Saver",
          description: "Ended month with positive budget",
          icon: Star,
          color: "bg-blue-100 text-blue-700",
          earned: true
        });
      }
    }

    // Transaction-based achievements
    if (currentMonthExpenses.length >= 10) {
      achievements.push({
        title: "Expense Tracker",
        description: "Logged 10+ expenses this month",
        icon: Calendar,
        color: "bg-purple-100 text-purple-700",
        earned: true
      });
    }

    // Goals-based achievements
    const completedGoals = goals.filter(goal => goal.progress >= 100);
    if (completedGoals.length > 0) {
      achievements.push({
        title: "Goal Achiever",
        description: `Completed ${completedGoals.length} financial goal(s)`,
        icon: Target,
        color: "bg-orange-100 text-orange-700",
        earned: true
      });
    }

    const progressingGoals = goals.filter(goal => goal.progress >= 50 && goal.progress < 100);
    if (progressingGoals.length >= 2) {
      achievements.push({
        title: "Progress Champion",
        description: "50%+ progress on multiple goals",
        icon: TrendingUp,
        color: "bg-indigo-100 text-indigo-700",
        earned: true
      });
    }

    // Portfolio-based achievements
    if (portfolioAssets.length >= 3) {
      achievements.push({
        title: "Diversified Investor",
        description: "Portfolio with 3+ different assets",
        icon: Award,
        color: "bg-teal-100 text-teal-700",
        earned: true
      });
    }

    // Add some aspirational badges (not yet earned)
    if (achievements.length < 6) {
      const aspirationalBadges = [
        {
          title: "Consistent Saver",
          description: "Save for 6 consecutive months",
          icon: Star,
          color: "bg-gray-100 text-gray-500",
          earned: false
        },
        {
          title: "Emergency Fund Hero",
          description: "Build 6-month emergency fund",
          icon: Trophy,
          color: "bg-gray-100 text-gray-500",
          earned: false
        },
        {
          title: "Investment Pro",
          description: "Achieve 15%+ portfolio returns",
          icon: TrendingUp,
          color: "bg-gray-100 text-gray-500",
          earned: false
        }
      ];
      
      achievements.push(...aspirationalBadges.slice(0, 6 - achievements.length));
    }

    return achievements.slice(0, 6);
  };

  const achievements = calculateAchievements();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Achievement Badges
        </CardTitle>
        <CardDescription>Your financial milestones and progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 transition-all ${
                  achievement.earned 
                    ? 'border-primary/20 bg-background shadow-sm' 
                    : 'border-dashed border-muted-foreground/30 bg-muted/20'
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`p-2 rounded-full ${achievement.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-xs">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {achievement.description}
                    </div>
                  </div>
                  {achievement.earned && (
                    <Badge variant="secondary" className="text-xs">Earned</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadgesWidget;
