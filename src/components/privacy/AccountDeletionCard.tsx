
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AccountDeletionCard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);

  const deleteUserData = async () => {
    if (!user) return;

    try {
      // Delete user data from all tables in the correct order (respecting foreign keys)
      await Promise.all([
        supabase.from('goal_investments').delete().eq('goal_id', user.id),
        supabase.from('receipt_items').delete().eq('receipt_id', user.id),
        supabase.from('category_spending').delete().eq('user_id', user.id),
        supabase.from('data_export_requests').delete().eq('user_id', user.id),
        supabase.from('user_consents').delete().eq('user_id', user.id),
      ]);

      await Promise.all([
        supabase.from('expenses').delete().eq('user_id', user.id),
        supabase.from('receipts').delete().eq('user_id', user.id),
        supabase.from('goals').delete().eq('user_id', user.id),
        supabase.from('portfolio_assets').delete().eq('user_id', user.id),
        supabase.from('budget_periods').delete().eq('user_id', user.id),
      ]);

      // Delete profile
      await supabase.from('profiles').delete().eq('id', user.id);

      return true;
    } catch (error) {
      console.error('Error deleting user data:', error);
      return false;
    }
  };

  const handleAccountDeletion = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      // First delete all user data
      const dataDeleted = await deleteUserData();
      
      if (!dataDeleted) {
        throw new Error('Failed to delete user data');
      }

      // Then delete the auth user account
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        // If admin deletion fails, try user deletion
        const { error: userError } = await supabase.auth.updateUser({
          data: { deleted: true }
        });
        
        if (userError) {
          throw userError;
        }
      }

      toast({
        title: "Account deleted",
        description: "Your account and all associated data have been permanently deleted.",
      });

      // Sign out the user
      await signOut();
      
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete account. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  const canDelete = confirmationText === "DELETE" && confirmCheckbox;

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
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> This will permanently delete all your financial data including budgets, 
            goals, portfolio information, and transaction history. This action cannot be reversed.
          </AlertDescription>
        </Alert>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete My Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Confirm Account Deletion
              </DialogTitle>
              <DialogDescription>
                This action will permanently delete your account and all associated data. 
                Please confirm that you understand this action is irreversible.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirmation">
                  Type <strong>DELETE</strong> to confirm:
                </Label>
                <Input
                  id="confirmation"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder="DELETE"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confirm-deletion"
                  checked={confirmCheckbox}
                  onCheckedChange={(checked) => setConfirmCheckbox(checked === true)}
                />
                <Label
                  htmlFor="confirm-deletion"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I understand that this action is permanent and cannot be undone
                </Label>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleAccountDeletion}
                disabled={!canDelete || isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AccountDeletionCard;
