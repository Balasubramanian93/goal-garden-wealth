
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, ChartPie, Star, Wallet, Calendar, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardWidgets from "@/components/dashboard/DashboardWidgets";

const Index = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      {user ? (
        // Dashboard for authenticated users
        <section className="py-6 container">
          <DashboardWidgets />
        </section>
      ) : (
        // Marketing page for non-authenticated users
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-background to-muted py-16 md:py-24">
            <div className="container flex flex-col items-center text-center gap-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tighter">
                Simplify Your{' '}
                <span className="text-primary">Financial Journey</span>
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground">
                Track investments, set financial goals, and visualize your path to financial freedom with our secure and intuitive dashboard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button size="lg" asChild>
                  <Link to="/register">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Get Started Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No credit card required • Free forever plan available
              </p>
            </div>
          </section>

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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/register">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Start Your Free Trial
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">
                    <LogIn className="mr-2 h-5 w-5" />
                    Already have an account?
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </>
      )}
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
