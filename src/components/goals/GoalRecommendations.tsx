
interface GoalRecommendationsProps {
  shortfall: number;
  monthlyIncrease: number;
  formatCurrency: (amount: number) => string;
}

export function GoalRecommendations({ shortfall, monthlyIncrease, formatCurrency }: GoalRecommendationsProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 shadow-sm">
      <h3 className="font-medium text-lg mb-4">Recommendations</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>Increase monthly contribution by {formatCurrency(monthlyIncrease)} to reach your goal on time</li>
        <li>Consider increasing your allocation to higher-return assets</li>
        <li>Review and optimize your investment strategy quarterly</li>
      </ul>
    </div>
  );
}
