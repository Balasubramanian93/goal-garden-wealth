
import { useState } from "react";
import { Flame } from "lucide-react";
import CalculatorDetailLayout from "@/components/calculators/CalculatorDetailLayout";
import FIRECalculator from "@/components/calculators/FIRECalculator";

const FIRECalculatorPage = () => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  // Subscribe to the calculation event
  const handleCalculate = (
    monthlyExpenses: number, 
    currentSavings: number, 
    monthlySavings: number, 
    expectedReturn: number, 
    inflationRate: number, 
    withdrawalRate: number,
    yearsToFIRE: number
  ) => {
    const data = [];
    const annualExpenses = monthlyExpenses * 12;
    const targetCorpus = annualExpenses * (100 / withdrawalRate);
    const realReturnRate = (expectedReturn - inflationRate) / 100;
    
    // Create chart data points (yearly)
    let portfolio = currentSavings;
    data.push({
      name: `Year 0`,
      value: Math.round(portfolio)
    });
    
    for (let i = 1; i <= yearsToFIRE; i++) {
      portfolio = portfolio * (1 + realReturnRate) + monthlySavings * 12;
      
      if (i % Math.max(1, Math.floor(yearsToFIRE / 10)) === 0 || i === yearsToFIRE) {
        data.push({
          name: `Year ${i}`,
          value: Math.round(portfolio)
        });
      }
    }
    
    // Add target corpus as a reference point
    data.push({
      name: `Target`,
      value: Math.round(targetCorpus)
    });
    
    setChartData(data);
  };

  return (
    <CalculatorDetailLayout
      title="FIRE Calculator"
      description="Financial Independence, Retire Early (FIRE) calculator helps you determine how much you need to save to achieve financial independence and potentially retire early."
      icon={<Flame size={24} />}
      calculatorForm={<FIRECalculator onCalculate={handleCalculate} />}
      chartData={chartData}
    />
  );
};

export default FIRECalculatorPage;
