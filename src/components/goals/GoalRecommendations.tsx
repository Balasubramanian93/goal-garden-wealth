
import { ArrowTrendingUpIcon } from "lucide-react";

interface GoalRecommendationsProps {
  shortfall: number;
  monthlyIncrease: number;
  formatCurrency: (amount: number) => string;
}

export function GoalRecommendations({ shortfall, monthlyIncrease, formatCurrency }: GoalRecommendationsProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
          <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="font-medium text-lg">Recommendations</h3>
      </div>
      
      <ul className="space-y-3">
        <li className="flex items-start gap-2">
          <span className="text-blue-600 dark:text-blue-400">•</span>
          <span>Increase monthly contribution by <span className="font-medium">{formatCurrency(monthlyIncrease)}</span> to reach your goal on time</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 dark:text-blue-400">•</span>
          <span>Consider increasing your allocation to higher-return assets</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-600 dark:text-blue-400">•</span>
          <span>Review and optimize your investment strategy quarterly</span>
        </li>
      </ul>
    </div>
  );
}
