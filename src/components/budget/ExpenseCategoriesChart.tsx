
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Expense } from '@/services/budgetService';
import { TrendingUp, DollarSign } from 'lucide-react';

interface ExpenseCategoriesChartProps {
  expenses: Expense[];
  currentPeriodName: string;
}

// Modern gradient colors with better contrast
const MODERN_COLORS = [
  { base: '#6366F1', gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }, // Indigo to Violet
  { base: '#06B6D4', gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' }, // Cyan
  { base: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }, // Emerald
  { base: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }, // Amber
  { base: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }, // Red
  { base: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' }, // Violet
  { base: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)' }, // Pink
  { base: '#84CC16', gradient: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)' }, // Lime
  { base: '#F97316', gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)' }, // Orange
  { base: '#14B8A6', gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' }, // Teal
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
        color: MODERN_COLORS[index % MODERN_COLORS.length].base
      };
      return config;
    }, {} as any);
  }, [categoryData]);

  // Custom label with modern styling
  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.08) return null; // Only show label if percentage is greater than 8%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="11"
        fontWeight="700"
        style={{ 
          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom legend component
  const CustomLegend = ({ payload }: any) => {
    if (!payload || payload.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-primary/60"></div>
          <h4 className="font-semibold text-sm text-foreground">Expense Breakdown</h4>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-primary scrollbar-track-transparent">
          {categoryData.map((item, index) => (
            <div 
              key={item.category} 
              className="group flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-background to-accent/20 border border-border/50 hover:border-primary/30 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="relative w-4 h-4 rounded-full shadow-lg ring-2 ring-white/20" 
                  style={{ 
                    background: MODERN_COLORS[index % MODERN_COLORS.length].gradient,
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300"></div>
                </div>
                <span className="text-sm font-medium text-foreground truncate max-w-28 group-hover:text-primary transition-colors duration-300">
                  {item.category}
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                  ${item.amount.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (expenses.length === 0) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-background via-background to-accent/10">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
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
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="p-6 rounded-full bg-gradient-to-br from-muted to-muted/60">
              <DollarSign className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold text-muted-foreground">No expenses to display</p>
              <p className="text-sm text-muted-foreground/80">Start adding expenses to see your spending breakdown</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-background to-accent/5 hover:shadow-2xl transition-shadow duration-500">
      <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/8 to-primary/5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
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
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              ${totalExpenses.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Total Expenses
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Chart Section */}
          <div className="flex-1 p-8 bg-gradient-to-br from-background to-accent/5">
            <div className="relative min-h-[320px] lg:min-h-[380px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
                    <defs>
                      {MODERN_COLORS.map((color, index) => (
                        <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={color.base} stopOpacity={1} />
                          <stop offset="100%" stopColor={color.base} stopOpacity={0.8} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={CustomLabel}
                      outerRadius="80%"
                      innerRadius="35%"
                      fill="#8884d8"
                      dataKey="amount"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth={3}
                      animationBegin={0}
                      animationDuration={1000}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#gradient-${index % MODERN_COLORS.length})`}
                          style={{
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                          }}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={<ChartTooltipContent className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-xl" />}
                      formatter={(value: any, name: string) => [
                        `$${Number(value).toFixed(2)}`, 
                        name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              {/* Center total display */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    ${totalExpenses.toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Total Spent
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend Section */}
          <div className="lg:w-80 p-6 bg-gradient-to-br from-accent/5 to-background border-l border-border/30">
            <CustomLegend />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCategoriesChart;
