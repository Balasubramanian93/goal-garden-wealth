
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BudgetPeriod } from '@/services/budgetService';

interface EditIncomeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editIncome: string;
  onIncomeChange: (income: string) => void;
  currentBudgetPeriod: BudgetPeriod | undefined;
  onSave: () => void;
  isUpdating: boolean;
}

const EditIncomeDialog = ({
  isOpen,
  onOpenChange,
  editIncome,
  onIncomeChange,
  currentBudgetPeriod,
  onSave,
  isUpdating
}: EditIncomeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Monthly Budget</DialogTitle>
          <DialogDescription>
            Update your monthly income. Total expenses and remaining budget are calculated automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="income" className="text-right font-medium">
              Total Income
            </label>
            <Input
              id="income"
              type="text"
              value={editIncome}
              onChange={(e) => onIncomeChange(e.target.value)}
              className="col-span-3"
              placeholder="Enter monthly income"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-muted-foreground">
              Total Expenses
            </label>
            <div className="col-span-3 p-2 bg-muted rounded">
              ${currentBudgetPeriod?.total_expenses || 0}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-muted-foreground">
              Remaining Budget
            </label>
            <div className="col-span-3 p-2 bg-muted rounded">
              ${(parseFloat(editIncome) || 0) - (currentBudgetPeriod?.total_expenses || 0)}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={onSave} 
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Income'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditIncomeDialog;
