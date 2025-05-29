
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Clock, Target, CreditCard, AlertCircle, Check, X, User } from "lucide-react";
import { useGoalsStore } from "@/store/goalsStore";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AddReminderDialog from "./AddReminderDialog";
import { toast } from "sonner";

const RemindersWidget = () => {
  const { goals } = useGoalsStore();
  const { user } = useAuth();

  // Fetch custom reminders
  const { data: customReminders = [], refetch } = useQuery({
    queryKey: ['custom-reminders'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('custom_reminders')
        .select('*')
        .eq('status', 'active')
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const generateUpcomingEvents = () => {
    const events = [];
    const today = new Date();

    // Add goal deadlines
    goals.forEach(goal => {
      const targetDate = new Date(goal.targetDate);
      const daysToTarget = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysToTarget > 0 && daysToTarget <= 365) {
        events.push({
          id: `goal-${goal.id}`,
          title: `${goal.name} Target Date`,
          date: targetDate,
          daysAway: daysToTarget,
          type: "goal",
          priority: daysToTarget <= 30 ? "high" : daysToTarget <= 90 ? "medium" : "low",
          icon: Target,
          isCustom: false
        });
      }
    });

    // Add monthly recurring events
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1);

    events.push({
      id: 'budget-review',
      title: "Monthly Budget Review",
      date: nextMonth,
      daysAway: Math.ceil((nextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      type: "budget",
      priority: "medium",
      icon: Bell,
      isCustom: false
    });

    // Add SIP reminder (assuming 5th of every month)
    const nextSIP = new Date(today);
    if (today.getDate() > 5) {
      nextSIP.setMonth(nextSIP.getMonth() + 1);
    }
    nextSIP.setDate(5);

    events.push({
      id: 'sip-reminder',
      title: "SIP Contribution Due",
      date: nextSIP,
      daysAway: Math.ceil((nextSIP.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      type: "investment",
      priority: "high",
      icon: CreditCard,
      isCustom: false
    });

    // Add portfolio review reminder (quarterly)
    const nextQuarterReview = new Date(today);
    const currentQuarter = Math.floor(today.getMonth() / 3);
    nextQuarterReview.setMonth((currentQuarter + 1) * 3);
    nextQuarterReview.setDate(1);

    events.push({
      id: 'portfolio-review',
      title: "Quarterly Portfolio Review",
      date: nextQuarterReview,
      daysAway: Math.ceil((nextQuarterReview.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      type: "review",
      priority: "low",
      icon: Clock,
      isCustom: false
    });

    // Add custom reminders
    customReminders.forEach(reminder => {
      const dueDate = new Date(reminder.due_date);
      const daysAway = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysAway >= 0) {
        events.push({
          id: `custom-${reminder.id}`,
          title: reminder.title,
          description: reminder.description,
          date: dueDate,
          daysAway,
          type: "custom",
          priority: reminder.priority,
          icon: User,
          isCustom: true,
          customId: reminder.id
        });
      }
    });

    return events
      .sort((a, b) => a.daysAway - b.daysAway)
      .slice(0, 8);
  };

  const upcomingEvents = generateUpcomingEvents();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const handleCompleteReminder = async (customId: string) => {
    try {
      const { error } = await supabase
        .from('custom_reminders')
        .update({ status: 'completed' })
        .eq('id', customId);

      if (error) throw error;

      toast.success("Reminder marked as completed!");
      refetch();
    } catch (error) {
      console.error('Error completing reminder:', error);
      toast.error("Failed to complete reminder");
    }
  };

  const handleDismissReminder = async (customId: string) => {
    try {
      const { error } = await supabase
        .from('custom_reminders')
        .update({ status: 'dismissed' })
        .eq('id', customId);

      if (error) throw error;

      toast.success("Reminder dismissed!");
      refetch();
    } catch (error) {
      console.error('Error dismissing reminder:', error);
      toast.error("Failed to dismiss reminder");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Reminders
            </CardTitle>
            <CardDescription>Upcoming important dates and deadlines</CardDescription>
          </div>
          {user && (
            <AddReminderDialog onReminderAdded={refetch} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No upcoming reminders
            </div>
          ) : (
            upcomingEvents.map((event) => {
              const Icon = event.icon;
              return (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 rounded-full bg-background">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{event.title}</div>
                      {event.description && (
                        <div className="text-xs text-muted-foreground mt-1">{event.description}</div>
                      )}
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
                    {event.isCustom && event.customId && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleCompleteReminder(event.customId!)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleDismissReminder(event.customId!)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RemindersWidget;
