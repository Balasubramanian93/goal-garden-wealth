
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useGoalsStore } from "@/store/goalsStore";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GoalFormModal } from "@/components/goals/GoalFormModal";

const EditGoalPage = () => {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const { getGoalById } = useGoalsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to edit goals");
        navigate("/login");
        return;
      }
      
      // Check if goal exists
      const parsedId = goalId ? parseInt(goalId) : null;
      const goal = parsedId ? getGoalById(parsedId) : null;
      
      if (!goal) {
        toast.error("Goal not found");
        navigate("/goals");
        return;
      }
      
      setIsLoading(false);
      setShowEditModal(true);
    };
    
    checkAuth();
  }, [goalId, navigate, getGoalById]);

  const handleModalClose = (open: boolean) => {
    if (!open) {
      navigate("/goals");
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-[70vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <GoalFormModal 
            open={showEditModal} 
            onOpenChange={handleModalClose} 
            goalId={goalId ? parseInt(goalId) : undefined} 
          />
        )}
      </div>
    </MainLayout>
  );
};

export default EditGoalPage;
