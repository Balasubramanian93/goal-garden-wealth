
import { useState } from "react";
import { PiggyBank } from "lucide-react";
import CalculatorDetailLayout from "@/components/calculators/CalculatorDetailLayout";
import SIPCalculator from "@/components/calculators/SIPCalculator";

const SIPCalculatorPage = () => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  // Subscribe to the calculation event
  const handleCalculate = (monthlyInvestment: number, expectedReturn: number, years: number) => {
    const data = [];
    const r = expectedReturn / 100 / 12; // Monthly rate
    const totalMonths = years * 12; // Total months
    
    // Create chart data points (yearly)
    for (let i = 0; i <= years; i++) {
      const months = i * 12;
      const P = monthlyInvestment;
      const maturityValue = months === 0 ? 0 : P * (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
      
      data.push({
        name: `Year ${i}`,
        value: Math.round(maturityValue)
      });
    }
    
    setChartData(data);
  };

  return (
    <CalculatorDetailLayout
      title="SIP Calculator"
      description="Calculate returns on your Systematic Investment Plan (SIP) with our easy-to-use calculator. See how your monthly investments can grow over time."
      icon={<PiggyBank size={24} />}
      calculatorForm={<SIPCalculator onCalculate={handleCalculate} />}
      chartData={chartData}
    />
  );
};

export default SIPCalculatorPage;
