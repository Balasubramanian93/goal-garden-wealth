import { useState, useEffect } from "react";
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
  ArrowRight,
  Plus
} from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { PieChart as RechartPieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useGoalsStore } from "@/store/goalsStore";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PortfolioAsset {
  id: number;
  name: string;
  type: string;
  value: number;
  gain: number;
}

const Portfolio = () => {
  const { goals, loading: goalsLoading, fetchGoals } = useGoalsStore();
  const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Calculate portfolio summary values
  const portfolioValue = portfolioAssets.reduce((sum, asset) => sum + asset.value, 0);
  const portfolioGain = portfolioAssets.reduce((sum, asset) => sum + (asset.value * asset.gain / 100), 0);
  const portfolioGainPercent = portfolioValue > 0 ? (portfolioGain / (portfolioValue - portfolioGain)) * 100 : 0;
  const isPositiveGain = portfolioGainPercent > 0;

  // Calculate asset allocation data with Emergency Fund FDs treated appropriately
  const assetTypes = [...new Set(portfolioAssets.map(asset => asset.type))];
  
  const assetAllocation = assetTypes.map((type, index) => {
    const assets = portfolioAssets.filter(asset => asset.type === type);
    const value = assets.reduce((sum, asset) => sum + asset.value, 0);
    const percentage = portfolioValue > 0 ? (value / portfolioValue) * 100 : 0;
    
    // Colors for the different asset types - added color for Emergency Fund FD
    const colors = ['#0ea5e9', '#8b5cf6', '#f97316', '#10b981', '#f43f5e', '#a855f7', '#06b6d4', '#f59e0b'];
    
    return {
      name: type,
      value: Math.round(percentage),
      color: colors[index % colors.length]
    };
  });

  // Calculate totals from goals data
  const totalGoalValue = goals.reduce((acc, goal) => acc + goal.targetAmount, 0);
  const totalCurrentValue = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
  const totalProgress = totalGoalValue > 0 ? Math.round((totalCurrentValue / totalGoalValue) * 100) : 0;
  const totalMonthlyContribution = goals.reduce((acc, goal) => acc + goal.monthlyContribution, 0);

  // Fetch portfolio assets from Supabase
  const fetchPortfolioAssets = async () => {
    try {
      setLoading(true);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        console.error("No authenticated user session found");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('portfolio_assets')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      const transformedAssets: PortfolioAsset[] = data.map(asset => ({
        id: asset.id,
        name: asset.name,
        type: asset.type,
        value: Number(asset.value),
        gain: Number(asset.gain)
      }));

      setPortfolioAssets(transformedAssets);
    } catch (error: any) {
      console.error("Error fetching portfolio assets:", error.message);
      toast.error("Failed to fetch portfolio assets");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchGoals();
    fetchPortfolioAssets();
  }, [fetchGoals]);

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
                {isPositiveGain ? '+' : ''}{portfolioGainPercent.toFixed(1)}% overall
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
              <div className="text-2xl font-bold">{assetTypes.length}</div>
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
            {goalsLoading ? (
              <div className="h-40 flex items-center justify-center">
                <p>Loading goals...</p>
              </div>
            ) : goals.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center space-y-3">
                <p className="text-muted-foreground">No goals found. Create your first goal now!</p>
                <Button asChild>
                  <Link to="/goals">
                    <Plus className="mr-2 h-4 w-4" /> Create Goal
                  </Link>
                </Button>
              </div>
            ) : (
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
            )}
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
              {loading ? (
                <div className="h-[300px] w-full flex items-center justify-center">
                  <p>Loading asset allocation...</p>
                </div>
              ) : portfolioAssets.length === 0 ? (
                <div className="h-[300px] w-full flex flex-col items-center justify-center">
                  <p className="text-muted-foreground mb-4">No portfolio assets found</p>
                  <Button onClick={() => toast.info("Portfolio asset management will be available soon!")}>
                    <Plus className="mr-2 h-4 w-4" /> Add Asset
                  </Button>
                </div>
              ) : (
                <div className="w-full h-[300px]">
                  <ChartContainer 
                    config={Object.fromEntries(
                      assetAllocation.map(item => [
                        item.name.toLowerCase().replace(/\s+/g, ''),
                        { color: item.color, label: item.name }
                      ])
                    )}
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
              )}
            </CardContent>
          </Card>

          {/* Investments List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Investments</CardTitle>
                  <CardDescription>Details of your current investments</CardDescription>
                </div>
                <Button size="sm" onClick={() => toast.info("Portfolio asset management will be available soon!")}>
                  <Plus className="mr-2 h-4 w-4" /> Add Asset
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-40 flex items-center justify-center">
                  <p>Loading investments...</p>
                </div>
              ) : portfolioAssets.length === 0 ? (
                <div className="h-40 flex items-center justify-center">
                  <p className="text-muted-foreground">No investments found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {portfolioAssets.map((asset, index) => (
                    <div key={asset.id}>
                      <div className="flex justify-between items-center mb-1">
                        <div>
                          <h3 className="font-medium">{asset.name}</h3>
                          <p className="text-xs text-muted-foreground">{asset.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{asset.value.toLocaleString()}</p>
                          <p className={`text-xs ${asset.gain > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {asset.gain > 0 ? '+' : ''}{asset.gain}%
                          </p>
                        </div>
                      </div>
                      {index < portfolioAssets.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Portfolio;
