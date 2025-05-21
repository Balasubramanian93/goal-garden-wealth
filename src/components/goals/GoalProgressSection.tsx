
interface GoalProgressSectionProps {
  currentAmount: number;
  targetAmount: number;
  progress: number;
  projectedValue: number;
  projectedPercentage: number;
  formatCurrency: (amount: number) => string;
}

export function GoalProgressSection({ 
  currentAmount, 
  targetAmount, 
  progress, 
  projectedValue, 
  projectedPercentage,
  formatCurrency
}: GoalProgressSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2 bg-card p-5 rounded-lg shadow-sm border">
        <h3 className="font-medium text-lg">Current Goal Status</h3>
        <div className="flex justify-between text-sm">
          <span>{progress}% Complete</span>
          <span>{formatCurrency(currentAmount)} of {formatCurrency(targetAmount)}</span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-2 bg-card p-5 rounded-lg shadow-sm border">
        <h3 className="font-medium text-lg">Projected Growth</h3>
        <div className="flex justify-between text-sm">
          <span>{projectedPercentage}% Projected</span>
          <span>{formatCurrency(projectedValue)} of {formatCurrency(targetAmount)}</span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-amber-500"
            style={{ width: `${projectedPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
