
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddExpenseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExpense: (expense: {
    shop: string;
    amount: number;
    date: string;
    category: string;
    subcategory?: string;
  }) => Promise<void>;
  isAdding: boolean;
}

const categories = [
  'Groceries',
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Health',
  'Entertainment',
  'Home Improvement',
  'Utilities',
  'Insurance',
  'Education',
  'Personal Care',
  'Travel',
  'Investment',
  'Other'
];

const investmentSubcategories = [
  'Mutual Fund',
  'ETF',
  'Individual Stocks',
  'Gold Chit',
  'Gold ETF',
  'Bonds',
  'PPF',
  'ELSS',
  'Index Fund',
  'Crypto',
  'Real Estate',
  'FD/RD',
  'Other Investment'
];

const AddExpenseDialog = ({ isOpen, onOpenChange, onAddExpense, isAdding }: AddExpenseDialogProps) => {
  const [expenseTitle, setExpenseTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [date, setDate] = useState<Date>(new Date());

  const isInvestmentCategory = category === 'Investment';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNumber = parseFloat(amount);
    if (!expenseTitle.trim() || !amountNumber || amountNumber <= 0 || !category) {
      return;
    }

    // For investment category, require subcategory
    if (isInvestmentCategory && !subcategory) {
      return;
    }

    await onAddExpense({
      shop: expenseTitle.trim(),
      amount: amountNumber,
      date: format(date, 'yyyy-MM-dd'),
      category,
      subcategory: isInvestmentCategory ? subcategory : undefined
    });

    // Reset form
    setExpenseTitle('');
    setAmount('');
    setCategory('');
    setSubcategory('');
    setDate(new Date());
    onOpenChange(false);
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    // Reset subcategory when category changes
    if (newCategory !== 'Investment') {
      setSubcategory('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expense-title">
              {isInvestmentCategory ? 'Investment Name' : 'Expense Title'}
            </Label>
            <Input
              id="expense-title"
              type="text"
              placeholder={isInvestmentCategory ? 'e.g., HDFC Equity Fund, Reliance Gold ETF' : 'Enter expense title'}
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
              required
            />
            {isInvestmentCategory && (
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>Investment purchases are tracked as expenses for budget analysis but can be categorized separately for portfolio tracking.</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={handleCategoryChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-md z-50">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isInvestmentCategory && (
            <div className="space-y-2">
              <Label htmlFor="subcategory">Investment Type</Label>
              <Select value={subcategory} onValueChange={setSubcategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select investment type" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-md z-50 max-h-60">
                  {investmentSubcategories.map((subcat) => (
                    <SelectItem key={subcat} value={subcat}>
                      {subcat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background border shadow-md z-50" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isAdding} className="flex-1">
              {isAdding ? 'Adding...' : (isInvestmentCategory ? 'Add Investment' : 'Add Expense')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
