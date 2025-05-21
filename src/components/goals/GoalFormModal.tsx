import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Flag, Target, Home, Briefcase } from "lucide-react";
import { useForm } from "react-hook-form";
import { Goal, useGoalsStore } from "@/store/goalsStore";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";

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
  const [inputMode, setInputMode] = useState<'target' | 'contribution'>('target');
  const [calculatedTarget, setCalculatedTarget] = useState<number | null>(null);
  const [timePeriod, setTimePeriod] = useState<number>(5); // Default to 5 years
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditing = goalId !== undefined;
  const existingGoal = isEditing ? getGoalById(goalId) : undefined;
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<GoalFormValues>({
    defaultValues: {
      name: "",
      targetAmount: 0,
      currentAmount: 0,
      targetDate: (new Date().getFullYear() + 5) + "",
      monthlyContribution: 0,
      expectedReturn: 8,
      iconType: 'Target'
    }
  });

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error("You must be logged in to create or edit goals");
        onOpenChange(false);
      }
    };
    
    if (open) {
      checkAuth();
    }
  }, [open, onOpenChange]);

  // Watch for changes in form values that would affect the target calculation
  const monthlyContribution = watch('monthlyContribution');
  const expectedReturn = watch('expectedReturn');
  const currentAmount = watch('currentAmount');

  // Calculate the target amount based on monthly contribution, interest rate, and years
  useEffect(() => {
    if (inputMode === 'contribution' && monthlyContribution && expectedReturn && timePeriod) {
      try {
        // Convert annual rate to monthly rate
        const monthlyRate = expectedReturn / 100 / 12;
        const months = timePeriod * 12;
        
        // Current amount with compound interest
        const currentAmountValue = Number(currentAmount) || 0;
        const currentAmountFuture = currentAmountValue * Math.pow(1 + monthlyRate, months);
        
        // SIP Future Value formula: P * ((1+r)^n - 1) / r
        const monthlyContributionFuture = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        
        const futureValue = currentAmountFuture + monthlyContributionFuture;
        
        setCalculatedTarget(Math.round(futureValue));
        setValue('targetAmount', Math.round(futureValue));
      } catch (error) {
        console.error('Error calculating target amount:', error);
      }
    }
  }, [inputMode, monthlyContribution, expectedReturn, timePeriod, currentAmount, setValue]);

  useEffect(() => {
    if (existingGoal && open) {
      // Populate form with existing goal data
      setValue("name", existingGoal.name);
      setValue("targetAmount", existingGoal.targetAmount);
      setValue("currentAmount", existingGoal.currentAmount);
      
      // Calculate time period from target date
      const currentYear = new Date().getFullYear();
      const targetYear = parseInt(existingGoal.targetDate);
      setTimePeriod(targetYear - currentYear);
      
      setValue("targetDate", existingGoal.targetDate);
      setValue("monthlyContribution", existingGoal.monthlyContribution);
      setValue("expectedReturn", existingGoal.expectedReturn);
      setSelectedIcon(existingGoal.iconType);
      setValue("iconType", existingGoal.iconType);
    } else if (open) {
      // Reset form when opening for a new goal
      reset();
      setTimePeriod(5);
      setSelectedIcon('Target');
    }
  }, [existingGoal, open, reset, setValue]);

  const handleTimePeriodChange = (value: number[]) => {
    const years = value[0];
    setTimePeriod(years);
    
    // Update target date based on time period
    const targetYear = new Date().getFullYear() + years;
    setValue("targetDate", targetYear.toString());
  };

  const handleModeChange = (newMode: 'target' | 'contribution') => {
    setInputMode(newMode);
  };

  const onSubmit = async (data: GoalFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Check authentication
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session) {
        toast.error("You must be logged in to save goals");
        return;
      }
      
      if (isEditing && existingGoal) {
        await updateGoal(existingGoal.id, data);
        toast.success("Goal updated successfully!");
      } else {
        await addGoal(data);
        toast.success("New goal added successfully!");
      }
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving goal:", error);
      toast.error("There was a problem saving your goal");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIconSelect = (iconType: Goal['iconType']) => {
    setSelectedIcon(iconType);
    setValue("iconType", iconType);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Goal" : "Add New Goal"}</DialogTitle>
          <DialogDescription>
            Create a new financial goal by entering either your target amount or your planned contribution.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <Tabs 
            defaultValue="target" 
            value={inputMode}
            onValueChange={(value) => handleModeChange(value as 'target' | 'contribution')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="target">Set Target Amount</TabsTrigger>
              <TabsTrigger value="contribution">Calculate from Contribution</TabsTrigger>
            </TabsList>
            
            <TabsContent value="target" className="space-y-4 pt-4">
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
            </TabsContent>

            <TabsContent value="contribution" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyContribution">Monthly Contribution (₹)</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  placeholder="15000"
                  {...register("monthlyContribution", { 
                    required: "Monthly contribution is required",
                    min: { value: 1, message: "Amount must be positive" }
                  })}
                />
                {errors.monthlyContribution && <p className="text-sm text-red-500">{errors.monthlyContribution.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentAmount">Current Amount (₹) (Optional)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  placeholder="100000"
                  {...register("currentAmount", { 
                    min: { value: 0, message: "Amount cannot be negative" }
                  })}
                />
                {errors.currentAmount && <p className="text-sm text-red-500">{errors.currentAmount.message}</p>}
              </div>
              
              {calculatedTarget && inputMode === 'contribution' && (
                <div className="bg-primary/10 p-4 rounded-md mt-4 text-center">
                  <p className="text-sm font-medium">Projected Target Amount</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(calculatedTarget)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on your monthly contribution over {timePeriod} years
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timePeriod">Time Period: {timePeriod} years</Label>
              <Slider 
                defaultValue={[5]} 
                max={50} 
                step={1}
                value={[timePeriod]}
                onValueChange={handleTimePeriodChange}
              />
              {/* Hidden field to keep the targetDate value for form submission */}
              <input 
                type="hidden" 
                {...register("targetDate", { 
                  required: "Target year is required"
                })}
              />
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

          {inputMode === 'target' && (
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
          )}

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  Processing...
                </>
              ) : (
                isEditing ? "Save Changes" : "Add Goal"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
