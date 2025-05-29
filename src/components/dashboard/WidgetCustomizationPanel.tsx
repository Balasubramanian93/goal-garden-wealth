
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useWidgetPreferences } from "@/hooks/useWidgetPreferences";

const WidgetCustomizationPanel = () => {
  const { preferences, updatePreference, resetToDefaults } = useWidgetPreferences();

  const widgetLabels = {
    budgetOverview: "Budget Overview",
    portfolioOverview: "Portfolio Overview", 
    financialHealth: "Financial Health",
    quickActions: "Quick Actions",
    goalsProgress: "Goals Progress",
    recentTransactions: "Recent Transactions",
    analyticsSummary: "Analytics Summary",
    personalizedRecommendations: "Smart Recommendations",
    achievementBadges: "Achievement Badges",
    financialCalendar: "Financial Calendar",
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {Object.entries(widgetLabels).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm font-medium">{label}</span>
            <Switch
              checked={preferences[key as keyof typeof preferences]}
              onCheckedChange={(checked) => 
                updatePreference(key as keyof typeof preferences, checked)
              }
            />
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetToDefaults}
          className="w-full"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default WidgetCustomizationPanel;
