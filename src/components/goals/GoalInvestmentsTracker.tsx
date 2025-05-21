
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Investment {
  id: number;
  goal_id: number;
  amount: number;
  date: string;
  notes: string | null;
}

interface GoalInvestmentsTrackerProps {
  goalId: number;
  onInvestmentAdded: (amount: number) => void;
}

export function GoalInvestmentsTracker({ goalId, onInvestmentAdded }: GoalInvestmentsTrackerProps) {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingInvestment, setIsAddingInvestment] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{
    amount: number;
    date: string;
    notes: string;
  }>({
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      notes: '',
    }
  });

  // Load investments
  useEffect(() => {
    async function loadInvestments() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('goal_investments')
          .select('*')
          .eq('goal_id', goalId)
          .order('date', { ascending: false });

        if (error) {
          throw error;
        }

        setInvestments(data || []);
      } catch (error) {
        console.error('Error loading investments:', error);
        toast.error('Failed to load investment history');
      } finally {
        setIsLoading(false);
      }
    }

    loadInvestments();
  }, [goalId]);

  // Add new investment
  const onSubmit = async (data: { amount: number; date: string; notes: string }) => {
    try {
      setIsAddingInvestment(true);
      
      // Add investment to database
      const { data: investmentData, error } = await supabase
        .from('goal_investments')
        .insert([
          { 
            goal_id: goalId,
            amount: data.amount,
            date: data.date,
            notes: data.notes || null
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      // Update goal current amount
      const { error: updateError } = await supabase
        .from('goals')
        .update({ 
          current_amount: supabase.rpc('increment_amount', { row_id: goalId, amount_to_add: data.amount }),
          progress: supabase.rpc('calculate_progress', { row_id: goalId, amount_to_add: data.amount })
        })
        .eq('id', goalId);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      if (investmentData) {
        setInvestments([investmentData[0], ...investments]);
      }
      
      // Notify parent component about the added amount
      onInvestmentAdded(data.amount);

      toast.success('Investment added successfully');
      setShowAddDialog(false);
      reset();
    } catch (error: any) {
      console.error('Error adding investment:', error);
      toast.error(error.message || 'Failed to add investment');
    } finally {
      setIsAddingInvestment(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg">Investment History</CardTitle>
            <CardDescription>Track your contributions towards this goal</CardDescription>
          </div>
          <Button onClick={() => setShowAddDialog(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" /> Add Investment
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : investments.length > 0 ? (
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(investment.date)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-primary">{formatCurrency(investment.amount)}</TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">{investment.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No investments have been added yet</p>
            <p className="text-sm mt-1">Start tracking your contributions by adding your first investment</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {investments.length} {investments.length === 1 ? 'investment' : 'investments'} recorded
        </div>
        {investments.length > 0 && (
          <div className="text-sm font-medium">
            Total: {formatCurrency(investments.reduce((sum, investment) => sum + investment.amount, 0))}
          </div>
        )}
      </CardFooter>

      {/* Add Investment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%]">
          <DialogHeader>
            <DialogTitle>Add New Investment</DialogTitle>
            <DialogDescription>
              Record a contribution towards your goal
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="5000"
                  {...register("amount", {
                    required: "Amount is required",
                    min: { value: 1, message: "Amount must be at least ₹1" }
                  })}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  {...register("date", {
                    required: "Date is required"
                  })}
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  placeholder="Monthly SIP contribution"
                  {...register("notes")}
                />
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setShowAddDialog(false)}
                disabled={isAddingInvestment}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isAddingInvestment}
              >
                {isAddingInvestment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Investment'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
