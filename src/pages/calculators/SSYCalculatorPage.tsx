import { useState } from "react";
import { PiggyBank } from "lucide-react";
import CalculatorDetailLayout from "@/components/calculators/CalculatorDetailLayout";
import SSYCalculator from "@/components/calculators/SSYCalculator";

const SSYCalculatorPage = () => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  // Subscribe to the calculation event
  const handleCalculate = (yearlyDeposit: number, interestRate: number) => {
    const data = [];
    const r = interestRate / 100;
    const n = 21; // SSY is typically for 21 years
    
    let balance = 0;
    // Create chart data points for each year (show the first 15 years of deposit)
    for (let i = 0; i <= n; i++) {
      // Only add deposit for first 15 years
      if (i <= 15) {
        balance += yearlyDeposit;
      }
      
      // Calculate interest
      if (i > 0) {
        balance += balance * r;
      }
      
      // Only show data every 3 years to keep chart clean
      if (i % 3 === 0 || i === n || i === 15) {
        data.push({
          name: `Year ${i}`,
          value: Math.round(balance)
        });
      }
    }
    
    setChartData(data);
  };

  return (
    <CalculatorDetailLayout
      title="SSY Calculator"
      description="Sukanya Samriddhi Yojana (SSY) calculator helps you estimate returns on your investment for your girl child over the 21-year term."
      icon={<PiggyBank size={24} />}
      calculatorForm={<SSYCalculator onCalculate={handleCalculate} />}
      chartData={chartData}
    />
  );
};

export default SSYCalculatorPage;
