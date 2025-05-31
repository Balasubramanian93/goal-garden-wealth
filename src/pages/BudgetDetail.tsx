
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { budgetService } from '@/services/budgetService';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";

const BudgetDetail = () => {
  const { budgetId } = useParams();
  const { user } = useAuth();

  console.log('BudgetDetail - budgetId from params:', budgetId);

  // Get budget period details - handle both ID and period format
  const { data: budgetPeriod, isLoading: budgetLoading } = useQuery({
    queryKey: ['budget-period', budgetId],
    queryFn: async () => {
      console.log('Fetching budget periods...');
      const periods = await budgetService.getBudgetPeriods();
      console.log('All budget periods:', periods);
      
      // Try to find by ID first, then by period
      let period = periods.find(p => p.id === budgetId);
      if (!period) {
        // If not found by ID, try to find by period (month-year format)
        period = periods.find(p => p.period === budgetId);
      }
      if (!period) {
        // Try to find by period_name
        period = periods.find(p => p.period_name === budgetId);
      }
      
      console.log('Found budget period:', period);
      return period;
    },
    enabled: !!user && !!budgetId,
  });

  // Get expenses for this budget period
  const { data: expenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ['expenses', budgetPeriod?.period],
    queryFn: async () => {
      console.log('Fetching expenses for period:', budgetPeriod?.period);
      const expenseData = await budgetService.getExpenses(budgetPeriod!.period);
      console.log('Fetched expenses:', expenseData);
      return expenseData;
    },
    enabled: !!budgetPeriod?.period,
  });

  const isLoading = budgetLoading || expensesLoading;

  // Calculate spending breakdown by category
  const spendingBreakdown = React.useMemo(() => {
    console.log('Calculating spending breakdown with expenses:', expenses);
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const breakdown = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount
    }));
    
    console.log('Spending breakdown:', breakdown);
    return breakdown;
  }, [expenses]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!budgetPeriod) {
    console.log('No budget period found for:', budgetId);
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Budget Details</h1>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">Budget period not found for: {budgetId}</p>
              <p className="text-muted-foreground text-center text-sm mt-2">
                This might be because the budget period hasn't been created yet or the URL parameter doesn't match.
              </p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  console.log('Rendering budget detail with:', { budgetPeriod, expenses, spendingBreakdown });

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Budget Details: {budgetPeriod.period_name}</h1>

        {/* Budget Summary for the Period */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Overview for {budgetPeriod.period_name}.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-muted-foreground text-sm">Total Income</p>
                <p className="text-xl font-semibold text-green-600">${budgetPeriod.total_income}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Expenses</p>
                <p className="text-xl font-semibold text-red-600">${budgetPeriod.total_expenses}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Remaining Budget</p>
                <p className="text-xl font-semibold text-blue-600">${budgetPeriod.remaining_budget}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spending Breakdown Chart */}
        <Card className="mb-8">
           <CardHeader>
            <CardTitle>Spending Breakdown</CardTitle>
            <CardDescription>Category-wise expense distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            {spendingBreakdown.length > 0 ? (
              <div className="space-y-3">
                {spendingBreakdown.map((item) => (
                  <div key={item.category} className="flex justify-between items-center p-3 border rounded-md">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-lg font-semibold">${item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border rounded-md text-muted-foreground h-40 flex items-center justify-center">
                No spending data available for this period ({budgetPeriod.period})
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>Detailed list of transactions for {budgetPeriod.period_name} ({expenses.length} expenses found).</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Shop</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell>{expense.shop}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No expenses recorded for this period ({budgetPeriod.period}).
                <br />
                <span className="text-sm">Check if expenses exist for period: {budgetPeriod.period}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BudgetDetail;
