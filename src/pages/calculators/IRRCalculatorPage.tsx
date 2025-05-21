
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import CalculatorDetailLayout from "@/components/calculators/CalculatorDetailLayout";
import IRRCalculator from "@/components/calculators/IRRCalculator";

const IRRCalculatorPage = () => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  // Subscribe to the calculation event
  const handleCalculate = (cashflows: number[], irr: number) => {
    const data = [];
    
    // Create chart data points for each cashflow
    cashflows.forEach((cashflow, index) => {
      data.push({
        name: `Period ${index}`,
        value: cashflow
      });
    });
    
    // Add IRR value as a reference line
    if (irr !== null && !isNaN(irr)) {
      data.push({
        name: `IRR`,
        value: irr * 100 // Convert to percentage
      });
    }
    
    setChartData(data);
  };

  return (
    <CalculatorDetailLayout
      title="IRR Calculator"
      description="Calculate the Internal Rate of Return (IRR) for your investment with multiple cash flows over different time periods."
      icon={<TrendingUp size={24} />}
      calculatorForm={<IRRCalculator onCalculate={handleCalculate} />}
      chartData={chartData}
    />
  );
};

export default IRRCalculatorPage;
