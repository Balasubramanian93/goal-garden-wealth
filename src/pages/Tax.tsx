
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, FileText, TrendingUp, Receipt, Download } from 'lucide-react';
import { useBudget } from '@/hooks/useBudget';
import { transactionService, type TaxDocument } from '@/services/transactionService';
import { useAuth } from '@/contexts/AuthContext';

const Tax = () => {
  const { user } = useAuth();
  const { currentMonthExpenses } = useBudget();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [taxDocuments, setTaxDocuments] = useState<TaxDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log('Tax page rendering, user:', user);
  console.log('Current month expenses:', currentMonthExpenses);

  useEffect(() => {
    if (user) {
      loadTaxDocuments();
    }
  }, [user, selectedYear]);

  const loadTaxDocuments = async () => {
    try {
      setIsLoading(true);
      const documents = await transactionService.getTaxDocuments(parseInt(selectedYear));
      setTaxDocuments(documents);
    } catch (error) {
      console.error('Error loading tax documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate tax-related expenses with safe property access
  const taxDeductibleExpenses = currentMonthExpenses.filter(expense => {
    try {
      return expense && expense.is_tax_deductible === true;
    } catch (error) {
      console.error('Error filtering tax deductible expenses:', error);
      return false;
    }
  });

  const totalTaxDeductible = taxDeductibleExpenses.reduce((sum, expense) => {
    try {
      return sum + (expense.amount || 0);
    } catch (error) {
      console.error('Error calculating total tax deductible:', error);
      return sum;
    }
  }, 0);

  // Group by tax category with safe property access
  const expensesByCategory = taxDeductibleExpenses.reduce((acc, expense) => {
    try {
      const category = expense.tax_category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + (expense.amount || 0);
      return acc;
    } catch (error) {
      console.error('Error grouping expenses by category:', error);
      return acc;
    }
  }, {} as Record<string, number>);

  const availableYears = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 text-center">
          <p>Please log in to view your tax information.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Tax Planning & Reporting</h1>
              <p className="text-muted-foreground">Track deductible expenses and organize tax documents</p>
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tax Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deductible</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${totalTaxDeductible.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tax Categories</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(expensesByCategory).length}</div>
              <p className="text-xs text-muted-foreground">Active categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tax Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taxDocuments.length}</div>
              <p className="text-xs text-muted-foreground">For {selectedYear}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estimated Savings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalTaxDeductible * 0.22).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">At 22% tax rate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tax Deductible Expenses by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Deductible Expenses by Category</CardTitle>
              <CardDescription>Current month breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(expensesByCategory).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(expensesByCategory)
                    .sort(([,a], [,b]) => b - a)
                    .map(([category, amount]) => (
                      <div key={category} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{category}</p>
                          <p className="text-sm text-muted-foreground">
                            {taxDeductibleExpenses.filter(e => (e.tax_category || 'Uncategorized') === category).length} transactions
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">${amount.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            ~${(amount * 0.22).toFixed(2)} savings
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tax-deductible expenses found for this month.</p>
                  <p className="text-sm">Mark transactions as tax-deductible in your expense list.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Tax Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Tax Documents ({selectedYear})
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </CardTitle>
              <CardDescription>Uploaded receipts and tax documents</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted/30 rounded animate-pulse" />
                  ))}
                </div>
              ) : taxDocuments.length > 0 ? (
                <div className="space-y-3">
                  {taxDocuments.slice(0, 10).map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium">{doc.document_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {doc.document_type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(doc.upload_date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tax documents uploaded for {selectedYear}.</p>
                  <p className="text-sm">Upload receipts and forms to organize your tax information.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Tax-Deductible Transactions */}
        {taxDeductibleExpenses.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Tax-Deductible Transactions</CardTitle>
              <CardDescription>Your latest deductible expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {taxDeductibleExpenses.slice(0, 10).map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">{expense.shop || 'Unknown Shop'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">{expense.category || 'Uncategorized'}</span>
                        {expense.tax_category && (
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                            {expense.tax_category}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${(expense.amount || 0).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        ~${((expense.amount || 0) * 0.22).toFixed(2)} savings
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Tax;
