
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useGoalsStore } from "@/store/goalsStore";
import { Loader2, Calendar, Flag, Target, Home, Briefcase, ArrowLeft, Plus, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Toggle } from "@/components/ui/toggle";
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
import { GoalInvestmentsTracker } from "@/components/goals/GoalInvestmentsTracker";
import { GoalSummaryCard } from "@/components/goals/GoalSummaryCard";
import { GoalDetailsHeader } from "@/components/goals/GoalDetailsHeader";
import { GoalProgressSection } from "@/components/goals/GoalProgressSection";
import { GoalMetricsGrid } from "@/components/goals/GoalMetricsGrid";
import { GoalRecommendations } from "@/components/goals/GoalRecommendations";
import { useTheme } from "@/contexts/ThemeContext";

const GoalDetailsPage = () => {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const { getGoalById, deleteGoal } = useGoalsStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [goal, setGoal] = useState<any>(null);
  const [showAddInvestmentDialog, setShowAddInvestmentDialog] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
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

  function calculateFutureValue() {
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
  }

  function calculateMonthsRemaining() {
    if (!goal) return 0;
    const currentYear = new Date().getFullYear();
    const targetYear = parseInt(goal.targetDate);
    return (targetYear - currentYear) * 12;
  }

  function formatCurrency(amount: number) {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  }

  return (
    <MainLayout>
      <div className="container max-w-5xl py-8">
        {/* Back button and theme toggle */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/goals')} 
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Goals
          </Button>
          <Toggle 
            pressed={theme === 'dark'}
            onPressedChange={toggleTheme}
            aria-label="Toggle theme"
            className="ml-auto"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Toggle>
        </div>
        
        <div className="space-y-8">
          {/* Goal Header with Add Investment button */}
          <div className="flex justify-between items-start">
            <GoalDetailsHeader goal={goal} />
            <Button 
              onClick={() => setShowAddInvestmentDialog(true)} 
              className="ml-4"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Investment
            </Button>
          </div>
          
          {/* Goal Progress */}
          <GoalProgressSection 
            currentAmount={goal.currentAmount}
            targetAmount={goal.targetAmount}
            progress={goal.progress}
            projectedValue={projectedValue}
            projectedPercentage={projectedPercentage}
            formatCurrency={formatCurrency}
          />
          
          {/* Key Metrics */}
          <GoalMetricsGrid 
            monthlyContribution={goal.monthlyContribution}
            expectedReturn={goal.expectedReturn}
            timeRemaining={parseInt(goal.targetDate) - new Date().getFullYear()}
            shortfall={shortfall}
            formatCurrency={formatCurrency}
          />
          
          {/* Growth Comparison Chart - Full width */}
          <div className="border rounded-lg p-4 bg-card shadow-sm">
            <h3 className="font-medium text-lg mb-2">Growth Comparison</h3>
            <div style={{ height: "300px" }}>
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
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={comparisonData} 
                    margin={{ top: 5, right: 10, bottom: 5, left: 20 }}
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
                </ResponsiveContainer>
              </ChartContainer>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Compare your actual progress with the expected growth trajectory
              </p>
            </div>
          </div>
          
          {/* Investment Tracker - Full width */}
          <GoalInvestmentsTracker 
            goalId={goal.id} 
            showAddDialog={showAddInvestmentDialog}
            setShowAddDialog={setShowAddInvestmentDialog}
            onInvestmentAdded={(amount) => {
              // Update goal current amount in local state to avoid full page refresh
              const newAmount = goal.currentAmount + amount;
              const newProgress = Math.min(100, Math.round((newAmount / goal.targetAmount) * 100));
              
              setGoal({
                ...goal,
                currentAmount: newAmount,
                progress: newProgress
              });
            }} 
          />
          
          {/* Recommendations */}
          {shortfall > 0 && (
            <GoalRecommendations 
              shortfall={shortfall}
              monthlyIncrease={Math.ceil(shortfall / calculateMonthsRemaining())}
              formatCurrency={formatCurrency}
            />
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
