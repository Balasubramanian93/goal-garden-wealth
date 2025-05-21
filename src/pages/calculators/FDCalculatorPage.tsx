
import { useState } from "react";
import { PiggyBank } from "lucide-react";
import CalculatorDetailLayout from "@/components/calculators/CalculatorDetailLayout";
import FDCalculator from "@/components/calculators/FDCalculator";

const FDCalculatorPage = () => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  // Subscribe to the calculation event
  const handleCalculate = (principal: number, interestRate: number, years: number) => {
    const data = [];
    const rate = interestRate / 100;
    
    // Create chart data points for each year
    for (let i = 0; i <= years; i++) {
      const value = principal * (1 + rate * i);
      
      data.push({
        name: `Year ${i}`,
        value: Math.round(value)
      });
    }
    
    setChartData(data);
  };

  return (
    <CalculatorDetailLayout
      title="Fixed Deposit Calculator"
      description="Calculate returns on your fixed deposit investments using our easy-to-use calculator. See how your money grows over time with fixed interest rates."
      icon={<PiggyBank size={24} />}
      calculatorForm={<FDCalculator onCalculate={handleCalculate} />}
      chartData={chartData}
    />
  );
};

export default FDCalculatorPage;
