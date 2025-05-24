import React from 'react';
import { useParams } from 'react-router-dom';
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

const BudgetDetail = () => {
  const { budgetId } = useParams();

  // Placeholder data for a specific budget period
  const budgetData = {
    id: budgetId,
    period: 'January 2023', // This would be dynamic based on budgetId in a real app
    totalExpenses: 1500,
    totalIncome: 3000,
    remaining: 1500,
    expenses: [
      { id: 1, description: 'Groceries', category: 'Food', amount: 400 },
      { id: 2, description: 'Electricity Bill', category: 'Utility', amount: 150 },
      { id: 3, description: 'Train Ticket', category: 'Travel', amount: 200 },
      { id: 4, description: 'Dinner with friends', category: 'Food', amount: 100 },
      { id: 5, description: 'Internet Bill', category: 'Utility', amount: 50 },
      { id: 6, description: 'Movie Ticket', category: 'Entertainment', amount: 20 },
    ],
    spendingBreakdown: [
      { category: 'Food', amount: 500 },
      { category: 'Utility', amount: 200 },
      { category: 'Travel', amount: 200 },
      { category: 'Entertainment', amount: 20 },
      { category: 'Others', amount: 580 },
    ],
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Budget Details: {budgetData.period}</h1>

        {/* Budget Summary for the Period */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Overview for {budgetData.period}.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-muted-foreground text-sm">Total Income</p>
                <p className="text-xl font-semibold">${budgetData.totalIncome}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Expenses</p>
                <p className="text-xl font-semibold">${budgetData.totalExpenses}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Remaining Budget</p>
                <p className="text-xl font-semibold">${budgetData.remaining}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spending Breakdown Chart (Placeholder) */}
        <Card className="mb-8">
           <CardHeader>
            <CardTitle>Spending Breakdown</CardTitle>
            <CardDescription>Category-wise expense distribution.</CardDescription>
          </CardHeader>
          <CardContent>
             {/* Chart Placeholder */}
            <div className="p-4 border rounded-md text-muted-foreground h-40 flex items-center justify-center">
              Spending Breakdown Chart Placeholder
            </div>
          </CardContent>
        </Card>

        {/* Expenses List */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>Detailed list of transactions for {budgetData.period}.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetData.expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="text-right">${expense.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BudgetDetail;
