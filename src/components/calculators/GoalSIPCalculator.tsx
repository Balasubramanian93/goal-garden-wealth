
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

interface GoalSIPCalculatorProps {
  onCalculate?: (sipAmount: number, expectedReturn: number, years: number, targetAmount: number) => void;
}

const GoalSIPCalculator = ({ onCalculate }: GoalSIPCalculatorProps = {}) => {
  const [targetAmount, setTargetAmount] = useState<number | ''>('');
  const [currentAmount, setCurrentAmount] = useState<number | ''>('');
  const [expectedReturn, setExpectedReturn] = useState<number | ''>('');
  const [years, setYears] = useState<number>(5);
  const [sipAmount, setSipAmount] = useState<number | null>(null);

  const calculateSIP = () => {
    if (!targetAmount || !expectedReturn) {
      toast.error("Please enter all required values");
      return;
    }

    // Convert annual rate to monthly rate
    const monthlyRate = Number(expectedReturn) / 100 / 12;
    const months = years * 12;
    
    // First calculate what the current amount will grow to
    const currentAmountValue = Number(currentAmount) || 0;
    const currentAmountFuture = currentAmountValue * Math.pow(1 + monthlyRate, months);
    
    // Determine how much more we need from monthly SIPs
    const remainingTarget = Math.max(0, Number(targetAmount) - currentAmountFuture);
    
    // If target is already reached with current amount's growth
    if (remainingTarget <= 0) {
      setSipAmount(0);
      if (onCalculate) {
        onCalculate(0, Number(expectedReturn), years, Number(targetAmount));
      }
      return;
    }
    
    // Formula to calculate monthly SIP needed to reach goal: 
    // FV = P * ((1+r)^n - 1) * (1+r)/r  =>  P = FV * r / ((1+r)^n - 1)
    const FV = remainingTarget;
    
    const monthlyAmount = FV * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
    
    setSipAmount(parseFloat(monthlyAmount.toFixed(2)));
    
    // Call the onCalculate callback if provided
    if (onCalculate) {
      onCalculate(monthlyAmount, Number(expectedReturn), years, Number(targetAmount));
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
        <Label htmlFor="current">Current Amount (₹) (Optional)</Label>
        <Input
          id="current"
          type="number"
          placeholder="100000"
          value={currentAmount}
          onChange={(e) => setCurrentAmount(e.target.value ? Number(e.target.value) : '')}
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
        <Label htmlFor="years">Time to Goal: {years} Years</Label>
        <Slider
          defaultValue={[5]}
          max={50}
          step={1}
          value={[years]}
          onValueChange={(value) => setYears(value[0])}
        />
      </div>

      <Button onClick={calculateSIP} className="w-full">Calculate Required SIP</Button>

      {sipAmount !== null && (
        <div className="bg-primary/10 p-4 rounded-md mt-4 text-center">
          <p className="text-sm font-medium">Monthly SIP Required</p>
          <p className="text-2xl font-bold text-primary">₹{sipAmount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            To reach ₹{Number(targetAmount).toLocaleString()} in {years} years
            {Number(currentAmount) > 0 ? ` (including current investment of ₹${Number(currentAmount).toLocaleString()})` : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default GoalSIPCalculator;
