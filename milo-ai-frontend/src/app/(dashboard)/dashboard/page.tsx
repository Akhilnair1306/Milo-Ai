"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, MessageSquare, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const stats = [
  { title: "Total Reminders", value: "12", icon: Calendar, gradient: "from-purple-500 to-pink-500" },
  { title: "Tasks Completed", value: "8", icon: CheckCircle, gradient: "from-cyan-500 to-blue-500" },
];

type Reminder = {
  id: number;
  text: string;
  date: Date;
  reminder_time?: string;
  is_recurring?: boolean;
  completed: boolean;
};

export default function Dashboard() {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [actions, setActions] = useState<any[] | null>(null); // null until loaded

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    setUserId(userInfo.id || null);
    setUserRole(userInfo.role || null);

    if (userInfo.role === "user") {
      setActions([
        { label: "New Reminder", icon: Calendar, link: "/reminders" },
        { label: "Chat with Milo", icon: MessageSquare, link: "/miloai" },
        { label: "Write Diary", icon: BookOpen, link: "/dailydiary" },
      ]);
    } else if (userInfo.role === "caregiver") {
      setActions([
        { label: "New Reminder", icon: Calendar, link: "/reminders" },
        { label: "Write Diary", icon: BookOpen, link: "/dailydiary" },
      ]);
    } else {
      setActions([]); // no actions if role unknown
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchReminders = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/reminders/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch reminders");
        const data = await res.json();
        setReminders(
          data.map((entry: any) => ({
            id: entry.id,
            text: entry.entry_text,
            date: new Date(entry.created_at),
            reminder_time: entry.reminder_time,
            is_recurring: entry.is_recurring,
            completed: entry.completed || false,
          }))
        );
      } catch {
        toast.error("Error loading reminders");
      }
    };

    fetchReminders();
  }, [userId]);

  if (actions === null) return null; // wait until actions are set

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome Back! 👋</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your productivity today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="p-6 bg-card border-border hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-md`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Your Reminders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No reminders yet</p>
            ) : (
              reminders.map((reminder, index) => (
                <Card
                  key={reminder.id}
                  className={`p-4 border ${reminder.completed ? "border-green-400 bg-green-50" : "border-primary/20"} hover:border-primary/40 transition-all group shadow-sm`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`font-medium ${reminder.completed ? "line-through text-muted-foreground" : ""}`}>
                        {reminder.text}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {reminder.date.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {reminder.reminder_time && <> @ {reminder.reminder_time}</>}
                        {reminder.is_recurring && <> 🔁 Recurring</>}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="p-6 bg-card border-border shadow-sm">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={() => router.push(action.link)}
                className="p-4 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 transition-all hover:scale-105 group shadow-sm"
              >
                <action.icon className="h-6 w-6 text-primary mb-2 group-hover:animate-float" />
                <p className="text-sm font-medium text-foreground">{action.label}</p>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
