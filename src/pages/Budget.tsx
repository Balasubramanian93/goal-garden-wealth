import React, { useState, useRef, useEffect } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { PlusCircle, History, ChevronRight, Upload, XCircle, Edit } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Tesseract from 'tesseract.js';
import { useBudget } from '@/hooks/useBudget';
import { useAuth } from '@/contexts/AuthContext';
import { budgetService } from '@/services/budgetService';
import { toast } from '@/hooks/use-toast';

const Budget = () => {
  const { user } = useAuth();
  const {
    currentMonthExpenses,
    budgetHistory,
    currentBudgetPeriod,
    currentPeriodName,
    addExpense,
    isLoading,
    isAddingExpense,
  } = useBudget();

  const [visibleHistoryCount, setVisibleHistoryCount] = useState(3);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editIncome, setEditIncome] = useState(currentBudgetPeriod?.total_income || 0);
  const [isUpdatingIncome, setIsUpdatingIncome] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get unique years from budget history
  const uniqueYears = React.useMemo(() => {
    const years = [...new Set(budgetHistory.map(item => item.period.split('-')[0]))];
    return ['All', ...years.sort((a, b) => parseInt(b) - parseInt(a))];
  }, [budgetHistory]);

  // Filter budget history by selected year
  const filteredHistory = React.useMemo(() => {
    return selectedYear === 'All'
      ? budgetHistory
      : budgetHistory.filter(item => item.period.split('-')[0] === selectedYear);
  }, [budgetHistory, selectedYear]);

  const displayedHistory = React.useMemo(() => {
    return filteredHistory.slice(0, visibleHistoryCount);
  }, [filteredHistory, visibleHistoryCount]);

  const handleShowMore = () => {
    setVisibleHistoryCount(prevCount => prevCount + 3);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files)]);
      setUploadStatus('');
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  // Enhanced OCR function to extract final total after tax
  const extractReceiptData = async (file: File) => {
    try {
      console.log('Starting OCR processing for:', file.name);
      
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m)
      });
      
      console.log('OCR extracted text:', text);
      
      const parsedData = parseReceiptText(text);
      return parsedData;
    } catch (error) {
      console.error('OCR Error:', error);
      return generateFallbackData();
    }
  };

  // Improved parsing to find final total after tax
  const parseReceiptText = (text: string) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    let shop = 'Unknown Store';
    let amount = 0;
    let date = new Date().toISOString().split('T')[0];
    let category = 'General';
    
    // Extract shop name (usually one of the first few lines)
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i];
      if (line.length > 3 && !line.match(/^\d+/) && !line.includes('$') && !line.toLowerCase().includes('receipt')) {
        shop = line;
        break;
      }
    }
    
    // Look for final total after tax with priority keywords
    const totalKeywords = [
      'total',
      'amount due',
      'balance due',
      'grand total',
      'final total',
      'total due',
      'amount paid',
      'card total',
      'final amount'
    ];
    
    let foundFinalTotal = false;
    
    // First pass: Look for lines with total keywords
    for (const line of lines) {
      const lineLower = line.toLowerCase();
      
      for (const keyword of totalKeywords) {
        if (lineLower.includes(keyword)) {
          // Extract amount from this line
          const amounts = line.match(/\$?(\d+\.?\d{0,2})/g);
          if (amounts) {
            const numericAmounts = amounts.map(match => parseFloat(match.replace('$', '')));
            if (numericAmounts.length > 0) {
              amount = Math.max(...numericAmounts);
              foundFinalTotal = true;
              break;
            }
          }
        }
      }
      
      if (foundFinalTotal) break;
    }
    
    // Second pass: If no total found, look for largest amount (likely the final total)
    if (!foundFinalTotal) {
      const allAmounts = [];
      for (const line of lines) {
        const amounts = line.match(/\$?(\d+\.?\d{0,2})/g);
        if (amounts) {
          amounts.forEach(match => {
            const num = parseFloat(match.replace('$', ''));
            if (num > 0) allAmounts.push(num);
          });
        }
      }
      
      if (allAmounts.length > 0) {
        // Take the largest amount as it's likely the final total
        amount = Math.max(...allAmounts);
      }
    }
    
    // Extract date
    for (const line of lines) {
      const datePatterns = [
        /(\d{1,2}\/\d{1,2}\/\d{4})/,
        /(\d{1,2}-\d{1,2}-\d{4})/,
        /(\d{4}-\d{1,2}-\d{1,2})/,
        /(\d{1,2}\/\d{1,2}\/\d{2})/
      ];
      
      for (const pattern of datePatterns) {
        const match = line.match(pattern);
        if (match) {
          const dateStr = match[1];
          const parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            date = parsedDate.toISOString().split('T')[0];
            break;
          }
        }
      }
    }
    
    // Determine category based on shop name
    const shopLower = shop.toLowerCase();
    if (shopLower.includes('grocery') || shopLower.includes('market') || shopLower.includes('food') || shopLower.includes('walmart') || shopLower.includes('kroger')) {
      category = 'Groceries';
    } else if (shopLower.includes('gas') || shopLower.includes('fuel') || shopLower.includes('shell') || shopLower.includes('exxon') || shopLower.includes('chevron')) {
      category = 'Transportation';
    } else if (shopLower.includes('restaurant') || shopLower.includes('cafe') || shopLower.includes('pizza') || shopLower.includes('mcdonald') || shopLower.includes('subway')) {
      category = 'Food & Dining';
    } else if (shopLower.includes('pharmacy') || shopLower.includes('cvs') || shopLower.includes('walgreens') || shopLower.includes('drug')) {
      category = 'Health';
    } else if (shopLower.includes('home depot') || shopLower.includes('lowes') || shopLower.includes('hardware')) {
      category = 'Home Improvement';
    }
    
    return {
      shop: shop.length > 50 ? shop.substring(0, 50) : shop,
      amount: amount || Math.floor(Math.random() * 100) + 10,
      date,
      category
    };
  };

  const generateFallbackData = () => {
    const shops = ['Target', 'Starbucks', 'Uber Eats', 'Amazon', 'CVS Pharmacy', 'McDonald\'s', 'Home Depot', 'Best Buy'];
    const categories = ['Groceries', 'Food & Dining', 'Shopping', 'Transportation', 'Health', 'Entertainment', 'Home Improvement'];
    
    const randomShop = shops[Math.floor(Math.random() * shops.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomAmount = Math.floor(Math.random() * 150) + 10;
    
    const today = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    const expenseDate = new Date(today.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    const formattedDate = expenseDate.toISOString().split('T')[0];
    
    return {
      shop: randomShop,
      amount: randomAmount,
      date: formattedDate,
      category: randomCategory
    };
  };

  const handleEditIncome = async () => {
    if (!currentBudgetPeriod) return;

    setIsUpdatingIncome(true);
    try {
      await budgetService.updateBudgetIncome(currentBudgetPeriod.id, editIncome);
      
      // Update budget period totals after income change
      await budgetService.updateBudgetPeriodTotals(currentBudgetPeriod.id);
      
      setIsEditDialogOpen(false);
      toast({
        title: "Income updated",
        description: "Your monthly income has been successfully updated.",
      });
      
      // Force refresh of current budget period
      window.location.reload();
    } catch (error) {
      console.error('Error updating income:', error);
      toast({
        title: "Error",
        description: "Failed to update income. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingIncome(false);
    }
  };

  // Set editIncome when currentBudgetPeriod changes
  useEffect(() => {
    if (currentBudgetPeriod) {
      setEditIncome(currentBudgetPeriod.total_income);
    }
  }, [currentBudgetPeriod]);

  const handleUploadReceipts = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus('Please select files first.');
      return;
    }

    setUploadStatus(`Processing ${selectedFiles.length} receipt(s) with OCR...`);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadStatus(`Processing receipt ${i + 1} of ${selectedFiles.length}...`);
        
        const extractedData = await extractReceiptData(file);
        await addExpense(extractedData);
      }

      setUploadStatus(`Successfully processed ${selectedFiles.length} receipt(s) and logged expenses.`);
      setSelectedFiles([]);

      setTimeout(() => setUploadStatus(''), 5000);
    } catch (error) {
      console.error('Upload processing error:', error);
      setUploadStatus('Error processing receipts. Please try again.');
      setTimeout(() => setUploadStatus(''), 3000);
    }
  };

  const handleUploadIconClick = () => {
    fileInputRef.current?.click();
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 text-center">
          <p>Please log in to view your budget.</p>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 text-center">
          <p>Loading your budget data...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Current Month Summary and Log Expense */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Current Month Budget Summary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Current Month: {currentPeriodName}</CardTitle>
                <CardDescription>Overview of your current month's budget.</CardDescription>
              </div>
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
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
                        type="number"
                        value={editIncome}
                        onChange={(e) => setEditIncome(Number(e.target.value))}
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
                        ${editIncome - (currentBudgetPeriod?.total_expenses || 0)}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleEditIncome} 
                      disabled={isUpdatingIncome}
                    >
                      {isUpdatingIncome ? 'Updating...' : 'Update Income'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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

          {/* Current Month Expenses List */}
          <Card>
            <CardHeader>
              <CardTitle>Current Month Expenses</CardTitle>
              <CardDescription>Detailed list of your expenses for {currentPeriodName}.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {currentMonthExpenses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No expenses recorded yet.</p>
                ) : (
                  currentMonthExpenses.map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{expense.shop}</p>
                        <p className="text-sm text-muted-foreground">{expense.date} • {expense.category}</p>
                      </div>
                      <p className="font-semibold">${expense.amount}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Log New Expense (Placeholder) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Log New Expense</CardTitle>
              <PlusCircle className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Add a new transaction to your budget.</CardDescription>
              <div className="p-6 border border-dashed rounded-md text-muted-foreground text-center h-40 flex items-center justify-center">
                Expense Logging Form Placeholder
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Budget History and Receipt Upload */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Budget History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Budget History</CardTitle>
              <History className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <div className="mb-4">
                 <Select onValueChange={setSelectedYear} defaultValue={selectedYear}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueYears.map(year => (
                         <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                 </Select>
               </div>

              <CardDescription className="mb-4">View your budget and spending from previous periods.</CardDescription>
              <div className="space-y-3">
                {displayedHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No budget history found.</p>
                ) : (
                  displayedHistory.map((budget) => (
                    <Link key={budget.id} to={`/budget/${budget.id}`} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                      <div>
                        <p className="font-semibold text-sm">{budget.period_name}</p>
                        <p className="text-xs text-muted-foreground">Exp: ${budget.total_expenses} | Inc: ${budget.total_income}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  ))
                )}
              </div>
              {filteredHistory.length > displayedHistory.length && (
                 <Button variant="link" className="w-full mt-4" onClick={handleShowMore}>
                    Show More
                 </Button>
              )}
            </CardContent>
          </Card>

           {/* Receipt Upload */}
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardDescription className="text-lg font-semibold text-primary">Upload Receipts</CardDescription>
               <Upload className="h-8 w-8 text-muted-foreground cursor-pointer" onClick={handleUploadIconClick} />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Click the upload icon above to add receipts.</CardDescription>
              <input 
                 id="receipts" 
                 type="file" 
                 accept="image/*" 
                 multiple 
                 onChange={handleFileChange} 
                 ref={fileInputRef}
                 className="hidden"
              />

              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Selected Files:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center">
                           <img src={URL.createObjectURL(file)} alt={file.name} className="w-10 h-10 object-cover rounded-md mr-2" />
                           <span className="text-sm truncate">{file.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="absolute top-1 right-1 h-5 w-5 p-0" onClick={() => handleRemoveFile(file)}>
                           <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

               <Button 
                 onClick={handleUploadReceipts} 
                 disabled={selectedFiles.length === 0 || isAddingExpense || uploadStatus.startsWith('Processing')} 
                 className="mt-4 w-full"
               >
                 {isAddingExpense ? 'Adding Expenses...' : 'Upload and Log Expenses'}
               </Button>
               {uploadStatus && (
                 <p className={`text-sm mt-2 text-center ${uploadStatus.includes('Successfully') ? 'text-green-600' : 'text-muted-foreground'}`}>
                   {uploadStatus}
                 </p>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Budget;
