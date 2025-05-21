
import { useState } from "react";
import { Target } from "lucide-react";
import CalculatorDetailLayout from "@/components/calculators/CalculatorDetailLayout";
import GoalSIPCalculator from "@/components/calculators/GoalSIPCalculator";

const GoalSIPCalculatorPage = () => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  // Subscribe to the calculation event
  const handleCalculate = (sipAmount: number, expectedReturn: number, years: number, targetAmount: number) => {
    const data = [];
    const r = expectedReturn / 100 / 12; // Monthly rate
    
    // Create chart data points (yearly)
    for (let i = 0; i <= years; i++) {
      const months = i * 12;
      const P = sipAmount;
      const maturityValue = months === 0 ? 0 : P * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
      
      data.push({
        name: `Year ${i}`,
        value: Math.round(maturityValue)
      });
    }
    
    // Add the target amount as the last point if it's higher
    if (data.length > 0 && targetAmount > data[data.length - 1].value) {
      data.push({
        name: `Target`,
        value: targetAmount
      });
    }
    
    setChartData(data);
  };

  return (
    <CalculatorDetailLayout
      title="Goal SIP Calculator"
      description="Calculate the SIP amount required to achieve your financial goals. Enter your target amount, expected return rate, and time horizon to find the perfect SIP amount."
      icon={<Target size={24} />}
      calculatorForm={<GoalSIPCalculator onCalculate={handleCalculate} />}
      chartData={chartData}
    />
  );
};

export default GoalSIPCalculatorPage;
