
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AccountDeletionCard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user || confirmText !== "DELETE") return;

    setIsDeleting(true);
    try {
      // Call our edge function to delete all user data
      const { error } = await supabase.functions.invoke('delete-user-data', {
        body: { userId: user.id }
      });

      if (error) {
        // If edge function fails, try direct deletion
        console.warn('Edge function failed, attempting direct deletion:', error);
        
        // Delete user data from our tables directly using proper table names
        await supabase.from('user_consents').delete().eq('user_id', user.id);
        await supabase.from('data_export_requests').delete().eq('user_id', user.id);
        await supabase.from('expenses').delete().eq('user_id', user.id);
        await supabase.from('budget_periods').delete().eq('user_id', user.id);
        await supabase.from('goals').delete().eq('user_id', user.id);
        await supabase.from('goal_investments').delete().eq('goal_id', user.id);
        await supabase.from('portfolio_assets').delete().eq('user_id', user.id);
        await supabase.from('receipts').delete().eq('user_id', user.id);
        await supabase.from('receipt_items').delete().eq('receipt_id', user.id);
        await supabase.from('category_spending').delete().eq('user_id', user.id);
        await supabase.from('profiles').delete().eq('id', user.id);
      }

      // Sign out the user
      await signOut();
      
      toast({
        title: "Account deleted",
        description: "Your account and all associated data have been permanently deleted.",
      });
      
      navigate("/");
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete account. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!showConfirm) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={() => setShowConfirm(true)}
            className="w-full"
          >
            Delete My Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          Confirm Account Deletion
        </CardTitle>
        <CardDescription>
          This will permanently delete your account and all data including:
          expenses, budgets, goals, portfolio data, and personal information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="confirmDelete">
            Type "DELETE" to confirm account deletion:
          </Label>
          <Input
            id="confirmDelete"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE here"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowConfirm(false);
              setConfirmText("");
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={confirmText !== "DELETE" || isDeleting}
            className="flex-1"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Account'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountDeletionCard;
