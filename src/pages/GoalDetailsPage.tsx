
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useGoalsStore } from "@/store/goalsStore";
import { Loader2, Calendar, Flag, Target, Home, Briefcase, Edit, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { GoalFormModal } from "@/components/goals/GoalFormModal";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const GoalDetailsPage = () => {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const { getGoalById, deleteGoal } = useGoalsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [goal, setGoal] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to view goal details");
        navigate("/login");
        return;
      }
      
      // Get goal data
      const parsedId = goalId ? parseInt(goalId) : null;
      if (!parsedId) {
        toast.error("Invalid goal ID");
        navigate("/goals");
        return;
      }
      
      const goalData = getGoalById(parsedId);
      if (!goalData) {
        toast.error("Goal not found");
        navigate("/goals");
        return;
      }
      
      setGoal(goalData);
      setIsLoading(false);
    };
    
    checkAuth();
  }, [goalId, navigate, getGoalById]);

  const renderIcon = () => {
    if (!goal) return null;
    
    switch (goal.iconType) {
      case 'Calendar':
        return <Calendar className="h-16 w-16 text-blue-500" />;
      case 'Flag':
        return <Flag className="h-16 w-16 text-green-500" />;
      case 'Target':
        return <Target className="h-16 w-16 text-purple-500" />;
      case 'Home':
        return <Home className="h-16 w-16 text-orange-500" />;
      case 'Briefcase':
        return <Briefcase className="h-16 w-16 text-teal-500" />;
      default:
        return <Target className="h-16 w-16 text-gray-500" />;
    }
  };

  const calculateMonthsRemaining = () => {
    if (!goal) return 0;
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
    if (!goal) return 0;
    
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

  const handleEdit = () => {
    navigate(`/goals/edit/${goalId}`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the goal "${goal.name}"?`)) {
      setIsDeleting(true);
      try {
        await deleteGoal(goal.id);
        toast.success("Goal deleted successfully");
        navigate("/goals");
      } catch (error) {
        console.error("Error deleting goal:", error);
        toast.error("Failed to delete the goal");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Generate comparison chart data
  const generateComparisonData = () => {
    if (!goal) return [];
    
    const data = [];
    const currentYear = new Date().getFullYear();
    const targetYear = parseInt(goal.targetDate);
    const years = targetYear - currentYear;
    
    // Get monthly rate from annual rate
    const monthlyRate = goal.expectedReturn / 100 / 12;
    
    // Calculate the actual years we've been investing (estimate)
    const totalYears = years + Math.ceil(goal.progress / (100 / years));
    const pastYears = Math.min(totalYears - years, years);
    
    // Generate data points for each year
    for (let i = -pastYears; i <= years; i++) {
      const yearLabel = currentYear + i;
      const monthsPassed = (i + pastYears) * 12;
      
      let expectedAmount = 0;
      
      if (i >= 0) {
        // Future projection based on current amount and monthly contributions
        const futureMonths = i * 12;
        // Current amount grows with interest
        const growthOnCurrent = goal.currentAmount * Math.pow(1 + monthlyRate, futureMonths);
        // New contributions grow with interest
        const growthOnContributions = goal.monthlyContribution * ((Math.pow(1 + monthlyRate, futureMonths) - 1) / monthlyRate);
        expectedAmount = growthOnCurrent + growthOnContributions;
      } else {
        // Past projection (what should have been achieved so far)
        const pastMonths = -i * 12;
        const totalMonths = years * 12;
        const targetMonthlyGrowth = goal.targetAmount / (goal.monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate));
        
        expectedAmount = goal.monthlyContribution * ((Math.pow(1 + targetMonthlyGrowth, totalMonths - pastMonths) - 1) / targetMonthlyGrowth);
      }

      // If this is current year, use actual current amount
      const actualAmount = i === 0 ? goal.currentAmount : 
                          i < 0 ? goal.currentAmount * (1 - (Math.abs(i) / pastYears) * (goal.progress / 100)) : 
                          null;
      
      data.push({
        year: yearLabel.toString(),
        expected: Math.round(expectedAmount),
        actual: actualAmount !== null ? Math.round(actualAmount) : null
      });
    }
    
    return data;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8 flex items-center justify-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }
  
  if (!goal) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="text-center">
            <p>Goal not found.</p>
            <Button onClick={() => navigate('/goals')} className="mt-4">Back to Goals</Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const projectedValue = calculateFutureValue();
  const projectedPercentage = Math.min(100, Math.round((projectedValue / goal.targetAmount) * 100));
  const shortfall = Math.max(0, goal.targetAmount - projectedValue);
  const comparisonData = generateComparisonData();

  return (
    <MainLayout>
      <div className="container max-w-5xl py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/goals')} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Goals
        </Button>
        
        <div className="space-y-8">
          {/* Goal Header */}
          <div className="flex items-center gap-6 bg-muted/30 p-6 rounded-lg">
            <div className="p-5 bg-background rounded-full">
              {renderIcon()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{goal.name}</h1>
              <p className="text-muted-foreground text-lg mt-1">Target: {formatCurrency(goal.targetAmount)} by {goal.targetDate}</p>
            </div>
          </div>
          
          {/* Progress Bars Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Progress */}
            <div className="space-y-2 bg-card p-4 rounded-lg">
              <h3 className="font-medium">Current Progress</h3>
              <div className="flex justify-between text-sm">
                <span>{goal.progress}% Complete</span>
                <span>{formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}</span>
              </div>
              <Progress value={goal.progress} className="h-2" />
            </div>
            
            {/* Projected Progress */}
            <div className="space-y-2 bg-card p-4 rounded-lg">
              <h3 className="font-medium">Projected Progress</h3>
              <div className="flex justify-between text-sm">
                <span>{projectedPercentage}% Projected</span>
                <span>{formatCurrency(projectedValue)} of {formatCurrency(goal.targetAmount)}</span>
              </div>
              <Progress value={projectedPercentage} className="h-2 bg-gray-200">
                <div 
                  className="h-full bg-amber-500" 
                  style={{ width: `${projectedPercentage}%` }}
                ></div>
              </Progress>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-card">
              <p className="text-sm text-muted-foreground">Monthly Contribution</p>
              <p className="font-medium">{formatCurrency(goal.monthlyContribution)}</p>
            </div>
            <div className="p-4 rounded-lg bg-card">
              <p className="text-sm text-muted-foreground">Expected Return</p>
              <p className="font-medium">{goal.expectedReturn}% p.a.</p>
            </div>
            <div className="p-4 rounded-lg bg-card">
              <p className="text-sm text-muted-foreground">Time Remaining</p>
              <p className="font-medium">{parseInt(goal.targetDate) - new Date().getFullYear()} years</p>
            </div>
            <div className="p-4 rounded-lg bg-card">
              <p className="text-sm text-muted-foreground">Projected Shortfall</p>
              <p className="font-medium">{shortfall > 0 ? formatCurrency(shortfall) : "On Track!"}</p>
            </div>
          </div>
          
          {/* Comparison Chart */}
          <div className="border rounded-lg p-6">
            <h3 className="font-medium text-lg mb-4">Growth Comparison</h3>
            <div className="h-[350px] w-full">
              <ChartContainer
                className="h-full"
                config={{
                  expected: {
                    label: "Expected Growth",
                    theme: {
                      light: "hsl(var(--primary))",
                      dark: "hsl(var(--primary))",
                    },
                  },
                  actual: {
                    label: "Actual Progress",
                    theme: {
                      light: "#10b981",
                      dark: "#10b981",
                    },
                  },
                }}
              >
                <LineChart 
                  data={comparisonData} 
                  margin={{ top: 5, right: 30, bottom: 5, left: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent 
                            active={active} 
                            payload={payload} 
                            formatter={(value) => [
                              `₹${Number(value).toLocaleString()}`,
                              payload[0].dataKey === "expected" ? "Expected" : "Actual"
                            ]} 
                          />
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="expected"
                    name="expected"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="actual"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Compare your actual progress with the expected growth trajectory
              </p>
            </div>
          </div>
          
          {/* Recommendations */}
          {shortfall > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-medium mb-2">Recommendations</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Increase monthly contribution by {formatCurrency(Math.ceil(shortfall / calculateMonthsRemaining()))} to reach your goal on time</li>
                <li>Consider increasing your allocation to higher-return assets</li>
                <li>Review and optimize your investment strategy quarterly</li>
              </ul>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                <>Delete Goal</>
              )}
            </Button>
            <Button onClick={handleEdit}>
              Edit Goal
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GoalDetailsPage;
