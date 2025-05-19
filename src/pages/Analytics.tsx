
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChartPie, 
  BarChart2,  
  Calendar,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { 
  ChartContainer, 
  ChartLegend,
  ChartLegendContent,
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";

const Analytics = () => {
  // Sample performance data
  const performanceData = [
    { month: 'Jan', portfolio: 1050000, benchmark: 1045000 },
    { month: 'Feb', portfolio: 1075000, benchmark: 1060000 },
    { month: 'Mar', portfolio: 1090000, benchmark: 1070000 },
    { month: 'Apr', portfolio: 1110000, benchmark: 1085000 },
    { month: 'May', portfolio: 1130000, benchmark: 1095000 },
    { month: 'Jun', portfolio: 1170000, benchmark: 1120000 },
    { month: 'Jul', portfolio: 1200000, benchmark: 1140000 },
    { month: 'Aug', portfolio: 1220000, benchmark: 1160000 },
    { month: 'Sep', portfolio: 1250000, benchmark: 1180000 },
  ];

  // Sample asset allocation data
  const assetAllocation = [
    { name: 'Stocks', value: 45, color: '#0ea5e9' },
    { name: 'Mutual Funds', value: 30, color: '#8b5cf6' },
    { name: 'Gold', value: 10, color: '#f97316' },
    { name: 'Debt', value: 15, color: '#10b981' },
  ];

  // Sample monthly investments data
  const monthlyInvestments = [
    { month: 'Jan', amount: 25000 },
    { month: 'Feb', amount: 25000 },
    { month: 'Mar', amount: 30000 },
    { month: 'Apr', amount: 30000 },
    { month: 'May', amount: 30000 },
    { month: 'Jun', amount: 35000 },
    { month: 'Jul', amount: 35000 },
    { month: 'Aug', amount: 35000 },
    { month: 'Sep', amount: 40000 },
  ];

  // Sample metrics
  const metrics = [
    {
      title: "CAGR",
      value: "15.2%",
      description: "Compound Annual Growth Rate",
      icon: <TrendingUp className="h-4 w-4 text-green-500" />
    },
    {
      title: "Alpha",
      value: "3.5%",
      description: "Outperformance vs market",
      icon: <TrendingUp className="h-4 w-4 text-green-500" />
    },
    {
      title: "Sharpe Ratio",
      value: "1.8",
      description: "Risk-adjusted returns",
      icon: <BarChart2 className="h-4 w-4 text-blue-500" />
    },
    {
      title: "Max Drawdown",
      value: "-8.2%",
      description: "Largest portfolio decline",
      icon: <TrendingDown className="h-4 w-4 text-red-500" />
    },
  ];

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Analytics & Insights</h1>
        
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                {metric.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Chart Tabs */}
        <Tabs defaultValue="performance" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="performance">Portfolio Performance</TabsTrigger>
            <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
            <TabsTrigger value="investments">Monthly Investments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio vs Benchmark</CardTitle>
                <CardDescription>Compare your portfolio against market benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer
                    config={{
                      portfolio: { color: '#8b5cf6', label: 'Portfolio' },
                      benchmark: { color: '#94a3b8', label: 'Benchmark' },
                    }}
                  >
                    <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="portfolio" 
                        name="Portfolio" 
                        stroke="#8b5cf6" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="benchmark" 
                        name="Benchmark" 
                        stroke="#94a3b8" 
                        strokeDasharray="5 5"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="allocation">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Current distribution of your investments</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="w-full h-[400px]">
                  <ChartContainer 
                    config={{
                      stocks: { color: '#0ea5e9', label: 'Stocks' },
                      mutualFunds: { color: '#8b5cf6', label: 'Mutual Funds' },
                      gold: { color: '#f97316', label: 'Gold' },
                      debt: { color: '#10b981', label: 'Debt' },
                    }}
                  >
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie
                        data={assetAllocation}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        innerRadius={60}
                        nameKey="name"
                        paddingAngle={2}
                        label={(entry) => `${entry.name}: ${entry.value}%`}
                      >
                        {assetAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartLegend verticalAlign="bottom" content={<ChartLegendContent />} />
                    </PieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="investments">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Investments</CardTitle>
                <CardDescription>Track your contributions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer
                    config={{
                      amount: { color: '#10b981', label: 'Investment Amount' },
                    }}
                  >
                    <BarChart data={monthlyInvestments} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="amount" name="Investment" fill="#10b981" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Insights and Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
            <CardDescription>AI-powered analysis of your financial portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Portfolio Analysis</h3>
                <p className="text-blue-700">
                  Your portfolio is currently overweight in stocks (45%) compared to your risk profile (target: 40%). 
                  Consider rebalancing by increasing allocation to debt instruments.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                <h3 className="text-lg font-medium text-green-800 mb-2">Goal Progress</h3>
                <p className="text-green-700">
                  You're on track to meet your "Child's Education" goal. However, your "Retirement" goal is currently projected 
                  to fall short by 15%. Consider increasing your monthly SIP by ₹15,000.
                </p>
              </div>
              
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <h3 className="text-lg font-medium text-amber-800 mb-2">Tax Efficiency</h3>
                <p className="text-amber-700">
                  You could save approximately ₹45,000 in taxes by reallocating ₹1,50,000 from your savings 
                  account to tax-saving instruments like ELSS or PPF.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Analytics;
