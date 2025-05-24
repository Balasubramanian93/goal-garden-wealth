
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Check, X } from 'lucide-react';
import { Expense } from '@/services/budgetService';

interface ExpenseItemProps {
  expense: Expense;
  onUpdate?: (expenseId: string, newAmount: number) => void;
}

const ExpenseItem = ({ expense, onUpdate }: ExpenseItemProps) => {
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

  return (
    <div className="flex justify-between items-center p-3 border rounded-md">
      <div>
        <p className="font-medium">{expense.shop}</p>
        <p className="text-sm text-muted-foreground">{expense.date} • {expense.category}</p>
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Input
              type="text"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className="w-20 h-8"
            />
            <Button size="sm" variant="ghost" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <p className="font-semibold">${expense.amount}</p>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseItem;
