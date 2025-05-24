
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Check, X, Trash2 } from 'lucide-react';
import { Expense } from '@/services/budgetService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ExpenseItemProps {
  expense: Expense;
  onUpdate?: (expenseId: string, newAmount: number) => void;
  onDelete?: (expenseId: string) => void;
  isDeleting?: boolean;
}

const ExpenseItem = ({ expense, onUpdate, onDelete, isDeleting }: ExpenseItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(expense.amount.toString());

  const handleSave = () => {
    const amount = parseFloat(editAmount);
    if (!isNaN(amount) && amount >= 0 && onUpdate) {
      onUpdate(expense.id, amount);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditAmount(expense.amount.toString());
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(expense.id);
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
      <div className="flex-1">
        <p className="font-medium text-foreground">{expense.shop}</p>
        <p className="text-sm text-muted-foreground">
          {expense.date} • <span className="text-primary font-medium">{expense.category}</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Input
              type="number"
              step="0.01"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className="w-24 h-8"
            />
            <Button size="sm" variant="ghost" onClick={handleSave} className="hover:bg-green-100 hover:text-green-700">
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel} className="hover:bg-red-100 hover:text-red-700">
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <p className="font-semibold text-lg min-w-[80px] text-right">${expense.amount.toFixed(2)}</p>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="hover:bg-blue-100 hover:text-blue-700">
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="hover:bg-red-100 hover:text-red-700"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this expense from {expense.shop} for ${expense.amount.toFixed(2)}? 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseItem;
