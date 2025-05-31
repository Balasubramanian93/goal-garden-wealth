
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

  // Get budget period details
  const { data: budgetPeriod, isLoading: budgetLoading } = useQuery({
    queryKey: ['budget-period', budgetId],
    queryFn: async () => {
      const periods = await budgetService.getBudgetPeriods();
      return periods.find(period => period.id === budgetId);
    },
    enabled: !!user && !!budgetId,
  });

  // Get expenses for this budget period
  const { data: expenses = [], isLoading: expensesLoading } = useQuery({
    queryKey: ['expenses', budgetPeriod?.period],
    queryFn: () => budgetService.getExpenses(budgetPeriod!.period),
    enabled: !!budgetPeriod?.period,
  });

  const isLoading = budgetLoading || expensesLoading;

  // Calculate spending breakdown by category
  const spendingBreakdown = React.useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount
    }));
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
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Budget Details</h1>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">Budget period not found.</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

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
                No spending data available for this period
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>Detailed list of transactions for {budgetPeriod.period_name}.</CardDescription>
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
                No expenses recorded for this period.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BudgetDetail;
