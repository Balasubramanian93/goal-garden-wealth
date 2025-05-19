
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
  BarChart2
} from "lucide-react";

const Goals = () => {
  // Sample goals data
  const goals = [
    {
      id: 1,
      name: "Child's Education",
      targetAmount: 5000000,
      currentAmount: 2000000,
      targetDate: "2040",
      monthlyContribution: 15000,
      progress: 40,
      expectedReturn: 12,
      icon: <Calendar className="h-10 w-10 text-blue-500" />
    },
    {
      id: 2,
      name: "Retirement (FIRE)",
      targetAmount: 50000000,
      currentAmount: 10000000,
      targetDate: "2035",
      monthlyContribution: 75000,
      progress: 20,
      expectedReturn: 10,
      icon: <Flag className="h-10 w-10 text-green-500" />
    },
    {
      id: 3,
      name: "Dream Home",
      targetAmount: 8000000,
      currentAmount: 1200000,
      targetDate: "2028",
      monthlyContribution: 50000,
      progress: 15,
      expectedReturn: 8,
      icon: <Target className="h-10 w-10 text-purple-500" />
    }
  ];

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Financial Goals</h1>
          <Button>
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
                    {goal.icon}
                    <div>
                      <CardTitle>{goal.name}</CardTitle>
                      <CardDescription>Target: ₹{(goal.targetAmount / 100000).toFixed(1)}L by {goal.targetDate}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
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
                <Button variant="outline" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Goals;
