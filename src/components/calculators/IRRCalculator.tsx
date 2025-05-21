import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash } from "lucide-react";

type Cashflow = {
  amount: number;
  year: number;
};

interface IRRCalculatorProps {
  onCalculate?: (cashflows: number[], irr: number) => void;
}

const IRRCalculator = ({ onCalculate }: IRRCalculatorProps = {}) => {
  const [initialInvestment, setInitialInvestment] = useState<number | ''>('');
  const [cashflows, setCashflows] = useState<Cashflow[]>([{ amount: 0, year: 1 }]);
  const [irr, setIrr] = useState<number | null>(null);

  const addCashflow = () => {
    const lastYear = cashflows.length > 0 ? cashflows[cashflows.length - 1].year + 1 : 1;
    setCashflows([...cashflows, { amount: 0, year: lastYear }]);
  };

  const removeCashflow = (index: number) => {
    if (cashflows.length > 1) {
      const newCashflows = [...cashflows];
      newCashflows.splice(index, 1);
      setCashflows(newCashflows);
    }
  };

  const updateCashflow = (index: number, value: number) => {
    const newCashflows = [...cashflows];
    newCashflows[index].amount = value;
    setCashflows(newCashflows);
  };

  const calculateIRR = () => {
    if (!initialInvestment || cashflows.some(cf => cf.amount === 0)) {
      toast.error("Please enter all values");
      return;
    }

    // Newton-Raphson method to find IRR
    // IRR is the rate where NPV = 0
    // NPV = -initialInvestment + sum(cashflow_i / (1+r)^year_i)
    
    const guess = 0.1; // 10% initial guess
    const maxIterations = 100;
    const tolerance = 0.0001;
    
    let rate = guess;
    
    for (let i = 0; i < maxIterations; i++) {
      let npv = -Number(initialInvestment);
      let derivativeNpv = 0;
      
      // Calculate NPV and its derivative at current rate
      cashflows.forEach(cf => {
        const factor = Math.pow(1 + rate, cf.year);
        npv += cf.amount / factor;
        derivativeNpv -= (cf.year * cf.amount) / (factor * (1 + rate));
      });
      
      // Newton-Raphson formula: x_{n+1} = x_n - f(x_n) / f'(x_n)
      const newRate = rate - npv / derivativeNpv;
      
      // Check if converged
      if (Math.abs(newRate - rate) < tolerance) {
        setIrr(newRate * 100);
        
        // Call the onCalculate callback if provided
        if (onCalculate) {
          // Convert cashflows array to just numbers for the chart
          const cashflowValues = [-Number(initialInvestment), ...cashflows.map(cf => cf.amount)];
          onCalculate(cashflowValues, newRate * 100);
        }
        
        return;
      }
      
      rate = newRate;
    }
    
    toast.error("IRR calculation did not converge. Try different values.");
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="initialInvestment">Initial Investment (₹)</Label>
        <Input
          id="initialInvestment"
          type="number"
          placeholder="100000"
          value={initialInvestment}
          onChange={(e) => setInitialInvestment(e.target.value ? Number(e.target.value) : '')}
        />
        <p className="text-xs text-muted-foreground">Enter as a positive number</p>
      </div>

      <div className="space-y-3">
        <Label>Cash Inflows</Label>
        {cashflows.map((cf, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-12 shrink-0">
              <p className="text-xs text-muted-foreground">Year {cf.year}</p>
            </div>
            <Input
              type="number"
              value={cf.amount || ''}
              onChange={(e) => updateCashflow(index, e.target.value ? Number(e.target.value) : 0)}
              placeholder="Amount"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeCashflow(index)}
              disabled={cashflows.length <= 1}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addCashflow}>
          Add Year
        </Button>
      </div>

      <Button onClick={calculateIRR} className="w-full">Calculate IRR</Button>

      {irr !== null && (
        <div className="bg-primary/10 p-4 rounded-md mt-4 text-center">
          <p className="text-sm font-medium">Internal Rate of Return</p>
          <p className="text-2xl font-bold text-primary">{irr.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default IRRCalculator;
