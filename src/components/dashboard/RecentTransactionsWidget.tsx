
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useBudget } from "@/hooks/useBudget";

const RecentTransactionsWidget = () => {
  const { currentMonthExpenses, isLoading } = useBudget();
  
  // Get the 5 most recent expenses
  const recentExpenses = currentMonthExpenses
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
          <CardDescription>Your latest expenses</CardDescription>
        </div>
        <Receipt className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="h-4 bg-muted rounded animate-pulse w-24" />
                  <div className="h-3 bg-muted rounded animate-pulse w-16" />
                </div>
                <div className="h-4 bg-muted rounded animate-pulse w-16" />
              </div>
            ))}
          </div>
        ) : recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div className="space-y-1">
                  <div className="font-medium text-sm">{expense.shop}</div>
                  <div className="text-xs text-muted-foreground">
                    {expense.category} • {new Date(expense.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="font-medium text-red-600">
                  -${expense.amount}
                </div>
              </div>
            ))}
            
            <Button asChild className="w-full mt-4" size="sm" variant="outline">
              <Link to="/budget">
                View All Transactions <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No transactions yet this month</p>
            <Button asChild size="sm">
              <Link to="/budget">
                Add Your First Expense <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactionsWidget;
