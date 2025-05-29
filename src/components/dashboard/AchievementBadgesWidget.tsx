
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, TrendingUp, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const AchievementBadgesWidget = () => {
  const { user } = useAuth();

  const { data: portfolioValue = 0 } = useQuery({
    queryKey: ['portfolio-total-value'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_assets')
        .select('quantity, current_price')
        .order('id', { ascending: true });
      
      if (error) throw error;
      return data?.reduce((total, asset) => total + (asset.quantity * asset.current_price), 0) || 0;
    },
    enabled: !!user,
  });

  const achievements = [
    {
      id: 1,
      title: "First Investment",
      description: "Made your first portfolio entry",
      icon: <Trophy className="h-5 w-5" />,
      unlocked: portfolioValue > 0,
      color: "bg-yellow-500",
    },
    {
      id: 2,
      title: "Goal Setter",
      description: "Created your first financial goal",
      icon: <Target className="h-5 w-5" />,
      unlocked: true, // This would be based on actual goals data
      color: "bg-blue-500",
    },
    {
      id: 3,
      title: "Portfolio Builder",
      description: "Portfolio value exceeds ₹10,000",
      icon: <TrendingUp className="h-5 w-5" />,
      unlocked: portfolioValue > 10000,
      color: "bg-green-500",
    },
    {
      id: 4,
      title: "Consistency Master",
      description: "7 days of active tracking",
      icon: <Award className="h-5 w-5" />,
      unlocked: false, // This would be based on usage tracking
      color: "bg-purple-500",
    },
  ];

  const unlockedCount = achievements.filter(achievement => achievement.unlocked).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Achievement Badges
        </CardTitle>
        <CardDescription>
          {unlockedCount}/{achievements.length} achievements unlocked
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border-2 transition-all ${
                achievement.unlocked
                  ? "border-primary/20 bg-primary/5"
                  : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`p-1 rounded ${
                    achievement.unlocked ? achievement.color : "bg-gray-400"
                  } text-white`}
                >
                  {achievement.icon}
                </div>
                <Badge variant={achievement.unlocked ? "default" : "secondary"} className="text-xs">
                  {achievement.unlocked ? "Unlocked" : "Locked"}
                </Badge>
              </div>
              <h4 className="font-medium text-sm">{achievement.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadgesWidget;
