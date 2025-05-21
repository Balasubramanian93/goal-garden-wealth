
import { ReactNode } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface CalculatorDetailLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  calculatorForm: ReactNode;
  chartData: {
    name: string;
    value: number;
  }[];
}

const CalculatorDetailLayout = ({
  title,
  description,
  icon,
  calculatorForm,
  chartData,
}: CalculatorDetailLayoutProps) => {
  return (
    <MainLayout>
      <div className="container py-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/tools">
            <ArrowLeft size={16} />
            Back to Calculators
          </Link>
        </Button>

        <div className="flex items-center gap-2 mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 p-2.5 flex items-center justify-center text-primary">
            {icon}
          </div>
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>

        <p className="text-muted-foreground mb-8 max-w-3xl">{description}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Calculator Form */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Calculator</h2>
            {calculatorForm}
          </div>

          {/* Right column - Chart */}
          <div className="bg-card rounded-lg border p-6 overflow-hidden">
            <h2 className="text-xl font-semibold mb-4">Projected Growth</h2>
            {chartData.length > 0 ? (
              <div className="w-full h-[300px]">
                <ChartContainer
                  className="h-full"
                  config={{
                    amount: {
                      label: "Amount",
                      theme: {
                        light: "hsl(var(--primary))",
                        dark: "hsl(var(--primary))",
                      },
                    },
                  }}
                >
                  <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltipContent 
                              active={active} 
                              payload={payload} 
                              formatter={(value) => [
                                `₹${Number(value).toLocaleString()}`,
                                "Amount"
                              ]} 
                            />
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="amount"
                      stroke="hsl(var(--primary))"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                Enter values and calculate to see projection
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CalculatorDetailLayout;
