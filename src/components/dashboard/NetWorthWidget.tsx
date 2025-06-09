
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { investmentService } from "@/services/investmentService";
import { useAuth } from "@/contexts/AuthContext";
import { useBudget } from "@/hooks/useBudget";

const NetWorthWidget = () => {
  const { user } = useAuth();
  const { currentBudgetPeriod, isLoading: budgetLoading } = useBudget();

  const { data: investmentNetWorth = 0, isLoading: netWorthLoading } = useQuery({
    queryKey: ['net-worth'],
    queryFn: () => investmentService.calculateNetWorth(),
    enabled: !!user,
  });

  const { data: netWorthHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ['net-worth-history'],
    queryFn: () => investmentService.getNetWorthHistory(),
    enabled: !!user,
  });

  const { data: investments = [], isLoading: investmentsLoading } = useQuery({
    queryKey: ['investments'],
    queryFn: () => investmentService.getInvestments(),
    enabled: !!user,
  });

  // Calculate remaining budget with fallback
  const totalIncome = currentBudgetPeriod?.total_income || 0;
  const totalExpenses = currentBudgetPeriod?.total_expenses || 0;
  const remainingBudget = Math.max(0, totalIncome - totalExpenses); // Only positive values

  // Calculate total net worth including remaining budget
  const totalNetWorth = investmentNetWorth + remainingBudget;

  // Calculate change from previous period (using investment net worth only for comparison)
  const previousNetWorth = netWorthHistory[1]?.net_worth || 0;
  const netWorthChange = investmentNetWorth - previousNetWorth;
  const netWorthChangePercent = previousNetWorth > 0 ? (netWorthChange / previousNetWorth) * 100 : 0;
  const isPositiveChange = netWorthChange >= 0;

  // Group investments by type with Emergency Fund FDs separate
  const investmentsByType = investments.reduce((acc, investment) => {
    if (!acc[investment.investment_type]) {
      acc[investment.investment_type] = 0;
    }
    acc[investment.investment_type] += investment.current_value;
    return acc;
  }, {} as Record<string, number>);

  // Calculate total emergency funds (Emergency Fund + Emergency Fund FD)
  const totalEmergencyFunds = (investmentsByType['Emergency Fund'] || 0) + (investmentsByType['Emergency Fund FD'] || 0);

  if (netWorthLoading || historyLoading || investmentsLoading || budgetLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Net Worth</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Net Worth
          </CardTitle>
          <CardDescription>Investments + Available Budget</CardDescription>
        </div>
        {isPositiveChange ? (
          <TrendingUp className="h-5 w-5 text-green-500" />
        ) : (
          <TrendingDown className="h-5 w-5 text-red-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              ₹{totalNetWorth.toLocaleString()}
            </div>
            {previousNetWorth > 0 && (
              <div className={`text-sm ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                {isPositiveChange ? '+' : ''}₹{netWorthChange.toLocaleString()} 
                ({isPositiveChange ? '+' : ''}{netWorthChangePercent.toFixed(1)}%)
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Breakdown:</p>
            
            {/* Investment breakdown with Emergency Fund FDs grouped */}
            {Object.entries(investmentsByType).map(([type, value]) => {
              // Skip Emergency Fund and Emergency Fund FD as we'll show them combined
              if (type === 'Emergency Fund' || type === 'Emergency Fund FD') {
                return null;
              }
              
              return (
                <div key={type} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{type}</span>
                  <span className="font-medium">₹{value.toLocaleString()}</span>
                </div>
              );
            })}
            
            {/* Show combined Emergency Funds if any exist */}
            {totalEmergencyFunds > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Emergency Funds</span>
                <span className="font-medium">₹{totalEmergencyFunds.toLocaleString()}</span>
              </div>
            )}
            
            {/* Remaining budget */}
            {remainingBudget > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Available Budget</span>
                <span className="font-medium">₹{remainingBudget.toLocaleString()}</span>
              </div>
            )}
            
            {/* Total line */}
            <div className="flex justify-between items-center text-sm border-t pt-2 mt-2">
              <span className="font-medium">Total Net Worth</span>
              <span className="font-bold text-primary">₹{totalNetWorth.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button asChild size="sm" className="w-full h-9">
              <Link to="/portfolio" className="flex items-center justify-center gap-2 px-3">
                <span className="whitespace-nowrap">View Portfolio</span>
                <ArrowRight className="h-3 w-3 flex-shrink-0" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="w-full h-9">
              <Link to="/investments" className="flex items-center justify-center gap-2 px-3">
                <span className="whitespace-nowrap">Manage Investments</span>
                <ArrowRight className="h-3 w-3 flex-shrink-0" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetWorthWidget;
