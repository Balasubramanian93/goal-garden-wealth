
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface RDCalculatorProps {
  onCalculate?: (monthlyDeposit: number, interestRate: number, months: number) => void;
}

const RDCalculator = ({ onCalculate }: RDCalculatorProps = {}) => {
  const [monthlyDeposit, setMonthlyDeposit] = useState<number | ''>('');
  const [interestRate, setInterestRate] = useState<number | ''>('');
  const [months, setMonths] = useState<number | ''>('');
  const [result, setResult] = useState<{ maturityAmount: number, totalDeposit: number, interest: number } | null>(null);

  const calculateRD = () => {
    if (!monthlyDeposit || !interestRate || !months) {
      toast.error("Please enter all values");
      return;
    }

    // RD calculation: P × [(1 + r/n)^(n*t) - 1] × (1 + r/n)/(r/n)
    // For monthly deposit, n=1 (compounded monthly)
    const r = Number(interestRate) / 100 / 12; // Monthly interest rate
    const t = Number(months);
    const P = Number(monthlyDeposit);
    
    const totalDeposit = P * t;
    const maturityAmount = P * ((Math.pow(1 + r, t) - 1) * (1 + r)) / r;
    const interest = maturityAmount - totalDeposit;
    
    setResult({
      maturityAmount: parseFloat(maturityAmount.toFixed(2)),
      totalDeposit: parseFloat(totalDeposit.toFixed(2)),
      interest: parseFloat(interest.toFixed(2))
    });
    
    // Call the onCalculate callback if provided
    if (onCalculate) {
      onCalculate(P, Number(interestRate), t);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="monthly">Monthly Deposit (₹)</Label>
        <Input
          id="monthly"
          type="number"
          placeholder="5000"
          value={monthlyDeposit}
          onChange={(e) => setMonthlyDeposit(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="rate">Interest Rate (% p.a.)</Label>
        <Input
          id="rate"
          type="number"
          step="0.01"
          placeholder="6.5"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="months">Time Period (Months)</Label>
        <Input
          id="months"
          type="number"
          placeholder="60"
          value={months}
          onChange={(e) => setMonths(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <Button onClick={calculateRD} className="w-full">Calculate RD Returns</Button>

      {result && (
        <div className="bg-muted p-3 rounded-md mt-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-xs font-medium">Total Deposit</p>
              <p className="text-sm font-bold">₹{result.totalDeposit.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium">Interest</p>
              <p className="text-sm font-bold">₹{result.interest.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium">Total Value</p>
              <p className="text-sm font-bold text-primary">₹{result.maturityAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RDCalculator;
