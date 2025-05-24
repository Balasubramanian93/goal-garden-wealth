
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from 'lucide-react';
import { BudgetPeriod } from '@/services/budgetService';

interface BudgetSummaryCardProps {
  currentPeriodName: string;
  currentBudgetPeriod: BudgetPeriod | undefined;
  onEditClick: () => void;
}

const BudgetSummaryCard = ({ currentPeriodName, currentBudgetPeriod, onEditClick }: BudgetSummaryCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Current Month: {currentPeriodName}</CardTitle>
          <CardDescription>Overview of your current month's budget.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onEditClick}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 border rounded-md">
            <p className="text-muted-foreground text-sm">Total Income</p>
            <p className="text-xl font-semibold text-green-600">${currentBudgetPeriod?.total_income || 0}</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-muted-foreground text-sm">Total Expenses</p>
            <p className="text-xl font-semibold text-red-600">${currentBudgetPeriod?.total_expenses || 0}</p>
          </div>
          <div className="p-3 border rounded-md">
            <p className="text-muted-foreground text-sm">Remaining Budget</p>
            <p className="text-xl font-semibold text-blue-600">${currentBudgetPeriod?.remaining_budget || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetSummaryCard;
