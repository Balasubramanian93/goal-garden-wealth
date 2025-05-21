
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface GoalSIPCalculatorProps {
  onCalculate?: (sipAmount: number, expectedReturn: number, years: number, targetAmount: number) => void;
}

const GoalSIPCalculator = ({ onCalculate }: GoalSIPCalculatorProps = {}) => {
  const [targetAmount, setTargetAmount] = useState<number | ''>('');
  const [expectedReturn, setExpectedReturn] = useState<number | ''>('');
  const [years, setYears] = useState<number | ''>('');
  const [sipAmount, setSipAmount] = useState<number | null>(null);

  const calculateSIP = () => {
    if (!targetAmount || !expectedReturn || !years) {
      toast.error("Please enter all values");
      return;
    }

    // Formula to calculate monthly SIP needed to reach goal: 
    // FV = P * ((1+r)^n - 1) * (1+r)/r
    // So P = FV * r / ((1+r)^n - 1) / (1+r)
    const FV = Number(targetAmount);
    const r = Number(expectedReturn) / 100 / 12; // Monthly rate
    const n = Number(years) * 12; // Total months
    
    const monthlyAmount = FV * r / ((Math.pow(1 + r, n) - 1)) / (1 + r);
    
    setSipAmount(parseFloat(monthlyAmount.toFixed(2)));
    
    // Call the onCalculate callback if provided
    if (onCalculate) {
      onCalculate(monthlyAmount, Number(expectedReturn), Number(years), FV);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="target">Target Amount (₹)</Label>
        <Input
          id="target"
          type="number"
          placeholder="1000000"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value ? Number(e.target.value) : '')}
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
        <Label htmlFor="years">Time to Goal (Years)</Label>
        <Input
          id="years"
          type="number"
          placeholder="10"
          value={years}
          onChange={(e) => setYears(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <Button onClick={calculateSIP} className="w-full">Calculate Required SIP</Button>

      {sipAmount !== null && (
        <div className="bg-primary/10 p-4 rounded-md mt-4 text-center">
          <p className="text-sm font-medium">Monthly SIP Required</p>
          <p className="text-2xl font-bold text-primary">₹{sipAmount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            To reach ₹{Number(targetAmount).toLocaleString()} in {years} years
          </p>
        </div>
      )}
    </div>
  );
};

export default GoalSIPCalculator;
