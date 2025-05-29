
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

interface FinancialHealthWidgetProps {
  currentBudgetPeriod: any;
  goals: any[];
  portfolioAssets: any[];
}

const FinancialHealthWidget = ({ currentBudgetPeriod, goals, portfolioAssets }: FinancialHealthWidgetProps) => {
  // Calculate financial health score (0-100)
  let healthScore = 0;
  let factors = 0;

  // Budget factor (40% weight)
  if (currentBudgetPeriod) {
    factors++;
    if (currentBudgetPeriod.remaining_budget >= 0) {
      const budgetUtilization = currentBudgetPeriod.total_expenses / currentBudgetPeriod.total_income;
      if (budgetUtilization <= 0.8) healthScore += 40;
      else if (budgetUtilization <= 0.9) healthScore += 30;
      else if (budgetUtilization <= 1.0) healthScore += 20;
    }
  }

  // Goals factor (30% weight)
  if (goals.length > 0) {
    factors++;
    const avgProgress = goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length;
    healthScore += Math.round(avgProgress * 0.3);
  }

  // Portfolio factor (30% weight)
  if (portfolioAssets.length > 0) {
    factors++;
    const portfolioGains = portfolioAssets.reduce((sum, asset) => sum + Number(asset.gain), 0) / portfolioAssets.length;
    if (portfolioGains > 10) healthScore += 30;
    else if (portfolioGains > 5) healthScore += 25;
    else if (portfolioGains > 0) healthScore += 20;
    else if (portfolioGains >= -5) healthScore += 10;
  }

  // If no data available, show neutral score
  if (factors === 0) healthScore = 50;

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-green-600" };
    if (score >= 60) return { label: "Good", color: "text-blue-600" };
    if (score >= 40) return { label: "Fair", color: "text-yellow-600" };
    return { label: "Needs Attention", color: "text-red-600" };
  };

  const status = getHealthStatus(healthScore);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Financial Health</CardTitle>
          <CardDescription>Overall Score</CardDescription>
        </div>
        <TrendingUp className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">{healthScore}/100</div>
            <div className={`text-sm font-medium ${status.color}`}>
              {status.label}
            </div>
          </div>
          
          <Progress value={healthScore} className="h-2" />
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Budget Health</span>
              <span>{currentBudgetPeriod ? '✓' : '○'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Goals Progress</span>
              <span>{goals.length > 0 ? '✓' : '○'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Portfolio Growth</span>
              <span>{portfolioAssets.length > 0 ? '✓' : '○'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialHealthWidget;
