
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SSYCalculator = () => {
  const [yearlyInvestment, setYearlyInvestment] = useState<number | ''>('');
  const [interestRate, setInterestRate] = useState<number | ''>(7.6); // Current SSY rate
  const [result, setResult] = useState<{ 
    totalInvestment: number, 
    totalInterest: number, 
    maturityAmount: number 
  } | null>(null);

  const calculateSSY = () => {
    if (!yearlyInvestment) {
      toast.error("Please enter yearly investment amount");
      return;
    }

    if (Number(yearlyInvestment) > 150000) {
      toast.error("Maximum yearly investment in SSY is ₹1,50,000");
      return;
    }

    // SSY is for 15 years, with investments for first 15 years
    // and maturity after 21 years
    const yearlyAmount = Number(yearlyInvestment);
    const rate = Number(interestRate) / 100;
    const totalInvestment = yearlyAmount * 15;
    
    // Calculate maturity amount with compound interest
    let maturityAmount = 0;
    
    // Add each year's deposit with compound interest until maturity
    for (let year = 1; year <= 15; year++) {
      const yearsToMaturity = 21 - year + 1;
      maturityAmount += yearlyAmount * Math.pow(1 + rate, yearsToMaturity - 1);
    }
    
    const totalInterest = maturityAmount - totalInvestment;
    
    setResult({
      totalInvestment: parseFloat(totalInvestment.toFixed(2)),
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      maturityAmount: parseFloat(maturityAmount.toFixed(2))
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="yearly">Yearly Investment (₹)</Label>
        <Input
          id="yearly"
          type="number"
          placeholder="50000"
          max={150000}
          value={yearlyInvestment}
          onChange={(e) => setYearlyInvestment(e.target.value ? Number(e.target.value) : '')}
        />
        <p className="text-xs text-muted-foreground">Maximum ₹1,50,000 per year</p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="rate">Interest Rate (% p.a.)</Label>
        <Input
          id="rate"
          type="number"
          step="0.1"
          placeholder="7.6"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value ? Number(e.target.value) : '')}
          disabled
        />
        <p className="text-xs text-muted-foreground">Current SSY rate is 7.6%</p>
      </div>

      <Button onClick={calculateSSY} className="w-full">Calculate SSY Returns</Button>

      {result && (
        <div className="bg-muted p-3 rounded-md mt-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-xs font-medium">Total Investment</p>
              <p className="text-sm font-bold">₹{result.totalInvestment.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium">Total Interest</p>
              <p className="text-sm font-bold">₹{result.totalInterest.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium">Maturity Value</p>
              <p className="text-sm font-bold text-primary">₹{result.maturityAmount.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-xs text-center mt-3 text-muted-foreground">
            After 21 years (15 years deposit + 6 years interest)
          </p>
        </div>
      )}
    </div>
  );
};

export default SSYCalculator;
