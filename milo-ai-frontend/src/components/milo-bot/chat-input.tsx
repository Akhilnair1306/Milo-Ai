"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, Mic, SendHorizonal } from "lucide-react"

interface ChatInputProps {
  onSend: (message: string) => void
  onStartRecording: () => void
  onStopRecording: () => void
  isRecording: boolean
}

export function ChatInput({
  onSend,
  onStartRecording,
  onStopRecording,
  isRecording,
}: ChatInputProps) {
  const [message, setMessage] = useState("")

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    onSend(message)
    setMessage("")
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 rounded-full border border-border bg-card shadow-md p-2"
      aria-label="Chat input"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-full"
        aria-label="Attach file"
      >
        <Paperclip className="h-5 w-5" />
      </Button>

      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message to Milo..."
        aria-label="Message to Milo"
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
      />

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant={isRecording ? "destructive" : "ghost"}
          size="icon"
          className="rounded-full animate-pulse"
          aria-label="Record voice"
          onMouseDown={onStartRecording}
          onMouseUp={onStopRecording}
        >
          <Mic className="h-5 w-5" />
        </Button>

        {isRecording && (
          <span className="text-red-500 animate-pulse ml-2">Listening...</span>
        )}

        <Button
          type="submit"
          className="rounded-full px-4 bg-[var(--brand)] text-[var(--brand-foreground)] hover:opacity-90"
          aria-label="Send"
        >
          <span className="hidden sm:inline">Send</span>
          <SendHorizonal className="h-5 w-5 sm:ml-2" />
        </Button>
      </div>
    </form>
  )
}
