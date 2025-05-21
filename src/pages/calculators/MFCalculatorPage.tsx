
import { useState } from "react";
import { TrendingUp } from "lucide-react";
import CalculatorDetailLayout from "@/components/calculators/CalculatorDetailLayout";
import MFCalculator from "@/components/calculators/MFCalculator";

const MFCalculatorPage = () => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  // Subscribe to the calculation event
  const handleCalculate = (investmentAmount: number, expectedReturn: number, years: number, investmentType: string) => {
    const data = [];
    const r = expectedReturn / 100;
    
    // Create chart data points for each year
    for (let i = 0; i <= years; i++) {
      let value;
      if (investmentType === "lumpsum") {
        value = investmentAmount * Math.pow(1 + r, i);
      } else {
        // SIP calculation
        const monthlyRate = r / 12;
        const months = i * 12;
        value = investmentAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
      }
      
      if (i % Math.max(1, Math.floor(years / 10)) === 0 || i === years) {
        data.push({
          name: `Year ${i}`,
          value: Math.round(value)
        });
      }
    }
    
    setChartData(data);
  };

  return (
    <CalculatorDetailLayout
      title="Mutual Fund Calculator"
      description="Calculate the potential returns on your mutual fund investments, both for lump sum investments and Systematic Investment Plans (SIPs)."
      icon={<TrendingUp size={24} />}
      calculatorForm={<MFCalculator onCalculate={handleCalculate} />}
      chartData={chartData}
    />
  );
};

export default MFCalculatorPage;
