
import React, { useState, useMemo, useRef } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, History, ChevronRight, Wallet, Upload, XCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const Budget = () => {
  // Placeholder data for budget history
  const budgetHistory = useMemo(() => [
    { id: '2024-07', period: 'July 2024', year: '2024', totalExpenses: 1100, totalIncome: 3500, remaining: 2400 },
    { id: '2024-06', period: 'June 2024', year: '2024', totalExpenses: 1300, totalIncome: 3500, remaining: 2200 },
    { id: '2024-05', period: 'May 2024', year: '2024', totalExpenses: 1500, totalIncome: 3000, remaining: 1500 },
    { id: '2024-04', period: 'April 2024', year: '2024', totalExpenses: 1200, totalIncome: 3000, remaining: 1800 },
    { id: '2023-12', period: 'December 2023', year: '2023', totalExpenses: 1800, totalIncome: 3000, remaining: 1200 },
    { id: '2023-11', period: 'November 2023', year: '2023', totalExpenses: 1400, totalIncome: 3000, remaining: 1600 },
    { id: '2023-10', period: 'October 2023', year: '2023', totalExpenses: 1600, totalIncome: 3000, remaining: 1400 },
    { id: '2023-09', period: 'September 2023', year: '2023', totalExpenses: 1750, totalIncome: 3000, remaining: 1250 },
    { id: '2023-08', period: 'August 2023', year: '2023', totalExpenses: 1900, totalIncome: 3000, remaining: 1100 },
    { id: '2023-07', period: 'July 2023', year: '2023', totalExpenses: 1550, totalIncome: 3000, remaining: 1450 },
  ], []);

  const [visibleHistoryCount, setVisibleHistoryCount] = useState(3);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for current month expenses
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState([
    { id: 1, shop: 'Walmart', amount: 85.50, date: '2024-07-15', category: 'Groceries' },
    { id: 2, shop: 'Shell Gas Station', amount: 45.00, date: '2024-07-14', category: 'Transportation' },
    { id: 3, shop: 'Electric Company', amount: 120.00, date: '2024-07-12', category: 'Utilities' },
  ]);

  // State to hold current month budget data, initialized from history or with defaults
  const [currentMonth, setCurrentMonth] = useState(() => {
    const baseData = budgetHistory.find(item => item.id === '2024-07') || {
      id: '2024-07', period: 'July 2024', year: '2024', totalExpenses: 1100, totalIncome: 3500, remaining: 2400
    };
    
    // Calculate actual total from expenses
    const actualTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      ...baseData,
      totalExpenses: actualTotal,
      remaining: baseData.totalIncome - actualTotal
    };
  });

  // Update current month when expenses change
  React.useEffect(() => {
    const actualTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    setCurrentMonth(prev => ({
      ...prev,
      totalExpenses: actualTotal,
      remaining: prev.totalIncome - actualTotal
    }));
  }, [currentMonthExpenses]);

  const uniqueYears = useMemo(() => {
    const years = [...new Set(budgetHistory.map(item => item.year))];
    return ['All', ...years.sort((a, b) => parseInt(b) - parseInt(a))];
  }, [budgetHistory]);

  const filteredHistory = useMemo(() => {
    return selectedYear === 'All'
      ? budgetHistory
      : budgetHistory.filter(item => item.year === selectedYear);
  }, [budgetHistory, selectedYear]);

  const displayedHistory = useMemo(() => {
    return filteredHistory.slice(0, visibleHistoryCount);
  }, [filteredHistory, visibleHistoryCount]);

  const handleShowMore = () => {
    setVisibleHistoryCount(prevCount => prevCount + 3);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Convert FileList to Array and add to existing files
      setSelectedFiles(prevFiles => [...prevFiles, ...Array.from(event.target.files)]);
      setUploadStatus(''); // Clear previous status on new file selection
      // Clear the value of the input so the same file can be selected again
      if(fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  // Simulate receipt data extraction
  const extractReceiptData = (file: File) => {
    // Simulate different types of shops and expenses
    const shops = ['Target', 'Starbucks', 'Uber Eats', 'Amazon', 'CVS Pharmacy', 'McDonald\'s', 'Home Depot', 'Best Buy'];
    const categories = ['Groceries', 'Food & Dining', 'Shopping', 'Transportation', 'Health', 'Entertainment', 'Home Improvement'];
    
    const randomShop = shops[Math.floor(Math.random() * shops.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomAmount = Math.floor(Math.random() * 150) + 10; // Random amount between 10 and 160
    
    // Generate a recent date (within last 30 days)
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

  const handleUploadReceipts = () => {
    if (selectedFiles.length === 0) {
      setUploadStatus('Please select files first.');
      return;
    }

    setUploadStatus(`Processing ${selectedFiles.length} receipt(s)...`);

    // Simulate processing time
    setTimeout(() => {
      // Extract data from each uploaded receipt
      const newExpenses = selectedFiles.map((file, index) => {
        const extractedData = extractReceiptData(file);
        return {
          id: Date.now() + index, // Simple ID generation
          ...extractedData
        };
      });

      // Add new expenses to current month
      setCurrentMonthExpenses(prevExpenses => [...prevExpenses, ...newExpenses]);

      setUploadStatus(`Successfully logged ${selectedFiles.length} expense(s) to current month.`);
      setSelectedFiles([]); // Clear selected files after processing

      // Clear status after 3 seconds
      setTimeout(() => setUploadStatus(''), 3000);
    }, 2000); // Simulate 2-second processing time
  };

  const handleUploadIconClick = () => {
    fileInputRef.current?.click();
  };

  // Find current month budget data if it exists in history, otherwise use static placeholder
  const currentMonthData = useMemo(() => currentMonth, [currentMonth]);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Current Month Summary and Log Expense */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Current Month Budget Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Current Month: {currentMonthData.period}</CardTitle>
              <CardDescription>Overview of your current month's budget.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-3 border rounded-md">
                  <p className="text-muted-foreground text-sm">Total Income</p>
                  <p className="text-xl font-semibold text-green-600">${currentMonthData.totalIncome}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <p className="text-muted-foreground text-sm">Total Expenses</p>
                  <p className="text-xl font-semibold text-red-600">${currentMonthData.totalExpenses.toFixed(2)}</p>
                </div>
                <div className="p-3 border rounded-md">
                  <p className="text-muted-foreground text-sm">Remaining Budget</p>
                  <p className="text-xl font-semibold text-blue-600">${currentMonthData.remaining.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Month Expenses List */}
          <Card>
            <CardHeader>
              <CardTitle>Current Month Expenses</CardTitle>
              <CardDescription>Detailed list of your expenses for {currentMonthData.period}.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {currentMonthExpenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{expense.shop}</p>
                      <p className="text-sm text-muted-foreground">{expense.date} • {expense.category}</p>
                    </div>
                    <p className="font-semibold">${expense.amount.toFixed(2)}</p>
                  </div>
                ))}
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
              {/* Placeholder for expense logging form */}
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
                {displayedHistory.map((budget) => (
                  <Link key={budget.id} to={`/budget/${budget.id}`} className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                    <div>
                      <p className="font-semibold text-sm">{budget.period}</p>
                      <p className="text-xs text-muted-foreground">Exp: ${budget.totalExpenses} | Inc: ${budget.totalIncome}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                ))}
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

               <Button onClick={handleUploadReceipts} disabled={selectedFiles.length === 0 || uploadStatus.startsWith('Processing...')} className="mt-4 w-full">
                 Upload and Log Expenses
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
