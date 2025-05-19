
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  ChartPie, 
  Briefcase, 
  TrendingUp, 
  TrendingDown,
  BarChart2,
  PieChart,
  Target,
  ArrowRight
} from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { PieChart as RechartPieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useGoalsStore } from "@/store/goalsStore";
import { Link } from "react-router-dom";

const Portfolio = () => {
  const { goals } = useGoalsStore();
  
  // Sample portfolio data
  const portfolioValue = 1250000;
  const portfolioGain = 125000;
  const portfolioGainPercent = 11.2;
  const isPositiveGain = portfolioGainPercent > 0;

  // Sample asset allocation data
  const assetAllocation = [
    { name: 'Stocks', value: 45, color: '#0ea5e9' },
    { name: 'Mutual Funds', value: 30, color: '#8b5cf6' },
    { name: 'Gold', value: 10, color: '#f97316' },
    { name: 'Debt', value: 15, color: '#10b981' },
  ];

  // Sample investments data
  const investments = [
    {
      name: "HDFC Bank",
      type: "Stock",
      value: 250000,
      gain: 11.5,
    },
    {
      name: "Axis Blue Chip Fund",
      type: "Mutual Fund",
      value: 180000,
      gain: 15.2,
    },
    {
      name: "SBI Gold Fund",
      type: "Gold",
      value: 125000,
      gain: 8.5,
    },
    {
      name: "Govt. Bonds",
      type: "Debt",
      value: 75000,
      gain: 6.2,
    },
    {
      name: "PPF",
      type: "Debt",
      value: 120000,
      gain: 7.1,
    },
  ];

  // Calculate totals from goals data
  const totalGoalValue = goals.reduce((acc, goal) => acc + goal.targetAmount, 0);
  const totalCurrentValue = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
  const totalProgress = Math.round((totalCurrentValue / totalGoalValue) * 100);
  const totalMonthlyContribution = goals.reduce((acc, goal) => acc + goal.monthlyContribution, 0);

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Portfolio Overview</h1>
        
        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Portfolio Value
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{portfolioValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total assets under management
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Returns
              </CardTitle>
              {isPositiveGain ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{portfolioGain.toLocaleString()}</div>
              <p className={`text-xs ${isPositiveGain ? 'text-green-500' : 'text-red-500'}`}>
                {isPositiveGain ? '+' : ''}{portfolioGainPercent}% overall
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Asset Diversification
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assetAllocation.length}</div>
              <p className="text-xs text-muted-foreground">
                Asset classes in your portfolio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Goals Summary */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Financial Goals Progress</CardTitle>
                <CardDescription>Overview of your financial goals</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/goals">
                  View All Goals <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Progress: {totalProgress}%</span>
                <span>₹{(totalCurrentValue / 100000).toFixed(1)}L of ₹{(totalGoalValue / 100000).toFixed(1)}L</span>
              </div>
              <Progress value={totalProgress} className="h-2 mb-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Total Goals</h3>
                    <Target className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold mt-2">{goals.length}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Monthly Contributions</h3>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold mt-2">₹{totalMonthlyContribution.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Target Amount</h3>
                    <BarChart2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold mt-2">₹{(totalGoalValue / 10000000).toFixed(2)} Cr</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset Allocation Chart */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
              <CardDescription>Current distribution of your investments</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full h-[300px]">
                <ChartContainer 
                  config={{
                    stocks: { color: '#0ea5e9', label: 'Stocks' },
                    mutualFunds: { color: '#8b5cf6', label: 'Mutual Funds' },
                    gold: { color: '#f97316', label: 'Gold' },
                    debt: { color: '#10b981', label: 'Debt' },
                  }}
                >
                  <RechartPieChart>
                    <ChartTooltip 
                      content={<ChartTooltipContent />} 
                    />
                    <Pie
                      data={assetAllocation}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={40}
                      nameKey="name"
                      paddingAngle={2}
                    >
                      {assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartPieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Investments List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Investments</CardTitle>
              <CardDescription>Details of your current investments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investments.map((investment, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <div>
                        <h3 className="font-medium">{investment.name}</h3>
                        <p className="text-xs text-muted-foreground">{investment.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{investment.value.toLocaleString()}</p>
                        <p className={`text-xs ${investment.gain > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {investment.gain > 0 ? '+' : ''}{investment.gain}%
                        </p>
                      </div>
                    </div>
                    {index < investments.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Portfolio;
