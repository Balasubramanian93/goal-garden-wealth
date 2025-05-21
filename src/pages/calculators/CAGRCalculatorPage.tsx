
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TrendingUp } from "lucide-react";
import CalculatorDetailLayout from "@/components/calculators/CalculatorDetailLayout";

const CAGRCalculatorPage = () => {
  const [initialInvestment, setInitialInvestment] = useState<number | ''>('');
  const [finalValue, setFinalValue] = useState<number | ''>('');
  const [years, setYears] = useState<number | ''>('');
  const [result, setResult] = useState<number | null>(null);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  const calculateCAGR = () => {
    if (!initialInvestment || !finalValue || !years || years <= 0) {
      toast.error("Please enter valid values");
      return;
    }

    // CAGR formula: (Final Value / Initial Investment)^(1/years) - 1
    const cagr = (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100;
    setResult(parseFloat(cagr.toFixed(2)));
    
    // Generate chart data to show growth over years
    const newChartData = [];
    for (let i = 0; i <= Number(years); i++) {
      const yearValue = Number(initialInvestment) * Math.pow(1 + cagr/100, i);
      newChartData.push({
        name: i === 0 ? "Start" : `Year ${i}`,
        value: parseFloat(yearValue.toFixed(2))
      });
    }
    setChartData(newChartData);
  };

  const calculatorForm = (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="initial">Initial Investment (₹)</Label>
        <Input
          id="initial"
          type="number"
          placeholder="100000"
          value={initialInvestment}
          onChange={(e) => setInitialInvestment(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="final">Final Value (₹)</Label>
        <Input
          id="final"
          type="number"
          placeholder="150000"
          value={finalValue}
          onChange={(e) => setFinalValue(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="years">Number of Years</Label>
        <Input
          id="years"
          type="number"
          placeholder="5"
          value={years}
          onChange={(e) => setYears(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <Button onClick={calculateCAGR} className="w-full">Calculate CAGR</Button>

      {result !== null && (
        <div className="bg-muted p-3 rounded-md mt-4 text-center">
          <p className="text-sm font-medium">Compound Annual Growth Rate</p>
          <p className="text-2xl font-bold text-primary">{result}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            Your investment grew at {result}% per year on average
          </p>
        </div>
      )}
    </div>
  );

  return (
    <CalculatorDetailLayout
      title="CAGR Calculator"
      description="Compound Annual Growth Rate (CAGR) measures the mean annual growth rate of an investment over a specified time period. This calculator helps you understand the year-over-year growth rate of your investment."
      icon={<TrendingUp />}
      calculatorForm={calculatorForm}
      chartData={chartData}
    />
  );
};

export default CAGRCalculatorPage;
