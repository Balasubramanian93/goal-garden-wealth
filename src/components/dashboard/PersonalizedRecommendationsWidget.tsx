
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, AlertTriangle, Target } from "lucide-react";
import { useBudget } from "@/hooks/useBudget";
import { useGoalsStore } from "@/store/goalsStore";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const PersonalizedRecommendationsWidget = () => {
  const { user } = useAuth();
  const { currentBudgetPeriod, currentMonthExpenses } = useBudget();
  const { goals } = useGoalsStore();

  const { data: portfolioAssets = [] } = useQuery({
    queryKey: ['portfolio-assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_assets')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const generateRecommendations = () => {
    const recommendations = [];

    // Budget-based recommendations
    if (currentBudgetPeriod) {
      const budgetUtilization = currentBudgetPeriod.total_expenses / currentBudgetPeriod.total_income;
      
      if (budgetUtilization > 0.9) {
        recommendations.push({
          type: "budget",
          priority: "high",
          title: "Budget Alert",
          description: "You've used 90% of your monthly budget. Consider reducing discretionary spending.",
          icon: AlertTriangle,
          color: "text-red-600"
        });
      } else if (budgetUtilization < 0.6) {
        recommendations.push({
          type: "savings",
          priority: "medium",
          title: "Savings Opportunity",
          description: "You're under budget! Consider increasing your SIP contributions.",
          icon: TrendingUp,
          color: "text-green-600"
        });
      }
    }

    // Category spending recommendations
    const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a)[0];
    if (topCategory && topCategory[1] > 500) {
      recommendations.push({
        type: "spending",
        priority: "medium",
        title: "Top Spending Category",
        description: `Your highest spending is in ${topCategory[0]} (₹${topCategory[1].toFixed(0)}). Review if this aligns with your priorities.`,
        icon: Lightbulb,
        color: "text-blue-600"
      });
    }

    // Goals-based recommendations
    const urgentGoals = goals.filter(goal => {
      const daysToTarget = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysToTarget <= 365 && goal.progress < 70;
    });

    if (urgentGoals.length > 0) {
      recommendations.push({
        type: "goals",
        priority: "high",
        title: "Goal Progress Alert",
        description: `${urgentGoals.length} goal(s) need attention. Consider increasing monthly contributions.`,
        icon: Target,
        color: "text-orange-600"
      });
    }

    // Portfolio recommendations
    if (portfolioAssets.length > 0) {
      const avgGain = portfolioAssets.reduce((sum, asset) => sum + Number(asset.gain), 0) / portfolioAssets.length;
      if (avgGain < 5) {
        recommendations.push({
          type: "portfolio",
          priority: "medium",
          title: "Portfolio Review",
          description: "Your portfolio returns are below market average. Consider reviewing your asset allocation.",
          icon: TrendingUp,
          color: "text-yellow-600"
        });
      }
    }

    return recommendations.slice(0, 3); // Show top 3 recommendations
  };

  const recommendations = generateRecommendations();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Smart Recommendations
        </CardTitle>
        <CardDescription>Personalized insights for your financial journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => {
              const Icon = rec.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className={`p-2 rounded-full bg-background ${rec.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{rec.title}</span>
                      <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'secondary' : 'outline'} className="text-xs">
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4">
              <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Great job! No urgent recommendations at the moment.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendationsWidget;
