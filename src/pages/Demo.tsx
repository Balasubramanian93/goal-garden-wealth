
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { 
  ChartPie, 
  Target, 
  BarChart2,
  TrendingUp,
  ArrowRight
} from "lucide-react";

const Demo = () => {
  // Sample demo features
  const features = [
    {
      title: "Portfolio Tracking",
      description: "Track multiple asset types including stocks, mutual funds, gold, and more with real-time updates.",
      icon: <ChartPie className="h-10 w-10 text-blue-500" />,
      link: "/portfolio",
      progress: 100
    },
    {
      title: "Goal-Based Planning",
      description: "Create financial goals, calculate required SIP, and track your progress visually.",
      icon: <Target className="h-10 w-10 text-green-500" />,
      link: "/goals",
      progress: 100
    },
    {
      title: "Smart Analytics",
      description: "Visualize your asset allocation, analyze performance, and receive personalized insights.",
      icon: <BarChart2 className="h-10 w-10 text-purple-500" />,
      link: "/analytics",
      progress: 100
    }
  ];

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">WealthWise Demo</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the power of WealthWise with our interactive demo. Explore key features
            and see how we can help you achieve your financial goals.
          </p>
        </div>
        
        {/* Demo Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-center">{feature.title}</CardTitle>
                <CardDescription className="text-center">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Demo Ready</span>
                    <span>{feature.progress}%</span>
                  </div>
                  <Progress value={feature.progress} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={feature.link}>
                    Explore {feature.title} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to take control of your finances?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Sign up today and start your journey toward financial freedom with WealthWise's
            powerful tracking and planning tools.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/register">
                Create Free Account
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              <Link to="/login">
                Login to Your Account
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Features Comparison */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-4 text-left">Feature</th>
                  <th className="py-4 px-4 text-center">Free Plan</th>
                  <th className="py-4 px-4 text-center bg-blue-50">Premium Plan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4">Portfolio Tracking</td>
                  <td className="py-4 px-4 text-center">✓ Basic</td>
                  <td className="py-4 px-4 text-center bg-blue-50">✓ Advanced</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Number of Goals</td>
                  <td className="py-4 px-4 text-center">2</td>
                  <td className="py-4 px-4 text-center bg-blue-50">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Asset Types</td>
                  <td className="py-4 px-4 text-center">3 Types</td>
                  <td className="py-4 px-4 text-center bg-blue-50">All Types</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Analytics & Insights</td>
                  <td className="py-4 px-4 text-center">Basic</td>
                  <td className="py-4 px-4 text-center bg-blue-50">Advanced</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Tax Planning</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center bg-blue-50">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">AI Recommendations</td>
                  <td className="py-4 px-4 text-center">—</td>
                  <td className="py-4 px-4 text-center bg-blue-50">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Demo;
