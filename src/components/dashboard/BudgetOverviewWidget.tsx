
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

  // Calculate remaining budget with fallback values
  const totalIncome = currentBudgetPeriod?.total_income || 0;
  const totalExpenses = currentBudgetPeriod?.total_expenses || 0;
  const remainingBudget = totalIncome - totalExpenses;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Budget Overview</CardTitle>
          <CardDescription>{currentPeriodName || 'Current Month'}</CardDescription>
        </div>
        <Wallet className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <div className="h-4 bg-muted rounded animate-pulse w-20"></div>
              <div className="h-5 bg-muted rounded animate-pulse w-24"></div>
            </div>
            <div className="h-9 bg-muted rounded animate-pulse w-full mt-3"></div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Income</span>
              <span className="font-medium text-green-600">
                ₹{totalIncome.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Expenses</span>
              <span className="font-medium text-red-600">
                ₹{totalExpenses.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-sm font-medium">Remaining</span>
              <span className={`font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{remainingBudget.toLocaleString()}
              </span>
            </div>
            
            <div className="space-y-2 mt-4">
              <Button asChild className="w-full h-9" size="sm">
                <Link to="/budget" className="flex items-center justify-center gap-2">
                  <span className="whitespace-nowrap">View Details</span>
                  <ArrowRight className="h-3 w-3 flex-shrink-0" />
                </Link>
              </Button>
              
              {totalIncome === 0 && (
                <Button asChild variant="outline" className="w-full h-9" size="sm">
                  <Link to="/budget" className="flex items-center justify-center gap-2">
                    <span className="whitespace-nowrap">Set Up Budget</span>
                    <ArrowRight className="h-3 w-3 flex-shrink-0" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetOverviewWidget;
