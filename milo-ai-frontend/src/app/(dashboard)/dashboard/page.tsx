import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle, MessageSquare, BookOpen } from "lucide-react";

const stats = [
  {
    title: "Total Reminders",
    value: "12",
    icon: Calendar,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Tasks Completed",
    value: "8",
    icon: CheckCircle,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    title: "AI Conversations",
    value: "24",
    icon: MessageSquare,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Diary Entries",
    value: "15",
    icon: BookOpen,
    gradient: "from-orange-500 to-red-500",
  },
];

export default function Dashboard  () {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome Back! 👋</h1>
        <p className="text-muted-foreground">Here's what's happening with your productivity today.</p>
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
        <Card className="p-6 bg-card border-border shadow-sm">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted hover:bg-muted/70 transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsl(263_70%_50%/0.5)]" />
                <div className="flex-1">
                  <p className="font-medium">Activity Item {i + 1}</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-card border-border shadow-sm">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "New Reminder", icon: Calendar },
              { label: "Chat with Milo", icon: MessageSquare },
              { label: "Write Diary", icon: BookOpen },
              { label: "View Tasks", icon: CheckCircle },
            ].map((action) => (
              <button
                key={action.label}
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
};

// export default Dashboard;
