
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface PortfolioOverviewWidgetProps {
  portfolioAssets: any[];
  isLoading: boolean;
}

const PortfolioOverviewWidget = ({ portfolioAssets, isLoading }: PortfolioOverviewWidgetProps) => {
  const portfolioValue = portfolioAssets.reduce((sum, asset) => sum + Number(asset.value), 0);
  const portfolioGain = portfolioAssets.reduce((sum, asset) => sum + (Number(asset.value) * Number(asset.gain) / 100), 0);
  const portfolioGainPercent = portfolioValue > 0 ? (portfolioGain / (portfolioValue - portfolioGain)) * 100 : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">Portfolio</CardTitle>
          <CardDescription>Investment Performance</CardDescription>
        </div>
        <Briefcase className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          </div>
        ) : portfolioAssets.length > 0 ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Value</span>
              <span className="font-bold text-xl">₹{portfolioValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Returns</span>
              <span className={`font-medium ${portfolioGainPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioGainPercent >= 0 ? '+' : ''}₹{portfolioGain.toLocaleString()} ({portfolioGainPercent.toFixed(1)}%)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Assets</span>
              <span className="font-medium">{portfolioAssets.length}</span>
            </div>
            <Button asChild className="w-full mt-3" size="sm">
              <Link to="/portfolio">
                View Portfolio <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-3">No investments found</p>
            <Button asChild size="sm">
              <Link to="/portfolio">
                Add Investments <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioOverviewWidget;
