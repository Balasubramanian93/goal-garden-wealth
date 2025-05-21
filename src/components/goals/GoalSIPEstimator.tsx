
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GoalSIPEstimatorProps {
  targetAmount: number;
  expectedReturn: number;
  years: number;
  onCalculate?: (sipAmount: number) => void;
}

const GoalSIPEstimator = ({ 
  targetAmount, 
  expectedReturn, 
  years, 
  onCalculate 
}: GoalSIPEstimatorProps) => {
  const [sipAmount, setSipAmount] = useState<number | null>(null);

  useEffect(() => {
    if (targetAmount > 0 && expectedReturn > 0 && years > 0) {
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
        onCalculate(monthlyAmount);
      }
    }
  }, [targetAmount, expectedReturn, years, onCalculate]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  return sipAmount !== null ? (
    <div className="bg-primary/10 p-4 rounded-md mt-2 text-center">
      <p className="text-sm font-medium">Recommended Monthly SIP</p>
      <p className="text-2xl font-bold text-primary">{formatCurrency(sipAmount)}</p>
      <p className="text-xs text-muted-foreground mt-1">
        To reach {formatCurrency(targetAmount)} in {years} years
      </p>
    </div>
  ) : null;
};

export default GoalSIPEstimator;
