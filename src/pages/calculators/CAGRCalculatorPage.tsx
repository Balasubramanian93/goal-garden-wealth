
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import CalculatorDetailLayout from "@/components/calculators/CalculatorDetailLayout";
import CAGRCalculator from "@/components/calculators/CAGRCalculator";

const CAGRCalculatorPage = () => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  // Subscribe to the calculation event
  const handleCalculate = (initialInvestment: number, finalValue: number, years: number, cagr: number) => {
    const data = [];
    
    // Create chart data points (yearly)
    for (let i = 0; i <= years; i++) {
      const value = initialInvestment * Math.pow(1 + (cagr / 100), i);
      
      data.push({
        name: `Year ${i}`,
        value: Math.round(value)
      });
    }
    
    setChartData(data);
  };

  return (
    <CalculatorDetailLayout
      title="CAGR Calculator"
      description="Compound Annual Growth Rate (CAGR) measures the annual growth rate of an investment over a specified time period. Use our calculator to determine your investment's performance."
      icon={<TrendingUp size={24} />}
      calculatorForm={<CAGRCalculator onCalculate={handleCalculate} />}
      chartData={chartData}
    />
  );
};

export default CAGRCalculatorPage;
