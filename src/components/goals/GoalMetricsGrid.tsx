
interface GoalMetricsGridProps {
  monthlyContribution: number;
  expectedReturn: number;
  timeRemaining: number;
  shortfall: number;
  formatCurrency: (amount: number) => string;
}

export function GoalMetricsGrid({ 
  monthlyContribution, 
  expectedReturn, 
  timeRemaining, 
  shortfall,
  formatCurrency 
}: GoalMetricsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 rounded-lg bg-card shadow-sm border">
        <p className="text-sm text-muted-foreground">Monthly Contribution</p>
        <p className="font-medium">{formatCurrency(monthlyContribution)}</p>
      </div>
      <div className="p-4 rounded-lg bg-card shadow-sm border">
        <p className="text-sm text-muted-foreground">Expected Return</p>
        <p className="font-medium">{expectedReturn}% p.a.</p>
      </div>
      <div className="p-4 rounded-lg bg-card shadow-sm border">
        <p className="text-sm text-muted-foreground">Time Remaining</p>
        <p className="font-medium">{timeRemaining} years</p>
      </div>
      <div className="p-4 rounded-lg bg-card shadow-sm border">
        <p className="text-sm text-muted-foreground">Projected Shortfall</p>
        <p className="font-medium">{shortfall > 0 ? formatCurrency(shortfall) : "On Track!"}</p>
      </div>
    </div>
  );
}
