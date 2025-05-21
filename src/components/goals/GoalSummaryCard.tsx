
import { Progress } from "@/components/ui/progress";

interface GoalSummaryCardProps {
  title: string;
  amount: number;
  targetAmount: number;
  percentage: number;
  colorClass: string;
}

export function GoalSummaryCard({ title, amount, targetAmount, percentage, colorClass }: GoalSummaryCardProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    } else {
      return `₹${amount.toLocaleString()}`;
    }
  };

  return (
    <div className="space-y-3 bg-card p-5 rounded-lg shadow-sm border">
      <h3 className="font-medium text-lg">{title}</h3>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-semibold">{percentage}%</p>
          <p className="text-sm text-muted-foreground">Complete</p>
        </div>
        <div className="text-right">
          <p className="font-medium">{formatCurrency(amount)}</p>
          <p className="text-sm text-muted-foreground">of {formatCurrency(targetAmount)}</p>
        </div>
      </div>
      <Progress value={percentage} className="h-2.5">
        <div 
          className={`h-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </Progress>
    </div>
  );
}
