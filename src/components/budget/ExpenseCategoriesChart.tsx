
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Expense } from '@/services/budgetService';

interface ExpenseCategoriesChartProps {
  expenses: Expense[];
  currentPeriodName: string;
}

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F43F5E', // Rose
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

  const chartConfig = React.useMemo(() => {
    return categoryData.reduce((config, item, index) => {
      config[item.category] = {
        label: item.category,
        color: COLORS[index % COLORS.length]
      };
      return config;
    }, {} as any);
  }, [categoryData]);

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    // Only show label if percentage is greater than 5%
    if (percent < 0.05) return null;
    
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
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
          <CardDescription>Breakdown of your expenses by category for {currentPeriodName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No expenses to display
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
        <CardDescription>Breakdown of your expenses by category for {currentPeriodName}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart Container - Improved sizing */}
          <div className="flex-1 min-h-[300px] lg:min-h-[320px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={CustomLabel}
                    outerRadius="85%"
                    fill="#8884d8"
                    dataKey="amount"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={2}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: any, name: string) => [
                      `$${Number(value).toFixed(2)}`, 
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Legend - Better organized */}
          <div className="lg:w-64 space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Categories</h4>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {categoryData.map((item, index) => (
                <div 
                  key={item.category} 
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-foreground truncate max-w-24">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold text-foreground">
                      ${item.amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCategoriesChart;
