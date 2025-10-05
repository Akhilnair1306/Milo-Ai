"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Plus, Trash2, Clock, Check } from "lucide-react";
import { toast } from "sonner";

type Reminder = {
  id: number;
  text: string;
  date: Date;
  reminder_time?: string;
  is_recurring?: boolean;
  completed: boolean;
};

const Reminders = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("09:00");
  const [reminderText, setReminderText] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isRecurring, setIsRecurring] = useState(false);

  const userId = JSON.parse(localStorage.getItem("userInfo") || "{}")?.id;// Replace with actual user ID
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    fetchReminders();
  }, []);

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

  const handleAddReminder = async () => {
    if (!reminderText.trim() || !date) {
      toast.error("Please enter a reminder and select a date!");
      return;
    }

    const selectedDateTime = new Date(date);
    const [hours, minutes] = time.split(":").map(Number);
    selectedDateTime.setHours(hours, minutes, 0);

    if (selectedDateTime < new Date()) {
      toast.error("Cannot select a past date/time");
      return;
    }

    const reminderPayload = {
      user_id: userId,
      entry_text: reminderText,
      entry_type: "reminder",
      reminder_time: time + ":00",
      is_recurring: isRecurring,
    };

    try {
      const res = await fetch("http://localhost:8000/api/v1/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reminderPayload),
      });

      if (!res.ok) throw new Error("Failed to add reminder");

      const data = await res.json();
      setReminders([
        ...reminders,
        {
          id: data.id,
          text: reminderText,
          date: selectedDateTime,
          reminder_time: time,
          is_recurring: isRecurring,
          completed: false,
        },
      ]);
      setReminderText("");
      setIsRecurring(false);
      toast.success("Reminder added successfully!");
    } catch (error: any) {
      toast.error("Error adding reminder: " + error.message);
    }
  };

  const handleMarkCompleted = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/reminders/${id}/complete`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to mark reminder complete");

      setReminders(reminders.map(r => r.id === id ? { ...r, completed: true } : r));
      toast.success("Reminder marked as completed!");
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Bell className="h-8 w-8 text-primary animate-glow-pulse" />
          Reminders
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Reminder Card */}
        <Card className="p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Add New Reminder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Reminder</Label>
              <Input
                placeholder="What do you want to be reminded about?"
                value={reminderText}
                onChange={(e) => setReminderText(e.target.value)}
              />
            </div>
            <div>
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selected) => {
                  if (selected && selected >= today) {
                    setDate(selected);
                  } else {
                    toast.error("Cannot select a past date");
                  }
                }}
                className="rounded-lg border p-2"
              />
            </div>
            <div>
              <Label className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> Select Time
              </Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="recurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(!!checked)}
              />
              <Label htmlFor="recurring">Recurring daily</Label>
            </div>
            <Button onClick={handleAddReminder} className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Reminder
            </Button>
          </CardContent>
        </Card>

        {/* Reminders List */}
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
                  className={`p-4 border ${
                    reminder.completed ? "border-green-400 bg-green-50" : "border-primary/20"
                  } hover:border-primary/40 transition-all group shadow-sm`}
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
                    {!reminder.completed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMarkCompleted(reminder.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reminders;
