
import { useState } from "react";
import { Calculator } from "lucide-react";
import CalculatorDetailLayout from "@/components/calculators/CalculatorDetailLayout";
import HRACalculator from "@/components/calculators/HRACalculator";

const HRACalculatorPage = () => {
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);

  // HRA typically doesn't have chart data as it's a tax calculation, 
  // but we'll create a simple comparison chart
  const handleCalculate = (basicSalary: number, hraReceived: number, rentPaid: number, metroCity: boolean) => {
    const rule1 = hraReceived;
    const rule2 = rentPaid - (0.1 * basicSalary);
    const rule3 = metroCity ? 0.5 * basicSalary : 0.4 * basicSalary;
    
    const exemptedHRA = Math.min(rule1, rule2, rule3);
    const taxableHRA = hraReceived - exemptedHRA;
    
    setChartData([
      { name: "Exempted HRA", value: Math.max(0, exemptedHRA) },
      { name: "Taxable HRA", value: Math.max(0, taxableHRA) },
      { name: "Total HRA", value: hraReceived }
    ]);
  };

  return (
    <CalculatorDetailLayout
      title="HRA Calculator"
      description="Calculate your House Rent Allowance (HRA) exemption for tax saving based on your basic salary, rent paid, and city category."
      icon={<Calculator size={24} />}
      calculatorForm={<HRACalculator onCalculate={handleCalculate} />}
      chartData={chartData}
    />
  );
};

export default HRACalculatorPage;
