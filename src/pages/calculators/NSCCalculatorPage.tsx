
import { useState } from "react";
import { PiggyBank } from "lucide-react";
import CalculatorDetailLayout from "@/components/calculators/CalculatorDetailLayout";
import NSCCalculator from "@/components/calculators/NSCCalculator";

const NSCCalculatorPage = () => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  // Subscribe to the calculation event
  const handleCalculate = (principal: number, interestRate: number) => {
    const data = [];
    const r = interestRate / 100;
    const n = 5; // NSC is for 5 years
    
    // Create chart data points for each year
    for (let i = 0; i <= n; i++) {
      const maturityAmount = principal * Math.pow(1 + r, i);
      
      data.push({
        name: `Year ${i}`,
        value: Math.round(maturityAmount)
      });
    }
    
    setChartData(data);
  };

  return (
    <CalculatorDetailLayout
      title="NSC Calculator"
      description="National Savings Certificate (NSC) calculator helps you estimate returns on your NSC investment over the 5-year term with compounded interest."
      icon={<PiggyBank size={24} />}
      calculatorForm={<NSCCalculator onCalculate={handleCalculate} />}
      chartData={chartData}
    />
  );
};

export default NSCCalculatorPage;
