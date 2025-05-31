
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Tag, Receipt, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TransactionTagsManager from './TransactionTagsManager';
import TaxInfoManager from './TaxInfoManager';

interface EnhancedExpenseItemProps {
  expense: {
    id: string;
    shop: string;
    amount: number;
    date: string;
    category: string;
    is_tax_deductible?: boolean;
    tax_category?: string;
    business_purpose?: string;
    subcategory?: string;
  };
  onUpdate: (expenseId: string, newAmount: number) => void;
  onDelete: (expenseId: string) => void;
  isDeleting: boolean;
}

const EnhancedExpenseItem: React.FC<EnhancedExpenseItemProps> = ({
  expense,
  onUpdate,
  onDelete,
  isDeleting
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editAmount, setEditAmount] = useState(expense.amount.toString());

  const handleUpdate = () => {
    const newAmount = parseFloat(editAmount);
    if (!isNaN(newAmount) && newAmount > 0) {
      onUpdate(expense.id, newAmount);
      setIsEditDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardContent className="p-4">
          {/* Main expense info */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm">{expense.shop}</h4>
                {expense.is_tax_deductible && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Tax Deductible
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                {expense.category}
                {expense.subcategory && ` • ${expense.subcategory}`}
              </p>
              <p className="text-xs text-muted-foreground">{formatDate(expense.date)}</p>
              {expense.tax_category && (
                <p className="text-xs text-blue-600 mt-1">Tax: {expense.tax_category}</p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-semibold text-red-600">-${expense.amount}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 w-8 p-0"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditDialogOpen(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(expense.id)}
                  disabled={isDeleting}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded section */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TransactionTagsManager
                  expenseId={expense.id}
                  onTagsChange={() => {
                    // Refresh parent component if needed
                  }}
                />
                <TaxInfoManager
                  expenseId={expense.id}
                  initialData={{
                    is_tax_deductible: expense.is_tax_deductible,
                    tax_category: expense.tax_category,
                    business_purpose: expense.business_purpose,
                    subcategory: expense.subcategory
                  }}
                  onUpdate={() => {
                    // Refresh parent component if needed
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense Amount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Amount ($)</label>
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
                min="0.01"
                step="0.01"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdate} className="flex-1">
                Update Amount
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedExpenseItem;
