
import { useState } from "react";
import { PiggyBank } from "lucide-react";
import CalculatorDetailLayout from "@/components/calculators/CalculatorDetailLayout";
import RDCalculator from "@/components/calculators/RDCalculator";

const RDCalculatorPage = () => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  // Subscribe to the calculation event
  const handleCalculate = (monthlyDeposit: number, interestRate: number, months: number) => {
    const data = [];
    const r = interestRate / 100 / 12; // Monthly interest rate
    const totalMonths = months;
    
    // Create chart data points
    for (let i = 0; i <= totalMonths; i += Math.max(1, Math.floor(totalMonths / 12))) {
      const P = monthlyDeposit;
      const maturityAmount = P * ((Math.pow(1 + r, i) - 1) * (1 + r)) / r;
      
      data.push({
        name: `Month ${i}`,
        value: Math.round(maturityAmount)
      });
    }
    
    // Make sure we include the final month
    if (totalMonths % 12 !== 0) {
      const P = monthlyDeposit;
      const maturityAmount = P * ((Math.pow(1 + r, totalMonths) - 1) * (1 + r)) / r;
      
      data.push({
        name: `Month ${totalMonths}`,
        value: Math.round(maturityAmount)
      });
    }
    
    setChartData(data);
  };

  return (
    <CalculatorDetailLayout
      title="Recurring Deposit Calculator"
      description="Calculate returns on your recurring deposit investments with our simple calculator. See how your monthly investments grow over time with compound interest."
      icon={<PiggyBank size={24} />}
      calculatorForm={<RDCalculator onCalculate={handleCalculate} />}
      chartData={chartData}
    />
  );
};

export default RDCalculatorPage;
