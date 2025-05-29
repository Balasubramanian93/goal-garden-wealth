
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Target, CreditCard, AlertCircle } from "lucide-react";
import { useGoalsStore } from "@/store/goalsStore";

const FinancialCalendarWidget = () => {
  const { goals } = useGoalsStore();

  const generateUpcomingEvents = () => {
    const events = [];
    const today = new Date();

    // Add goal deadlines
    goals.forEach(goal => {
      const targetDate = new Date(goal.targetDate);
      const daysToTarget = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToTarget > 0 && daysToTarget <= 365) {
        events.push({
          title: `${goal.name} Target Date`,
          date: targetDate,
          daysAway: daysToTarget,
          type: "goal",
          priority: daysToTarget <= 30 ? "high" : daysToTarget <= 90 ? "medium" : "low",
          icon: Target
        });
      }
    });

    // Add monthly recurring events
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);

    events.push({
      title: "Monthly Budget Review",
      date: nextMonth,
      daysAway: Math.ceil((nextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      type: "budget",
      priority: "medium",
      icon: Calendar
    });

    // Add SIP reminder (assuming 5th of every month)
    const nextSIP = new Date(today);
    if (today.getDate() > 5) {
      nextSIP.setMonth(nextSIP.getMonth() + 1);
    }
    nextSIP.setDate(5);

    events.push({
      title: "SIP Contribution Due",
      date: nextSIP,
      daysAway: Math.ceil((nextSIP.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      type: "investment",
      priority: "high",
      icon: CreditCard
    });

    // Add portfolio review reminder (quarterly)
    const nextQuarterReview = new Date(today);
    const currentQuarter = Math.floor(today.getMonth() / 3);
    nextQuarterReview.setMonth((currentQuarter + 1) * 3);
    nextQuarterReview.setDate(1);

    events.push({
      title: "Quarterly Portfolio Review",
      date: nextQuarterReview,
      daysAway: Math.ceil((nextQuarterReview.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      type: "review",
      priority: "low",
      icon: Clock
    });

    return events
      .sort((a, b) => a.daysAway - b.daysAway)
      .slice(0, 5);
  };

  const upcomingEvents = generateUpcomingEvents();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'goal': return Target;
      case 'budget': return Calendar;
      case 'investment': return CreditCard;
      case 'review': return Clock;
      default: return AlertCircle;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Financial Calendar
        </CardTitle>
        <CardDescription>Upcoming important dates and deadlines</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingEvents.map((event, index) => {
            const Icon = event.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-background">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {event.date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: event.date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {event.daysAway === 0 ? 'Today' : 
                     event.daysAway === 1 ? 'Tomorrow' : 
                     `${event.daysAway} days`}
                  </span>
                  <Badge variant={getPriorityColor(event.priority)} className="text-xs">
                    {event.priority}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialCalendarWidget;
