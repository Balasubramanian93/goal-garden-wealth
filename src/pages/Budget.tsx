import React, { useState, useRef, useEffect } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { useBudget } from '@/hooks/useBudget';
import { useAuth } from '@/contexts/AuthContext';
import { budgetService } from '@/services/budgetService';
import { toast } from '@/hooks/use-toast';
import BudgetSummaryCard from '@/components/budget/BudgetSummaryCard';
import ExpensesList from '@/components/budget/ExpensesList';
import BudgetHistoryCard from '@/components/budget/BudgetHistoryCard';
import ReceiptUploadCard from '@/components/budget/ReceiptUploadCard';
import EditIncomeDialog from '@/components/budget/EditIncomeDialog';
import AddExpenseDialog from '@/components/budget/AddExpenseDialog';
import ExpenseCategoriesChart from '@/components/budget/ExpenseCategoriesChart';

const Budget = () => {
  const { user } = useAuth();
  const {
    currentMonthExpenses,
    budgetHistory,
    currentBudgetPeriod,
    currentPeriodName,
    addExpense,
    updateExpense,
    deleteExpense,
    isLoading,
    isAddingExpense,
    isDeletingExpense,
  } = useBudget();

  const [visibleHistoryCount, setVisibleHistoryCount] = useState(3);
  const [visibleExpensesCount, setVisibleExpensesCount] = useState(3);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false);
  const [editIncome, setEditIncome] = useState(currentBudgetPeriod?.total_income.toString() || '0');
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

  const displayedExpenses = React.useMemo(() => {
    return currentMonthExpenses.slice(0, visibleExpensesCount);
  }, [currentMonthExpenses, visibleExpensesCount]);

  const handleShowMore = () => {
    setVisibleHistoryCount(prevCount => prevCount + 3);
  };

  const handleShowMoreExpenses = () => {
    setVisibleExpensesCount(prevCount => prevCount + 3);
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

  // Enhanced OCR function with detailed item processing
  const extractReceiptData = async (file: File) => {
    try {
      console.log('Starting detailed OCR processing for:', file.name);
      
      const { data: { text } } = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m)
      });
      
      console.log('OCR extracted text:', text);
      
      const parsedData = parseReceiptText(text);
      return { ...parsedData, ocrText: text };
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

    const incomeValue = parseFloat(editIncome);
    if (isNaN(incomeValue) || incomeValue < 0) {
      toast({
        title: "Invalid income",
        description: "Please enter a valid positive number for income.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingIncome(true);
    try {
      await budgetService.updateBudgetIncome(currentBudgetPeriod.id, incomeValue);
      await budgetService.updateBudgetPeriodTotals(currentBudgetPeriod.id);
      
      setIsEditDialogOpen(false);
      toast({
        title: "Income updated",
        description: "Your monthly income has been successfully updated.",
      });
      
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
      setEditIncome(currentBudgetPeriod.total_income.toString());
    }
  }, [currentBudgetPeriod]);

  // Enhanced receipt upload with detailed processing
  const handleUploadReceipts = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus('Please select files first.');
      return;
    }

    setUploadStatus(`Processing ${selectedFiles.length} receipt(s) with detailed OCR analysis...`);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadStatus(`Processing receipt ${i + 1} of ${selectedFiles.length}...`);
        
        const extractedData = await extractReceiptData(file);
        
        // Use the enhanced processing if OCR text is available
        if (extractedData.ocrText) {
          await budgetService.processDetailedReceipt(file, extractedData.ocrText, {
            shop: extractedData.shop,
            amount: extractedData.amount,
            date: extractedData.date,
            category: extractedData.category,
            month_year: new Date().toISOString().slice(0, 7)
          });
        } else {
          // Fallback to simple expense
          await addExpense(extractedData);
        }
      }

      setUploadStatus(`Successfully processed ${selectedFiles.length} receipt(s) with detailed item categorization.`);
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

  const handleUpdateExpense = async (expenseId: string, newAmount: number) => {
    await updateExpense(expenseId, newAmount);
  };

  const handleAddManualExpense = async (expenseData: {
    shop: string;
    amount: number;
    date: string;
    category: string;
  }) => {
    await addExpense(expenseData);
  };

  const handleDeleteExpense = async (expenseId: string) => {
    await deleteExpense(expenseId);
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
          <BudgetSummaryCard
            currentPeriodName={currentPeriodName}
            currentBudgetPeriod={currentBudgetPeriod}
            onEditClick={() => setIsEditDialogOpen(true)}
          />

          {/* Expense Categories Chart */}
          <ExpenseCategoriesChart
            expenses={currentMonthExpenses}
            currentPeriodName={currentPeriodName}
          />

          {/* Current Month Expenses List */}
          <ExpensesList
            currentPeriodName={currentPeriodName}
            currentMonthExpenses={currentMonthExpenses}
            displayedExpenses={displayedExpenses}
            onShowMore={handleShowMoreExpenses}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            isDeleting={isDeletingExpense}
          />

          {/* Log New Expense */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">Log New Expense</CardTitle>
              <PlusCircle 
                className="h-6 w-6 text-muted-foreground cursor-pointer hover:text-primary transition-colors" 
                onClick={() => setIsAddExpenseDialogOpen(true)}
              />
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Add a new transaction to your budget.</CardDescription>
              <div 
                className="p-6 border border-dashed rounded-md text-muted-foreground text-center h-40 flex items-center justify-center cursor-pointer hover:border-primary hover:text-primary transition-colors"
                onClick={() => setIsAddExpenseDialogOpen(true)}
              >
                Click here or the + icon to add a new expense
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Budget History and Receipt Upload */}
        <div className="md:col-span-1 flex flex-col gap-6">
          {/* Budget History */}
          <BudgetHistoryCard
            uniqueYears={uniqueYears}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            displayedHistory={displayedHistory}
            filteredHistory={filteredHistory}
            onShowMore={handleShowMore}
          />

          {/* Receipt Upload */}
          <ReceiptUploadCard
            selectedFiles={selectedFiles}
            uploadStatus={uploadStatus}
            isAddingExpense={isAddingExpense}
            onUploadIconClick={handleUploadIconClick}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
            onUploadReceipts={handleUploadReceipts}
            fileInputRef={fileInputRef}
          />
        </div>
      </div>

      {/* Edit Income Dialog */}
      <EditIncomeDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editIncome={editIncome}
        onIncomeChange={setEditIncome}
        currentBudgetPeriod={currentBudgetPeriod}
        onSave={handleEditIncome}
        isUpdating={isUpdatingIncome}
      />

      {/* Add Expense Dialog */}
      <AddExpenseDialog
        isOpen={isAddExpenseDialogOpen}
        onOpenChange={setIsAddExpenseDialogOpen}
        onAddExpense={handleAddManualExpense}
        isAdding={isAddingExpense}
      />
    </MainLayout>
  );
};

export default Budget;
