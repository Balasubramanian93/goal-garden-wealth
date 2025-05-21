
import { Calendar, Flag, Target, Home, Briefcase } from "lucide-react";

interface GoalDetailsHeaderProps {
  goal: {
    name: string;
    targetAmount: number;
    targetDate: string;
    iconType: string;
  };
}

export function GoalDetailsHeader({ goal }: GoalDetailsHeaderProps) {
  const renderIcon = () => {
    switch (goal.iconType) {
      case 'Calendar':
        return <Calendar className="h-16 w-16 text-blue-500" />;
      case 'Flag':
        return <Flag className="h-16 w-16 text-green-500" />;
      case 'Target':
        return <Target className="h-16 w-16 text-purple-500" />;
      case 'Home':
        return <Home className="h-16 w-16 text-orange-500" />;
      case 'Briefcase':
        return <Briefcase className="h-16 w-16 text-teal-500" />;
      default:
        return <Target className="h-16 w-16 text-gray-500" />;
    }
  };

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
    <div className="flex items-center gap-6 bg-gradient-to-r from-card/80 to-muted/50 p-6 rounded-lg shadow-sm border">
      <div className="p-5 bg-background rounded-full shadow-sm">
        {renderIcon()}
      </div>
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          {goal.name}
        </h1>
        <p className="text-muted-foreground text-lg mt-1">
          Target: {formatCurrency(goal.targetAmount)} by {goal.targetDate}
        </p>
      </div>
    </div>
  );
}
