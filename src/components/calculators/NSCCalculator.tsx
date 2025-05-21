
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface NSCCalculatorProps {
  onCalculate?: (principal: number, interestRate: number) => void;
}

const NSCCalculator = ({ onCalculate }: NSCCalculatorProps = {}) => {
  const [principal, setPrincipal] = useState<number | ''>('');
  const [interestRate, setInterestRate] = useState<number | ''>(7.7); // Current NSC rate
  const [result, setResult] = useState<{ maturityAmount: number, totalInterest: number } | null>(null);

  const calculateNSC = () => {
    if (!principal) {
      toast.error("Please enter investment amount");
      return;
    }

    // NSC compounds annually for 5 years
    const P = Number(principal);
    const r = Number(interestRate) / 100;
    const n = 5; // NSC is for 5 years
    
    // Calculate maturity amount using compound interest: P(1+r)^n
    const maturityAmount = P * Math.pow(1 + r, n);
    const totalInterest = maturityAmount - P;
    
    setResult({
      maturityAmount: parseFloat(maturityAmount.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2))
    });
    
    // Call the onCalculate callback if provided
    if (onCalculate) {
      onCalculate(P, Number(interestRate));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="principal">Investment Amount (₹)</Label>
        <Input
          id="principal"
          type="number"
          placeholder="10000"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="rate">Interest Rate (% p.a.)</Label>
        <Input
          id="rate"
          type="number"
          step="0.1"
          placeholder="7.7"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value ? Number(e.target.value) : '')}
          disabled
        />
        <p className="text-xs text-muted-foreground">Current NSC IX issue rate is 7.7%</p>
      </div>

      <Button onClick={calculateNSC} className="w-full">Calculate NSC Returns</Button>

      {result && (
        <div className="bg-muted p-3 rounded-md mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm font-medium">Interest Earned</p>
              <p className="text-xl font-bold">₹{result.totalInterest.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Maturity Value</p>
              <p className="text-xl font-bold text-primary">₹{result.maturityAmount.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-xs text-center mt-3 text-muted-foreground">
            After 5 years with compounding interest
          </p>
        </div>
      )}
    </div>
  );
};

export default NSCCalculator;
