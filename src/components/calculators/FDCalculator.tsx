
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface FDCalculatorProps {
  onCalculate?: (principal: number, interestRate: number, years: number) => void;
}

const FDCalculator = ({ onCalculate }: FDCalculatorProps = {}) => {
  const [principal, setPrincipal] = useState<number | ''>('');
  const [interestRate, setInterestRate] = useState<number | ''>('');
  const [years, setYears] = useState<number | ''>('');
  const [result, setResult] = useState<{ maturityAmount: number, interest: number } | null>(null);

  const calculateFD = () => {
    if (!principal || !interestRate || !years) {
      toast.error("Please enter all values");
      return;
    }

    // Simple interest for FD: P × (1 + r × t)
    const rate = Number(interestRate) / 100;
    const maturityAmount = Number(principal) * (1 + rate * Number(years));
    const interest = maturityAmount - Number(principal);
    
    setResult({
      maturityAmount: parseFloat(maturityAmount.toFixed(2)),
      interest: parseFloat(interest.toFixed(2))
    });
    
    // Call the onCalculate callback if provided
    if (onCalculate) {
      onCalculate(Number(principal), Number(interestRate), Number(years));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="principal">Principal Amount (₹)</Label>
        <Input
          id="principal"
          type="number"
          placeholder="100000"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value ? Number(e.target.value) : '')}
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
        <Label htmlFor="years">Time Period (Years)</Label>
        <Input
          id="years"
          type="number"
          step="0.01"
          placeholder="5"
          value={years}
          onChange={(e) => setYears(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <Button onClick={calculateFD} className="w-full">Calculate FD Returns</Button>

      {result && (
        <div className="bg-muted p-3 rounded-md mt-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <p className="text-sm font-medium">Interest Earned</p>
              <p className="text-xl font-bold text-primary">₹{result.interest.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Maturity Amount</p>
              <p className="text-xl font-bold text-primary">₹{result.maturityAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FDCalculator;
