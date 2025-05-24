
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit3, Trash2, Check, X, Receipt } from 'lucide-react';
import { Expense } from '@/services/budgetService';
import ReceiptDetailsDialog from './ReceiptDetailsDialog';

interface ExpenseItemProps {
  expense: Expense;
  onUpdate?: (expenseId: string, newAmount: number) => void;
  onDelete?: (expenseId: string) => void;
  isDeleting?: boolean;
}

const ExpenseItem = ({ expense, onUpdate, onDelete, isDeleting }: ExpenseItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(expense.amount.toString());
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSave = () => {
    const newAmount = parseFloat(editAmount);
    if (!isNaN(newAmount) && newAmount > 0 && onUpdate) {
      onUpdate(expense.id, newAmount);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditAmount(expense.amount.toString());
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(expense.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{expense.shop}</p>
                {expense.receipt_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setIsReceiptDialogOpen(true)}
                    title="View receipt details"
                  >
                    <Receipt className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{expense.category}</span>
                <span>•</span>
                <span>{formatDate(expense.date)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  <Input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-20 h-8"
                    step="0.01"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={handleSave}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={handleCancel}>
                    <X className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                  {onUpdate && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0" 
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0" 
                      onClick={() => setIsDeleteDialogOpen(true)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ReceiptDetailsDialog
        isOpen={isReceiptDialogOpen}
        onOpenChange={setIsReceiptDialogOpen}
        receiptId={expense.receipt_id}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense from {expense.shop} for ${expense.amount.toFixed(2)}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExpenseItem;
