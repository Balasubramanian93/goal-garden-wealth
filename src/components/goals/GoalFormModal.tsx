
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Flag, Target, Home, Briefcase } from "lucide-react";
import { useForm } from "react-hook-form";
import { Goal, useGoalsStore } from "@/store/goalsStore";
import { toast } from "sonner";

type IconOption = {
  type: Goal['iconType'];
  icon: React.ReactNode;
};

const iconOptions: IconOption[] = [
  { type: 'Calendar', icon: <Calendar className="h-6 w-6" /> },
  { type: 'Flag', icon: <Flag className="h-6 w-6" /> },
  { type: 'Target', icon: <Target className="h-6 w-6" /> },
  { type: 'Home', icon: <Home className="h-6 w-6" /> },
  { type: 'Briefcase', icon: <Briefcase className="h-6 w-6" /> },
];

type GoalFormValues = Omit<Goal, 'id' | 'progress'>;

interface GoalFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId?: number; // If provided, we're editing an existing goal
}

export function GoalFormModal({ open, onOpenChange, goalId }: GoalFormModalProps) {
  const { addGoal, updateGoal, getGoalById } = useGoalsStore();
  const [selectedIcon, setSelectedIcon] = useState<Goal['iconType']>('Target');
  
  const isEditing = goalId !== undefined;
  const existingGoal = isEditing ? getGoalById(goalId) : undefined;
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<GoalFormValues>({
    defaultValues: {
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      targetDate: new Date().getFullYear() + 5 + "",
      monthlyContribution: 0,
      expectedReturn: 8,
      iconType: 'Target'
    }
  });

  useEffect(() => {
    if (existingGoal && open) {
      // Populate form with existing goal data
      setValue("name", existingGoal.name);
      setValue("targetAmount", existingGoal.targetAmount);
      setValue("currentAmount", existingGoal.currentAmount);
      setValue("targetDate", existingGoal.targetDate);
      setValue("monthlyContribution", existingGoal.monthlyContribution);
      setValue("expectedReturn", existingGoal.expectedReturn);
      setSelectedIcon(existingGoal.iconType);
      setValue("iconType", existingGoal.iconType);
    } else if (open) {
      // Reset form when opening for a new goal
      reset();
      setSelectedIcon('Target');
    }
  }, [existingGoal, open, reset, setValue]);

  const onSubmit = (data: GoalFormValues) => {
    try {
      if (isEditing && existingGoal) {
        updateGoal(existingGoal.id, data);
        toast.success("Goal updated successfully!");
      } else {
        addGoal(data);
        toast.success("New goal added successfully!");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error("There was a problem saving your goal");
    }
  };

  const handleIconSelect = (iconType: Goal['iconType']) => {
    setSelectedIcon(iconType);
    setValue("iconType", iconType);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Goal" : "Add New Goal"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                placeholder="e.g., Child's Education"
                {...register("name", { required: "Goal name is required" })}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Choose Icon</Label>
              <div className="flex gap-2">
                {iconOptions.map((option) => (
                  <Button
                    key={option.type}
                    type="button"
                    variant={selectedIcon === option.type ? "default" : "outline"}
                    className="h-10 w-10 p-0"
                    onClick={() => handleIconSelect(option.type)}
                  >
                    {option.icon}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount (₹)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="5000000"
                  {...register("targetAmount", { 
                    required: "Target amount is required",
                    min: { value: 1, message: "Amount must be positive" }
                  })}
                />
                {errors.targetAmount && <p className="text-sm text-red-500">{errors.targetAmount.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentAmount">Current Amount (₹)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  placeholder="1000000"
                  {...register("currentAmount", { 
                    required: "Current amount is required",
                    min: { value: 0, message: "Amount cannot be negative" }
                  })}
                />
                {errors.currentAmount && <p className="text-sm text-red-500">{errors.currentAmount.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Year</Label>
                <Input
                  id="targetDate"
                  type="number"
                  placeholder="2035"
                  {...register("targetDate", { 
                    required: "Target year is required",
                    min: { 
                      value: new Date().getFullYear(), 
                      message: "Year must be in the future" 
                    }
                  })}
                />
                {errors.targetDate && <p className="text-sm text-red-500">{errors.targetDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedReturn">Expected Return (%)</Label>
                <Input
                  id="expectedReturn"
                  type="number"
                  placeholder="8"
                  {...register("expectedReturn", { 
                    required: "Expected return is required",
                    min: { value: 1, message: "Return must be positive" },
                    max: { value: 30, message: "Return is too high" }
                  })}
                />
                {errors.expectedReturn && <p className="text-sm text-red-500">{errors.expectedReturn.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyContribution">Monthly Contribution (₹)</Label>
              <Input
                id="monthlyContribution"
                type="number"
                placeholder="15000"
                {...register("monthlyContribution", { 
                  required: "Monthly contribution is required",
                  min: { value: 0, message: "Amount cannot be negative" }
                })}
              />
              {errors.monthlyContribution && <p className="text-sm text-red-500">{errors.monthlyContribution.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Add Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
