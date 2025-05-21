
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SIPCalculatorProps {
  onCalculate?: (monthlyInvestment: number, expectedReturn: number, years: number) => void;
}

const SIPCalculator = ({ onCalculate }: SIPCalculatorProps = {}) => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | ''>('');
  const [expectedReturn, setExpectedReturn] = useState<number | ''>('');
  const [years, setYears] = useState<number | ''>('');
  const [result, setResult] = useState<{ investedAmount: number, wealthGained: number, maturityValue: number } | null>(null);

  const calculateSIP = () => {
    if (!monthlyInvestment || !expectedReturn || !years) {
      toast.error("Please enter all values");
      return;
    }

    // SIP calculation: P × (((1 + r)^n - 1) / r) × (1 + r)
    const P = Number(monthlyInvestment);
    const r = Number(expectedReturn) / 100 / 12; // Monthly rate
    const n = Number(years) * 12; // Total months
    
    const investedAmount = P * n;
    const maturityValue = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    const wealthGained = maturityValue - investedAmount;
    
    setResult({
      investedAmount: parseFloat(investedAmount.toFixed(2)),
      wealthGained: parseFloat(wealthGained.toFixed(2)),
      maturityValue: parseFloat(maturityValue.toFixed(2))
    });
    
    // Call the onCalculate callback if provided
    if (onCalculate) {
      onCalculate(P, Number(expectedReturn), Number(years));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="monthly">Monthly Investment (₹)</Label>
        <Input
          id="monthly"
          type="number"
          placeholder="5000"
          value={monthlyInvestment}
          onChange={(e) => setMonthlyInvestment(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="return">Expected Return (% p.a.)</Label>
        <Input
          id="return"
          type="number"
          step="0.1"
          placeholder="12"
          value={expectedReturn}
          onChange={(e) => setExpectedReturn(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="years">Investment Period (Years)</Label>
        <Input
          id="years"
          type="number"
          placeholder="10"
          value={years}
          onChange={(e) => setYears(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <Button onClick={calculateSIP} className="w-full">Calculate SIP Returns</Button>

      {result && (
        <div className="bg-muted p-3 rounded-md mt-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-xs font-medium">Amount Invested</p>
              <p className="text-sm font-bold">₹{result.investedAmount.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium">Wealth Gained</p>
              <p className="text-sm font-bold">₹{result.wealthGained.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium">Expected Value</p>
              <p className="text-sm font-bold text-primary">₹{result.maturityValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SIPCalculator;
