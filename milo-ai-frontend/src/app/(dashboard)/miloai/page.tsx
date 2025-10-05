"use client"

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import ChatWindow from "@/components/milo-bot/chat-window";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const MiloAI = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Milo, your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", content: input }]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm here to help! This is a demo response. In a real implementation, I would process your request and provide helpful assistance.",
        },
      ]);
    }, 1000);
  };

  return (
        <main className=" flex flex-col">
  <ChatWindow />
</main>

  );
};

export default MiloAI;
