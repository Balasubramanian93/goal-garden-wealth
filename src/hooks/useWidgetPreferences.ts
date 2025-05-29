
import { useState, useEffect } from 'react';

type WidgetKey = 
  | 'budgetOverview'
  | 'portfolioOverview' 
  | 'financialHealth'
  | 'quickActions'
  | 'goalsProgress'
  | 'recentTransactions'
  | 'analyticsSummary'
  | 'personalizedRecommendations'
  | 'achievementBadges'
  | 'financialCalendar';

type WidgetPreferences = Record<WidgetKey, boolean>;

const defaultPreferences: WidgetPreferences = {
  budgetOverview: true,
  portfolioOverview: true,
  financialHealth: true,
  quickActions: true,
  goalsProgress: true,
  recentTransactions: true,
  analyticsSummary: true,
  personalizedRecommendations: true,
  achievementBadges: true,
  financialCalendar: true,
};

export const useWidgetPreferences = () => {
  const [preferences, setPreferences] = useState<WidgetPreferences>(defaultPreferences);

  useEffect(() => {
    const saved = localStorage.getItem('dashboard-widget-preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        console.error('Error parsing widget preferences:', error);
      }
    }
  }, []);

  const updatePreference = (widget: WidgetKey, enabled: boolean) => {
    const newPreferences = { ...preferences, [widget]: enabled };
    setPreferences(newPreferences);
    localStorage.setItem('dashboard-widget-preferences', JSON.stringify(newPreferences));
  };

  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('dashboard-widget-preferences');
  };

  return {
    preferences,
    updatePreference,
    resetToDefaults,
  };
};
