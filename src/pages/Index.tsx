
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, ChartPie, Star, Wallet, TrendingUp, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBudget } from "@/hooks/useBudget";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGoalsStore } from "@/store/goalsStore";
import { useEffect } from "react";

const Index = () => {
  const { user } = useAuth();
  const { currentBudgetPeriod, currentPeriodName, isLoading: budgetLoading } = useBudget();
  const { goals, loading: goalsLoading, fetchGoals } = useGoalsStore();

  // Fetch portfolio assets
  const { data: portfolioAssets = [], isLoading: portfolioLoading } = useQuery({
    queryKey: ['portfolio-assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_assets')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Calculate portfolio values
  const portfolioValue = portfolioAssets.reduce((sum, asset) => sum + Number(asset.value), 0);
  const portfolioGain = portfolioAssets.reduce((sum, asset) => sum + (Number(asset.value) * Number(asset.gain) / 100), 0);
  const portfolioGainPercent = portfolioValue > 0 ? (portfolioGain / (portfolioValue - portfolioGain)) * 100 : 0;

  // Calculate goals totals
  const totalGoalValue = goals.reduce((acc, goal) => acc + goal.targetAmount, 0);
  const totalCurrentValue = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
  const totalProgress = totalGoalValue > 0 ? Math.round((totalCurrentValue / totalGoalValue) * 100) : 0;

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user, fetchGoals]);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
        <div className="container flex flex-col items-center text-center gap-8">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter">
            {
              user
                ? `Welcome back, ${user?.email?.split('@')[0]}!`
                : (
                    <>
                      Simplify Your{' '}
                      <span className="text-primary">Financial Journey</span>
                    </>
                  )
            }
          </h1>
          <p className="max-w-[600px] text-lg text-muted-foreground">
            {
              user
                ? `Here's a summary of your financial activity:`
                : 'Track investments, set financial goals, and visualize your path to financial freedom with our secure and intuitive dashboard.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {!user && (
              <Button size="lg" asChild>
                <Link to="/register">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button size="lg" variant="outline" asChild>
              <Link to="/demo">See Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Widgets for Authenticated Users */}
      {user && (
        <section className="py-8 container">
          <h2 className="text-2xl font-bold mb-6">Your Financial Dashboard</h2>
          
          {/* Budget and Portfolio Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Budget Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold">Budget Overview</CardTitle>
                  <CardDescription>{currentPeriodName}</CardDescription>
                </div>
                <Wallet className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {budgetLoading ? (
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  </div>
                ) : currentBudgetPeriod ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Income</span>
                      <span className="font-medium text-green-600">${currentBudgetPeriod.total_income}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Expenses</span>
                      <span className="font-medium text-red-600">${currentBudgetPeriod.total_expenses}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-sm font-medium">Remaining</span>
                      <span className={`font-bold ${currentBudgetPeriod.remaining_budget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${currentBudgetPeriod.remaining_budget}
                      </span>
                    </div>
                    <Button asChild className="w-full mt-3">
                      <Link to="/budget">
                        View Budget Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-3">No budget data for this month</p>
                    <Button asChild>
                      <Link to="/budget">
                        Set Up Budget <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Portfolio Widget */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold">Portfolio Overview</CardTitle>
                  <CardDescription>Investment Performance</CardDescription>
                </div>
                <Briefcase className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {portfolioLoading ? (
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  </div>
                ) : portfolioAssets.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Value</span>
                      <span className="font-bold text-2xl">₹{portfolioValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Returns</span>
                      <span className={`font-medium ${portfolioGainPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {portfolioGainPercent >= 0 ? '+' : ''}₹{portfolioGain.toLocaleString()} ({portfolioGainPercent.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Assets</span>
                      <span className="font-medium">{portfolioAssets.length} investments</span>
                    </div>
                    <Button asChild className="w-full mt-3">
                      <Link to="/portfolio">
                        View Portfolio <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-3">No portfolio assets found</p>
                    <Button asChild>
                      <Link to="/portfolio">
                        Add Investments <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Goals Summary */}
          {!goalsLoading && goals.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Financial Goals Progress</CardTitle>
                    <CardDescription>Overall progress towards your goals</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/goals">
                      View All Goals <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-muted-foreground">Progress: {totalProgress}%</span>
                  <span className="text-sm font-medium">₹{(totalCurrentValue / 100000).toFixed(1)}L of ₹{(totalGoalValue / 100000).toFixed(1)}L</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${Math.min(totalProgress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-3 text-sm text-muted-foreground">
                  <span>{goals.length} active goals</span>
                  <span>₹{goals.reduce((acc, goal) => acc + goal.monthlyContribution, 0).toLocaleString()}/month</span>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 container">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<ChartPie className="h-10 w-10" />}
            title="Portfolio Tracking"
            description="Track multiple asset types including stocks, mutual funds, gold, and more with real-time updates."
          />
          <FeatureCard
            icon={<Calendar className="h-10 w-10" />}
            title="Goal-Based Planning"
            description="Create financial goals, calculate required SIP, and track your progress visually."
          />
          <FeatureCard
            icon={<Star className="h-10 w-10" />}
            title="Smart Analytics"
            description="Visualize your asset allocation, analyze performance, and receive personalized insights."
          />
           <FeatureCard
            icon={<Wallet className="h-10 w-10" />}
            title="Budget Planning"
            description="Plan and track your income and expenses to stay on top of your financial health."
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-muted py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Financial Future?</h2>
          <p className="max-w-[600px] mx-auto mb-8 text-muted-foreground">
            Join thousands of users who have transformed their financial management with our platform.
          </p>
          <Button size="lg" asChild>
            <Link to="/register">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
