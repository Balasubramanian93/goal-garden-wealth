import React, { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Wallet } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { investmentService, Investment } from "@/services/investmentService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

type InvestmentType = 'Gold' | 'Equity' | 'Mutual Fund' | 'Emergency Fund' | 'Emergency Fund FD' | 'Fixed Deposit' | 'Real Estate' | 'Other';

const Investments = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

  const [formData, setFormData] = useState({
    investment_name: '',
    investment_type: 'Equity' as InvestmentType,
    current_value: '',
    quantity: '',
    purchase_price: '',
    purchase_date: '',
    notes: ''
  });

  const { data: investments = [], isLoading } = useQuery({
    queryKey: ['investments'],
    queryFn: () => investmentService.getInvestments(),
    enabled: !!user,
  });

  const { data: netWorth = 0 } = useQuery({
    queryKey: ['net-worth'],
    queryFn: () => investmentService.calculateNetWorth(),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: investmentService.addInvestment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['net-worth'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Investment added",
        description: "Your investment has been successfully added.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add investment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Investment> }) => 
      investmentService.updateInvestment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['net-worth'] });
      setIsDialogOpen(false);
      setEditingInvestment(null);
      resetForm();
      toast({
        title: "Investment updated",
        description: "Your investment has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update investment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: investmentService.deleteInvestment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['net-worth'] });
      toast({
        title: "Investment deleted",
        description: "Your investment has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete investment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      investment_name: '',
      investment_type: 'Equity',
      current_value: '',
      quantity: '',
      purchase_price: '',
      purchase_date: '',
      notes: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const investmentData = {
      investment_name: formData.investment_name,
      investment_type: formData.investment_type,
      current_value: parseFloat(formData.current_value),
      quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : undefined,
      purchase_date: formData.purchase_date || undefined,
      notes: formData.notes || undefined,
    };

    if (editingInvestment) {
      updateMutation.mutate({ id: editingInvestment.id, data: investmentData });
    } else {
      addMutation.mutate(investmentData);
    }
  };

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment);
    setFormData({
      investment_name: investment.investment_name,
      investment_type: investment.investment_type,
      current_value: investment.current_value.toString(),
      quantity: investment.quantity?.toString() || '',
      purchase_price: investment.purchase_price?.toString() || '',
      purchase_date: investment.purchase_date || '',
      notes: investment.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this investment?')) {
      deleteMutation.mutate(id);
    }
  };

  const investmentTypeColors: Record<string, string> = {
    'Gold': 'bg-yellow-100 text-yellow-800',
    'Equity': 'bg-blue-100 text-blue-800',
    'Mutual Fund': 'bg-green-100 text-green-800',
    'Emergency Fund': 'bg-red-100 text-red-800',
    'Emergency Fund FD': 'bg-orange-100 text-orange-800',
    'Fixed Deposit': 'bg-purple-100 text-purple-800',
    'Real Estate': 'bg-orange-100 text-orange-800',
    'Other': 'bg-gray-100 text-gray-800'
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 text-center">
          <p>Please log in to manage your investments.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Investment Management</h1>
            <p className="text-muted-foreground">Track and manage your investment portfolio</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingInvestment(null); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Investment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingInvestment ? 'Edit Investment' : 'Add New Investment'}
                </DialogTitle>
                <DialogDescription>
                  {editingInvestment ? 'Update your investment details.' : 'Add a new investment to track your portfolio.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="investment_name">Investment Name</Label>
                  <Input
                    id="investment_name"
                    value={formData.investment_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, investment_name: e.target.value }))}
                    placeholder="e.g., SBI Gold ETF, Emergency FD - Bank of India"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="investment_type">Investment Type</Label>
                  <Select 
                    value={formData.investment_type} 
                    onValueChange={(value: InvestmentType) => setFormData(prev => ({ ...prev, investment_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Equity">Equity</SelectItem>
                      <SelectItem value="Mutual Fund">Mutual Fund</SelectItem>
                      <SelectItem value="Emergency Fund">Emergency Fund</SelectItem>
                      <SelectItem value="Emergency Fund FD">Emergency Fund FD</SelectItem>
                      <SelectItem value="Fixed Deposit">Fixed Deposit</SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="current_value">Current Value (₹)</Label>
                  <Input
                    id="current_value"
                    type="number"
                    step="0.01"
                    value={formData.current_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, current_value: e.target.value }))}
                    placeholder="Current market value"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity (Optional)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="e.g., grams for gold, shares for equity"
                  />
                </div>
                <div>
                  <Label htmlFor="purchase_price">Purchase Price (₹) (Optional)</Label>
                  <Input
                    id="purchase_price"
                    type="number"
                    step="0.01"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchase_price: e.target.value }))}
                    placeholder="Original purchase price"
                  />
                </div>
                <div>
                  <Label htmlFor="purchase_date">Purchase Date (Optional)</Label>
                  <Input
                    id="purchase_date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about this investment"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={addMutation.isPending || updateMutation.isPending}
                    className="flex-1"
                  >
                    {editingInvestment ? 'Update' : 'Add'} Investment
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Net Worth Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Total Net Worth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              ₹{netWorth.toLocaleString()}
            </div>
            <p className="text-muted-foreground">
              Based on {investments.length} investment{investments.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Investments List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Investments</CardTitle>
            <CardDescription>
              {investments.length === 0 
                ? "No investments found. Add your first investment to start tracking your portfolio."
                : `Manage your ${investments.length} investment${investments.length !== 1 ? 's' : ''}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading investments...</div>
            ) : investments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No investments found</p>
                <p className="text-sm">Add your first investment to get started</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((investment) => (
                    <TableRow key={investment.id}>
                      <TableCell className="font-medium">
                        {investment.investment_name}
                      </TableCell>
                      <TableCell>
                        <Badge className={investmentTypeColors[investment.investment_type] || investmentTypeColors.Other}>
                          {investment.investment_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₹{investment.current_value.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {investment.quantity ? investment.quantity.toLocaleString() : '-'}
                      </TableCell>
                      <TableCell>
                        {investment.purchase_date 
                          ? new Date(investment.purchase_date).toLocaleDateString()
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(investment)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(investment.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Investments;
