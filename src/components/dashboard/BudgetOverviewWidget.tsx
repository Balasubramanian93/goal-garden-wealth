
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useBudget } from "@/hooks/useBudget";

interface BudgetOverviewWidgetProps {
  currentBudgetPeriod: any;
  isLoading: boolean;
}

const BudgetOverviewWidget = ({ currentBudgetPeriod, isLoading }: BudgetOverviewWidgetProps) => {
  const { currentPeriodName } = useBudget();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Budget Overview</CardTitle>
          <CardDescription>{currentPeriodName}</CardDescription>
        </div>
        <Wallet className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          </div>
        ) : currentBudgetPeriod ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Income</span>
              <span className="font-medium text-green-600">${currentBudgetPeriod.total_income}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Expenses</span>
              <span className="font-medium text-red-600">${currentBudgetPeriod.total_expenses}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-sm font-medium">Remaining</span>
              <span className={`font-bold ${currentBudgetPeriod.remaining_budget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${currentBudgetPeriod.remaining_budget}
              </span>
            </div>
            <Button asChild className="w-full mt-3" size="sm">
              <Link to="/budget">
                View Details <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-3">No budget data for this month</p>
            <Button asChild size="sm">
              <Link to="/budget">
                Set Up Budget <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetOverviewWidget;
