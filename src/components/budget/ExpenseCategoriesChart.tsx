
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Expense } from '@/services/budgetService';
import { TrendingUp, DollarSign } from 'lucide-react';

interface ExpenseCategoriesChartProps {
  expenses: Expense[];
  currentPeriodName: string;
}

// Modern gradient colors with better contrast
const MODERN_COLORS = [
  '#6366F1', // Indigo
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#84CC16', // Lime
  '#F97316', // Orange
  '#14B8A6', // Teal
  '#3B82F6', // Blue
  '#F472B6', // Rose
];

const ExpenseCategoriesChart = ({ expenses, currentPeriodName }: ExpenseCategoriesChartProps) => {
  // Group expenses by category and calculate totals
  const categoryData = React.useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Other';
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount: Number(amount),
        percentage: ((amount / expenses.reduce((sum, exp) => sum + exp.amount, 0)) * 100).toFixed(1)
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const totalExpenses = React.useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const chartConfig = React.useMemo(() => {
    return categoryData.reduce((config, item, index) => {
      config[item.category] = {
        label: item.category,
        color: MODERN_COLORS[index % MODERN_COLORS.length]
      };
      return config;
    }, {} as any);
  }, [categoryData]);

  // Custom label with better visibility
  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Only show label if percentage is greater than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
        style={{ 
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (expenses.length === 0) {
    return (
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-accent/5">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 shadow-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Expense Categories
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Breakdown of your expenses by category for {currentPeriodName}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center h-60 text-center space-y-6">
            <div className="p-8 rounded-full bg-gradient-to-br from-muted/50 to-muted/30 shadow-lg">
              <DollarSign className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold text-muted-foreground mb-2">No expenses to display</p>
              <p className="text-sm text-muted-foreground/80">Start adding expenses to see your spending breakdown</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-accent/5 hover:shadow-2xl transition-shadow duration-500">
      <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/8 to-primary/5 border-b border-border/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Expense Categories
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Spending breakdown for {currentPeriodName}
              </CardDescription>
            </div>
          </div>
          <div className="text-right bg-gradient-to-br from-primary/5 to-primary/10 p-3 rounded-xl border border-primary/20">
            <div className="text-2xl font-bold text-primary">
              ${totalExpenses.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Total Expenses
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Chart and Legend Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <div className="relative h-[300px] w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {MODERN_COLORS.map((color, index) => (
                        <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={color} stopOpacity={1} />
                          <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={CustomLabel}
                      outerRadius="85%"
                      innerRadius="35%"
                      fill="#8884d8"
                      dataKey="amount"
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth={2}
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#gradient-${index % MODERN_COLORS.length})`}
                          style={{
                            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))',
                          }}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={<ChartTooltipContent className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-xl rounded-xl p-4" />}
                      formatter={(value: any, name: string) => [
                        `$${Number(value).toFixed(2)}`, 
                        name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* Legend Section */}
          <div className="lg:col-span-1">
            <div className="h-full flex flex-col">
              <h4 className="font-semibold text-base text-foreground mb-4">Categories</h4>
              <div className="space-y-3 flex-1">
                {categoryData.map((item, index) => (
                  <div 
                    key={item.category} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-card/50 to-accent/20 border border-border/30 hover:border-primary/40 hover:shadow-md transition-all duration-300"
                  >
                    <div 
                      className="w-4 h-4 rounded-full shadow-lg border-2 border-white/20 flex-shrink-0" 
                      style={{ 
                        backgroundColor: MODERN_COLORS[index % MODERN_COLORS.length],
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground text-sm truncate">
                        {item.category}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${item.amount.toFixed(2)} ({item.percentage}%)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCategoriesChart;
