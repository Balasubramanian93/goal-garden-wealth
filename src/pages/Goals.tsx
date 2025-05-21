
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Target, 
  Plus, 
  Edit,
  Flag,
  TrendingUp,
  BarChart2,
  Home,
  Briefcase,
  Loader2
} from "lucide-react";
import { GoalFormModal } from "@/components/goals/GoalFormModal";
import { useGoalsStore } from "@/store/goalsStore";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Goals = () => {
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const { goals, loading, fetchGoals } = useGoalsStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (!session) {
        toast.error("You must be logged in to view your goals");
        navigate("/login");
      } else {
        fetchGoals();
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        if (!session) {
          navigate("/login");
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, fetchGoals]);

  const renderGoalIcon = (iconType: string) => {
    switch (iconType) {
      case 'Calendar':
        return <Calendar className="h-12 w-12 text-blue-500" />;
      case 'Flag':
        return <Flag className="h-12 w-12 text-green-500" />;
      case 'Target':
        return <Target className="h-12 w-12 text-purple-500" />;
      case 'Home':
        return <Home className="h-12 w-12 text-orange-500" />;
      case 'Briefcase':
        return <Briefcase className="h-12 w-12 text-teal-500" />;
      default:
        return <Target className="h-12 w-12 text-gray-500" />;
    }
  };

  const handleEditClick = (e: React.MouseEvent, goalId: number) => {
    e.stopPropagation();
    navigate(`/goals/edit/${goalId}`);
  };
  
  const handleViewDetails = (goalId: number) => {
    navigate(`/goals/details/${goalId}`);
  };

  // If still checking authentication, show a loading state
  if (isAuthenticated === null) {
    return (
      <MainLayout>
        <div className="container py-8 flex items-center justify-center h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Financial Goals</h1>
            <p className="text-muted-foreground mt-2">Track and manage your financial aspirations</p>
          </div>
          <Button 
            onClick={() => setShowAddGoalModal(true)}
            className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-all"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" /> Add New Goal
          </Button>
        </div>
        
        {/* Goals Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-card to-background shadow-md hover:shadow-lg transition-shadow border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Total Goals
              </CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{goals.length}</div>
              <p className="text-sm text-muted-foreground mt-1">
                Active financial goals
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-background shadow-md hover:shadow-lg transition-shadow border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Monthly Contribution
              </CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ₹{goals.reduce((acc, goal) => acc + goal.monthlyContribution, 0).toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Total monthly investments
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-background shadow-md hover:shadow-lg transition-shadow border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Target Value
              </CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                <BarChart2 className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ₹{(goals.reduce((acc, goal) => acc + goal.targetAmount, 0) / 10000000).toFixed(2)} Cr
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Combined goal targets
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Individual Goals */}
        <div className="space-y-6">
          {loading ? (
            <div className="h-60 flex flex-col items-center justify-center bg-muted/30 rounded-lg">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading your goals...</p>
            </div>
          ) : goals.length === 0 ? (
            <Card className="border-dashed bg-muted/30 hover:bg-muted/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="p-5 bg-primary/10 rounded-full mb-4">
                  <Target className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-medium mb-2">No goals found</h3>
                <p className="text-muted-foreground mb-8 max-w-md text-center">Create your first financial goal to start tracking your progress towards financial freedom</p>
                <Button 
                  onClick={() => setShowAddGoalModal(true)}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-all"
                >
                  <Plus className="mr-2 h-5 w-5" /> Create First Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {goals.map((goal) => (
                <Card 
                  key={goal.id} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => handleViewDetails(goal.id)}
                >
                  <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex items-center justify-center md:border-r border-border bg-muted/30 md:w-48">
                      <div className="p-4 rounded-full bg-background">
                        {renderGoalIcon(goal.iconType)}
                      </div>
                    </div>
                    <div className="flex-1 p-0">
                      <CardHeader className="pb-2 flex flex-row items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{goal.name}</CardTitle>
                          <CardDescription className="mt-1">
                            Target: ₹{(goal.targetAmount / 100000).toFixed(1)}L by {goal.targetDate}
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleEditClick(e, goal.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-col space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{goal.progress}% Complete</span>
                              <span className="text-muted-foreground">₹{(goal.currentAmount / 100000).toFixed(1)}L of ₹{(goal.targetAmount / 100000).toFixed(1)}L</span>
                            </div>
                            <Progress 
                              value={goal.progress} 
                              className="h-2" 
                              indicatorClassName="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                            />
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm mt-4">
                            <div className="p-3 rounded-lg bg-muted/30">
                              <p className="text-muted-foreground mb-1">Monthly</p>
                              <p className="font-medium">₹{goal.monthlyContribution.toLocaleString()}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/30">
                              <p className="text-muted-foreground mb-1">Returns</p>
                              <p className="font-medium">{goal.expectedReturn}% p.a.</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/30">
                              <p className="text-muted-foreground mb-1">Timeline</p>
                              <p className="font-medium">{parseInt(goal.targetDate) - new Date().getFullYear()} years</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full hover:bg-muted/50 transition-colors"
                          onClick={() => handleViewDetails(goal.id)}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Goal Modal */}
      <GoalFormModal open={showAddGoalModal} onOpenChange={setShowAddGoalModal} />
    </MainLayout>
  );
};

export default Goals;
