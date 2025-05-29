
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowRight, Calendar, Flag, Home, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  progress: number;
  expectedReturn: number;
  iconType: 'Calendar' | 'Flag' | 'Target' | 'Home' | 'Briefcase';
}

interface GoalsProgressWidgetProps {
  goals: Goal[];
  isLoading: boolean;
}

const GoalsProgressWidget = ({ goals, isLoading }: GoalsProgressWidgetProps) => {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'Calendar': return Calendar;
      case 'Flag': return Flag;
      case 'Target': return Target;
      case 'Home': return Home;
      case 'Briefcase': return Briefcase;
      default: return Target;
    }
  };

  // Show top 3 goals or goals with upcoming deadlines
  const displayGoals = goals
    .slice(0, 3)
    .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());

  const totalProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)
    : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">Financial Goals</CardTitle>
          <CardDescription>
            {goals.length > 0 ? `${totalProgress}% average progress` : 'No goals set'}
          </CardDescription>
        </div>
        <Target className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-2 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : goals.length > 0 ? (
          <div className="space-y-4">
            {displayGoals.map((goal) => {
              const Icon = getIcon(goal.iconType);
              const daysToTarget = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{goal.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {daysToTarget > 0 ? `${daysToTarget} days left` : 'Overdue'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹{(goal.currentAmount / 100000).toFixed(1)}L</span>
                      <span>₹{(goal.targetAmount / 100000).toFixed(1)}L ({goal.progress}%)</span>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {goals.length > 3 && (
              <div className="text-center pt-2">
                <span className="text-xs text-muted-foreground">
                  +{goals.length - 3} more goals
                </span>
              </div>
            )}
            
            <Button asChild className="w-full mt-4" size="sm">
              <Link to="/goals">
                View All Goals <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No financial goals set yet</p>
            <Button asChild size="sm">
              <Link to="/goals">
                Create Your First Goal <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsProgressWidget;
