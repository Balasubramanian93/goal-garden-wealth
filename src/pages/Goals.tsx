
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Target, 
  Plus, 
  Edit,
  Flag,
  TrendingUp,
  BarChart2,
  Home,
  Briefcase
} from "lucide-react";
import { GoalFormModal } from "@/components/goals/GoalFormModal";
import { GoalDetails } from "@/components/goals/GoalDetails";
import { useGoalsStore } from "@/store/goalsStore";

const Goals = () => {
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  const { goals } = useGoalsStore();

  const renderGoalIcon = (iconType: string) => {
    switch (iconType) {
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

  const handleEditClick = (e: React.MouseEvent, goalId: number) => {
    e.stopPropagation();
    setSelectedGoalId(goalId);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Financial Goals</h1>
          <Button onClick={() => setShowAddGoalModal(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Goal
          </Button>
        </div>
        
        {/* Goals Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Goals
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goals.length}</div>
              <p className="text-xs text-muted-foreground">
                Active financial goals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Contribution
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{goals.reduce((acc, goal) => acc + goal.monthlyContribution, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Total monthly investments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Target Value
              </CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{(goals.reduce((acc, goal) => acc + goal.targetAmount, 0) / 10000000).toFixed(2)} Cr
              </div>
              <p className="text-xs text-muted-foreground">
                Combined goal targets
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Individual Goals */}
        <div className="space-y-6">
          {goals.map((goal) => (
            <Card key={goal.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="flex gap-4">
                    {renderGoalIcon(goal.iconType)}
                    <div>
                      <CardTitle>{goal.name}</CardTitle>
                      <CardDescription>Target: ₹{(goal.targetAmount / 100000).toFixed(1)}L by {goal.targetDate}</CardDescription>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => handleEditClick(e, goal.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress: {goal.progress}%</span>
                      <span>₹{(goal.currentAmount / 100000).toFixed(1)}L of ₹{(goal.targetAmount / 100000).toFixed(1)}L</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Monthly Contribution</p>
                      <p className="font-medium">₹{goal.monthlyContribution.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expected Return</p>
                      <p className="font-medium">{goal.expectedReturn}% p.a.</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time Remaining</p>
                      <p className="font-medium">{parseInt(goal.targetDate) - new Date().getFullYear()} years</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedGoalId(goal.id)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Goal Modal */}
      <GoalFormModal open={showAddGoalModal} onOpenChange={setShowAddGoalModal} />
      
      {/* Goal Details Modal */}
      {selectedGoalId !== null && (
        <GoalDetails 
          goalId={selectedGoalId} 
          open={selectedGoalId !== null} 
          onOpenChange={(open) => !open && setSelectedGoalId(null)} 
        />
      )}
    </MainLayout>
  );
};

export default Goals;
