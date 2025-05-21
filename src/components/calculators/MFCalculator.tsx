import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toggle } from "@/components/ui/toggle";

interface MFCalculatorProps {
  onCalculate?: (investmentAmount: number, expectedReturn: number, years: number, investmentType: string) => void;
}

const MFCalculator = ({ onCalculate }: MFCalculatorProps = {}) => {
  const [investmentType, setInvestmentType] = useState<"lumpsum" | "sip">("lumpsum");
  const [amount, setAmount] = useState<number | ''>('');
  const [expectedReturn, setExpectedReturn] = useState<number | ''>('');
  const [years, setYears] = useState<number | ''>('');
  const [result, setResult] = useState<{ investedAmount: number, estimatedReturns: number, totalValue: number } | null>(null);

  const calculateReturns = () => {
    if (!amount || !expectedReturn || !years) {
      toast.error("Please enter all values");
      return;
    }

    if (investmentType === "lumpsum") {
      // Lumpsum calculation: P(1+r)^t
      const P = Number(amount);
      const r = Number(expectedReturn) / 100;
      const t = Number(years);
      
      const totalValue = P * Math.pow(1 + r, t);
      const estimatedReturns = totalValue - P;
      
      setResult({
        investedAmount: P,
        estimatedReturns: parseFloat(estimatedReturns.toFixed(2)),
        totalValue: parseFloat(totalValue.toFixed(2))
      });
      
      // Call the onCalculate callback if provided
      if (onCalculate) {
        onCalculate(P, Number(expectedReturn), t, investmentType);
      }
    } else {
      // SIP calculation
      const P = Number(amount);
      const r = Number(expectedReturn) / 100 / 12; // Monthly rate
      const n = Number(years) * 12; // Total months
      
      const investedAmount = P * n;
      const totalValue = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
      const estimatedReturns = totalValue - investedAmount;
      
      setResult({
        investedAmount: parseFloat(investedAmount.toFixed(2)),
        estimatedReturns: parseFloat(estimatedReturns.toFixed(2)),
        totalValue: parseFloat(totalValue.toFixed(2))
      });
      
      // Call the onCalculate callback if provided
      if (onCalculate) {
        onCalculate(P, Number(expectedReturn), Number(years), investmentType);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <Toggle
          pressed={investmentType === "lumpsum"}
          onPressedChange={() => setInvestmentType("lumpsum")}
          variant="outline"
        >
          Lumpsum
        </Toggle>
        <Toggle
          pressed={investmentType === "sip"}
          onPressedChange={() => setInvestmentType("sip")}
          variant="outline"
        >
          SIP
        </Toggle>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="amount">
          {investmentType === "lumpsum" ? "Investment Amount (₹)" : "Monthly SIP Amount (₹)"}
        </Label>
        <Input
          id="amount"
          type="number"
          placeholder={investmentType === "lumpsum" ? "100000" : "5000"}
          value={amount}
          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
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

      <Button onClick={calculateReturns} className="w-full">Calculate Returns</Button>

      {result && (
        <div className="bg-muted p-3 rounded-md mt-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-xs font-medium">Amount Invested</p>
              <p className="text-sm font-bold">₹{result.investedAmount.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium">Est. Returns</p>
              <p className="text-sm font-bold">₹{result.estimatedReturns.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium">Total Value</p>
              <p className="text-sm font-bold text-primary">₹{result.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MFCalculator;
