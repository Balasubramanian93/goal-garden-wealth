
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";

type Investment = {
  id: number;
  created_at: string;
  amount: number;
  goal_id: number;
  user_id: string;
};

type GoalInvestmentsTrackerProps = {
  goalId: number;
  showAddDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
  onInvestmentAdded: (amount: number) => void;
};

export const GoalInvestmentsTracker = ({
  goalId,
  showAddDialog,
  setShowAddDialog,
  onInvestmentAdded
}: GoalInvestmentsTrackerProps) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newInvestmentAmount, setNewInvestmentAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchInvestments = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("goal_investments")
        .select("*")
        .eq("goal_id", goalId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setInvestments(data || []);
    } catch (error) {
      console.error("Error fetching investments:", error);
      toast.error("Failed to load investment history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [goalId, user]);

  const handleAddInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to add investments");
      return;
    }
    
    if (!newInvestmentAmount || parseFloat(newInvestmentAmount) <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }
    
    const amount = parseFloat(newInvestmentAmount);
    
    try {
      setIsSubmitting(true);
      
      // Add investment record
      const { data, error } = await supabase
        .from("goal_investments")
        .insert({
          goal_id: goalId,
          user_id: user.id,
          amount: amount
        })
        .select();

      if (error) {
        throw error;
      }
      
      // Update goal amount
      const { error: updateError } = await supabase
        .rpc("increment_amount", {
          row_id: goalId,
          amount_to_add: amount
        });
        
      if (updateError) {
        throw updateError;
      }
      
      toast.success(`Added ₹${amount.toLocaleString()} to your goal`);
      setNewInvestmentAmount("");
      setShowAddDialog(false);
      onInvestmentAdded(amount);
      
      // Refresh investments
      fetchInvestments();
    } catch (error: any) {
      console.error("Error adding investment:", error);
      toast.error(error.message || "Failed to add investment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInvestment = async (investment: Investment) => {
    if (!window.confirm("Are you sure you want to delete this investment?")) {
      return;
    }
    
    try {
      // Delete investment record
      const { error } = await supabase
        .from("goal_investments")
        .delete()
        .eq("id", investment.id);

      if (error) {
        throw error;
      }
      
      // Update goal amount (subtract the amount)
      const { error: updateError } = await supabase
        .rpc("increment_amount", {
          row_id: goalId,
          amount_to_add: -investment.amount
        });
        
      if (updateError) {
        throw updateError;
      }
      
      toast.success("Investment deleted successfully");
      
      // Update local state (negative amount since we're deleting)
      onInvestmentAdded(-investment.amount);
      
      // Refresh investments
      fetchInvestments();
    } catch (error: any) {
      console.error("Error deleting investment:", error);
      toast.error(error.message || "Failed to delete investment");
    }
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  return (
    <>
      <div className="border rounded-lg p-4 bg-card shadow-sm">
        <h3 className="font-medium text-lg mb-4">Investment History</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : investments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No investments recorded yet.</p>
            <p className="text-sm mt-2">Add your first investment to start tracking your progress.</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {investments.map((investment) => (
                <div 
                  key={investment.id} 
                  className="flex items-center justify-between p-3 rounded-md border"
                >
                  <div>
                    <p className="font-medium">₹{investment.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(investment.created_at)}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeleteInvestment(investment)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
      
      {/* Add Investment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Investment</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAddInvestment}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">₹</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="10000"
                    className="pl-8"
                    value={newInvestmentAmount}
                    onChange={(e) => setNewInvestmentAmount(e.target.value)}
                    min={1}
                    required
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                  </>
                ) : (
                  <>Add Investment</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
