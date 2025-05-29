
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { useBudget } from "@/hooks/useBudget";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AnalyticsSummaryWidget = () => {
  const { currentMonthExpenses, currentMonthYear } = useBudget();
  
  // Get previous month data for comparison
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  const previousMonthYear = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, '0')}`;

  const { data: previousMonthExpenses = [] } = useQuery({
    queryKey: ['expenses', previousMonthYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('month_year', previousMonthYear);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Calculate totals
  const currentTotal = currentMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const previousTotal = previousMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  
  // Calculate change
  const changePercent = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;
  const isIncrease = changePercent > 0;

  // Get top spending category this month
  const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a)[0];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">Analytics Summary</CardTitle>
          <CardDescription>Spending insights</CardDescription>
        </div>
        <BarChart3 className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Monthly Comparison */}
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="space-y-1">
              <div className="text-sm font-medium">Monthly Change</div>
              <div className="text-xs text-muted-foreground">vs. last month</div>
            </div>
            <div className="flex items-center gap-2">
              {isIncrease ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
              <span className={`font-medium ${isIncrease ? 'text-red-500' : 'text-green-500'}`}>
                {isIncrease ? '+' : ''}{changePercent.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Current Month Total */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">This Month Total</span>
            <span className="font-bold text-lg">${currentTotal.toFixed(2)}</span>
          </div>

          {/* Top Category */}
          {topCategory && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Top Category</span>
              <div className="text-right">
                <div className="font-medium">{topCategory[0]}</div>
                <div className="text-xs text-muted-foreground">${topCategory[1].toFixed(2)}</div>
              </div>
            </div>
          )}

          {/* Transaction Count */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Transactions</span>
            <span className="font-medium">{currentMonthExpenses.length}</span>
          </div>

          {/* Average Transaction */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Avg. Transaction</span>
            <span className="font-medium">
              ${currentMonthExpenses.length > 0 ? (currentTotal / currentMonthExpenses.length).toFixed(2) : '0.00'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsSummaryWidget;
