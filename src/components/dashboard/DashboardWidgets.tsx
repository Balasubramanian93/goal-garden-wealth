
import { useBudget } from "@/hooks/useBudget";
import { useGoalsStore } from "@/store/goalsStore";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import BudgetOverviewWidget from "./BudgetOverviewWidget";
import PortfolioOverviewWidget from "./PortfolioOverviewWidget";
import GoalsProgressWidget from "./GoalsProgressWidget";
import RecentTransactionsWidget from "./RecentTransactionsWidget";
import QuickActionsWidget from "./QuickActionsWidget";
import FinancialHealthWidget from "./FinancialHealthWidget";
import AnalyticsSummaryWidget from "./AnalyticsSummaryWidget";
import PersonalizedRecommendationsWidget from "./PersonalizedRecommendationsWidget";
import AchievementBadgesWidget from "./AchievementBadgesWidget";
import RemindersWidget from "./RemindersWidget";
import { useWidgetPreferences } from "@/hooks/useWidgetPreferences";
import NetWorthWidget from "./NetWorthWidget";

const DashboardWidgets = () => {
  const { user } = useAuth();
  const { currentBudgetPeriod, isLoading: budgetLoading } = useBudget();
  const { goals, loading: goalsLoading, fetchGoals } = useGoalsStore();

  // Fetch portfolio assets
  const { data: portfolioAssets = [], isLoading: portfolioLoading } = useQuery({
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

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user, fetchGoals]);

  const { preferences } = useWidgetPreferences();

  // Show loading state for initial data
  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Top Row - Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Net Worth Widget - New primary widget */}
        <NetWorthWidget />
        
        {preferences.budgetOverview && (
          <BudgetOverviewWidget 
            currentBudgetPeriod={currentBudgetPeriod} 
            isLoading={budgetLoading} 
          />
        )}
        {preferences.portfolioOverview && (
          <PortfolioOverviewWidget 
            portfolioAssets={portfolioAssets} 
            isLoading={portfolioLoading} 
          />
        )}
        {preferences.financialHealth && (
          <FinancialHealthWidget 
            currentBudgetPeriod={currentBudgetPeriod}
            goals={goals}
            portfolioAssets={portfolioAssets}
          />
        )}
      </div>

      {/* Quick Actions */}
      {preferences.quickActions && <QuickActionsWidget />}

      {/* Second Row - Goals, Analytics, and Personalization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {preferences.goalsProgress && (
          <GoalsProgressWidget goals={goals} isLoading={goalsLoading} />
        )}
        {preferences.analyticsSummary && <AnalyticsSummaryWidget />}
        {preferences.personalizedRecommendations && <PersonalizedRecommendationsWidget />}
        {preferences.achievementBadges && <AchievementBadgesWidget />}
      </div>

      {/* Third Row - Recent Activity and Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {preferences.recentTransactions && <RecentTransactionsWidget />}
        {preferences.reminders && <RemindersWidget />}
      </div>
    </div>
  );
};

export default DashboardWidgets;
