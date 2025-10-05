"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Save } from "lucide-react";
import { toast } from "sonner";

const DailyDiary = () => {
  const [entry, setEntry] = useState("");
  const [recentEntries, setRecentEntries] = useState([]);

  // Replace with your API base URL
  const API_URL = "http://localhost:8000/api/v1/diary";


  const handleSave = async () => {
    if (!entry.trim()) {
      toast.error("Please write something before saving!");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entry_text: entry,
          entry_type: "information", // You can make this dynamic
          user_id: "123e4567-e89b-12d3-a456-426614174000", // Replace with logged-in user ID
        }),
      });

      if (!res.ok) throw new Error("Failed to save entry");

      toast.success("Diary entry saved successfully!");
      setEntry("");
      // await fetchRecentEntries();
    } catch (error) {
      console.error(error);
      toast.error("Error saving entry.");
    }
  };

  // useEffect(() => {
  //   fetchRecentEntries();
  // }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Daily Diary
        </h1>
        <p className="text-muted-foreground">Capture your thoughts and memories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-card border-border shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Today's Entry</h2>
              <span className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <Textarea
              placeholder="What's on your mind today? Write your thoughts here..."
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="min-h-[400px] resize-none bg-muted/30 text-base leading-relaxed"
            />

            <Button
              onClick={handleSave}
              className="w-full bg-primary hover:bg-primary/90 shadow-md"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Entry
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DailyDiary;
