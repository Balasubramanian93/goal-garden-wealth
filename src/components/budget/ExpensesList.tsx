
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Expense } from '@/services/budgetService';
import ExpenseItem from './ExpenseItem';

interface ExpensesListProps {
  currentPeriodName: string;
  currentMonthExpenses: Expense[];
  displayedExpenses: Expense[];
  onShowMore: () => void;
  onUpdateExpense?: (expenseId: string, newAmount: number) => void;
  onDeleteExpense?: (expenseId: string) => void;
  isDeleting?: boolean;
}

const ExpensesList = ({ 
  currentPeriodName, 
  currentMonthExpenses, 
  displayedExpenses, 
  onShowMore,
  onUpdateExpense,
  onDeleteExpense,
  isDeleting
}: ExpensesListProps) => {
  console.log('ExpensesList rendering with expenses:', currentMonthExpenses);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Month Expenses</CardTitle>
        <CardDescription>Detailed list of your expenses for {currentPeriodName}.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {currentMonthExpenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No expenses recorded yet.</p>
          ) : (
            <>
              {displayedExpenses.map((expense) => {
                console.log('Rendering expense item:', expense);
                return (
                  <ExpenseItem 
                    key={expense.id} 
                    expense={expense} 
                    onUpdate={onUpdateExpense}
                    onDelete={onDeleteExpense}
                    isDeleting={isDeleting}
                  />
                );
              })}
              {currentMonthExpenses.length > displayedExpenses.length && (
                <Button variant="link" className="w-full mt-4" onClick={onShowMore}>
                  Show More ({currentMonthExpenses.length - displayedExpenses.length} remaining)
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensesList;
