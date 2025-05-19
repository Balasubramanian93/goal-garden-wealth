
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Goal, useGoalsStore } from "@/store/goalsStore";
import { Calendar, Flag, Target, Home, Briefcase, Edit, Trash2 } from "lucide-react";
import { GoalFormModal } from "./GoalFormModal";
import { toast } from "sonner";

interface GoalDetailsProps {
  goalId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GoalDetails({ goalId, open, onOpenChange }: GoalDetailsProps) {
  const { getGoalById, deleteGoal } = useGoalsStore();
  const [showEditModal, setShowEditModal] = useState(false);
  
  const goal = getGoalById(goalId);
  
  if (!goal) {
    return null;
  }

  const renderIcon = () => {
    switch (goal.iconType) {
      case 'Calendar':
        return <Calendar className="h-10 w-10 text-blue-500" />;
      case 'Flag':
        return <Flag className="h-10 w-10 text-green-500" />;
      case 'Target':
        return <Target className="h-10 w-10 text-purple-500" />;
      case 'Home':
        return <Home className="h-10 w-10 text-orange-500" />;
      case 'Briefcase':
        return <Briefcase className="h-10 w-10 text-teal-500" />;
      default:
        return <Target className="h-10 w-10 text-gray-500" />;
    }
  };

  const calculateMonthsRemaining = () => {
    const currentYear = new Date().getFullYear();
    const targetYear = parseInt(goal.targetDate);
    return (targetYear - currentYear) * 12;
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  const calculateFutureValue = () => {
    const months = calculateMonthsRemaining();
    const rate = goal.expectedReturn / 100 / 12;
    const present = goal.currentAmount;
    const pmt = goal.monthlyContribution;

    // Calculate future value of existing investments
    const futureValueExisting = present * Math.pow(1 + rate, months);
    
    // Calculate future value of monthly investments
    const futureValueMonthly = pmt * ((Math.pow(1 + rate, months) - 1) / rate);
    
    return futureValueExisting + futureValueMonthly;
  };

  const projectedValue = calculateFutureValue();
  const projectedPercentage = Math.min(100, Math.round((projectedValue / goal.targetAmount) * 100));
  const shortfall = Math.max(0, goal.targetAmount - projectedValue);
  
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the goal "${goal.name}"?`)) {
      deleteGoal(goal.id);
      toast.success("Goal deleted successfully");
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Goal Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Goal Header */}
            <div className="flex items-center gap-4">
              {renderIcon()}
              <div>
                <h2 className="text-2xl font-bold">{goal.name}</h2>
                <p className="text-muted-foreground">Target: {formatCurrency(goal.targetAmount)} by {goal.targetDate}</p>
              </div>
            </div>
            
            {/* Current Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Progress: {goal.progress}%</span>
                <span>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
            
            {/* Projected Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Projected Progress: {projectedPercentage}%</span>
                <span>{formatCurrency(projectedValue)} of {formatCurrency(goal.targetAmount)}</span>
              </div>
              <Progress value={projectedPercentage} className="h-2 bg-gray-200">
                <div 
                  className="h-full bg-amber-500" 
                  style={{ width: `${projectedPercentage}%` }}
                ></div>
              </Progress>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Contribution</p>
                <p className="font-medium">{formatCurrency(goal.monthlyContribution)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expected Return</p>
                <p className="font-medium">{goal.expectedReturn}% p.a.</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Remaining</p>
                <p className="font-medium">{parseInt(goal.targetDate) - new Date().getFullYear()} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Projected Shortfall</p>
                <p className="font-medium">{shortfall > 0 ? formatCurrency(shortfall) : "On Track!"}</p>
              </div>
            </div>
            
            {/* Recommendations */}
            {shortfall > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">Recommendations</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Increase monthly contribution by {formatCurrency(Math.ceil(shortfall / calculateMonthsRemaining()))} to reach your goal on time</li>
                  <li>Consider increasing your allocation to higher-return assets</li>
                  <li>Review and optimize your investment strategy quarterly</li>
                </ul>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2 sm:justify-between sm:gap-0">
            <Button variant="destructive" type="button" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Goal
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={() => setShowEditModal(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Goal
              </Button>
              <Button type="button" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <GoalFormModal 
        open={showEditModal} 
        onOpenChange={setShowEditModal} 
        goalId={goal.id}
      />
    </>
  );
}
