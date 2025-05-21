
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const FIRECalculator = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState<number | ''>('');
  const [currentSavings, setCurrentSavings] = useState<number | ''>('');
  const [monthlySavings, setMonthlySavings] = useState<number | ''>('');
  const [expectedReturn, setExpectedReturn] = useState<number | ''>(7);
  const [inflationRate, setInflationRate] = useState<number | ''>(4);
  const [withdrawalRate, setWithdrawalRate] = useState<number | ''>(4);
  const [result, setResult] = useState<{ targetCorpus: number, yearsToFIRE: number } | null>(null);

  const calculateFIRE = () => {
    if (!monthlyExpenses || !currentSavings || !monthlySavings || 
        !expectedReturn || !inflationRate || !withdrawalRate) {
      toast.error("Please fill all fields");
      return;
    }

    // Calculate annual expenses
    const annualExpenses = Number(monthlyExpenses) * 12;
    
    // Target corpus using the 4% rule or user-defined withdrawal rate
    const targetCorpus = annualExpenses * (100 / Number(withdrawalRate));
    
    // Calculate years to FIRE
    // Real rate of return (adjusted for inflation)
    const realReturnRate = (Number(expectedReturn) - Number(inflationRate)) / 100;
    
    // Monthly savings
    const savings = Number(monthlySavings);
    
    // Current portfolio
    let portfolio = Number(currentSavings);
    
    // Calculate years until portfolio reaches target
    let years = 0;
    while (portfolio < targetCorpus && years < 100) {
      portfolio = portfolio * (1 + realReturnRate) + savings * 12;
      years++;
    }
    
    setResult({
      targetCorpus: parseFloat(targetCorpus.toFixed(0)),
      yearsToFIRE: years
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="expenses">Current Monthly Expenses (₹)</Label>
        <Input
          id="expenses"
          type="number"
          placeholder="50000"
          value={monthlyExpenses}
          onChange={(e) => setMonthlyExpenses(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="current">Current Savings/Investments (₹)</Label>
        <Input
          id="current"
          type="number"
          placeholder="1000000"
          value={currentSavings}
          onChange={(e) => setCurrentSavings(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="monthly">Monthly Savings (₹)</Label>
        <Input
          id="monthly"
          type="number"
          placeholder="25000"
          value={monthlySavings}
          onChange={(e) => setMonthlySavings(e.target.value ? Number(e.target.value) : '')}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="return">Expected Return (%)</Label>
          <Input
            id="return"
            type="number"
            step="0.1"
            placeholder="7"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value ? Number(e.target.value) : '')}
          />
        </div>
        <div>
          <Label htmlFor="inflation">Inflation (%)</Label>
          <Input
            id="inflation"
            type="number"
            step="0.1"
            placeholder="4"
            value={inflationRate}
            onChange={(e) => setInflationRate(e.target.value ? Number(e.target.value) : '')}
          />
        </div>
        <div>
          <Label htmlFor="withdrawal">Withdrawal (%)</Label>
          <Input
            id="withdrawal"
            type="number"
            step="0.1"
            placeholder="4"
            value={withdrawalRate}
            onChange={(e) => setWithdrawalRate(e.target.value ? Number(e.target.value) : '')}
          />
        </div>
      </div>

      <Button onClick={calculateFIRE} className="w-full">Calculate FIRE</Button>

      {result && (
        <div className="bg-muted p-4 rounded-md mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm font-medium">Required Corpus</p>
              <p className="text-lg font-bold text-primary">₹{result.targetCorpus.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Years to FIRE</p>
              <p className="text-lg font-bold text-primary">{result.yearsToFIRE}</p>
            </div>
          </div>
          <p className="text-xs text-center mt-2 text-muted-foreground">
            Based on {withdrawalRate}% withdrawal rate
          </p>
        </div>
      )}
    </div>
  );
};

export default FIRECalculator;
