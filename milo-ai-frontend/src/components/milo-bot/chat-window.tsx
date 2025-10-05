"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { ChatInput } from "./chat-input"

const BotFace3D = dynamic(() => import("./bot-face"), { ssr: false })

type Message =
  | { type: "bot_response_text"; text: string }
  | { type: "transcribed_text"; text: string }
  | { type: "bot_response_audio"; audio: string }
  | { type: "vad_silence"; message: string }

export default function ChatWindow() {
  const ws = useRef<WebSocket | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const recordedChunks = useRef<Blob[]>([])
  async function transcribeAudio(blob: Blob) {
  const formData = new FormData();
  formData.append("file", blob, "recording.webm");
  formData.append("model", "ink-whisper");
  formData.append("language", "en");

  const response = await fetch("https://api.cartesia.ai/stt", {
    method: "POST",
    headers: {
      "Authorization": "Bearer sk_car_QKtL7ykn36pTzr33rWG81e",
      "Cartesia-Version": "2025-04-16",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Cartesia STT error: ${response.status}`);
  }

  const data = await response.json();
  return data.text; // Cartesia returns transcription text here
}

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/api/v1/ws/chat")

    ws.current.onopen = () => {
      console.log("WebSocket connected")
      ws.current?.send(JSON.stringify({ type: "init", user_id: "123e4567-e89b-12d3-a456-426614174000" }))
    }

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessages((prev) => [...prev, data])

      if (data.type === "bot_response_audio" && data.audio) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audio}`)
        audio.play().catch(err => console.error("Audio play error:", err))
      }
    }

    ws.current.onclose = () => console.log("WebSocket closed")
    ws.current.onerror = (err) => console.error("WebSocket error:", err)

    return () => ws.current?.close()
  }, [])

  const sendQuery = (text: string) => {
    ws.current?.send(JSON.stringify({ type: "query", text }))
  }

  const startRecording = async () => {
    setIsRecording(true)
    recordedChunks.current = []
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder.current = new MediaRecorder(stream)

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.current.push(event.data)
    }

    mediaRecorder.current.start()
  }

const stopRecording = () => {
  setIsRecording(false);
  mediaRecorder.current?.stop();

  mediaRecorder.current!.onstop = async () => {
    const blob = new Blob(recordedChunks.current, { type: "audio/webm" });

    try {
      const transcription = await transcribeAudio(blob);
      console.log("Transcribed text:", transcription);

      // Send text to backend instead of audio
      ws.current?.send(JSON.stringify({ type: "query", text: transcription }));

    } catch (err) {
      console.error("Error transcribing audio:", err);
    }
  };
};




  function arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = ""
    const bytes = new Uint8Array(buffer)
    const chunkSize = 0x8000
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const subArray = bytes.subarray(i, i + chunkSize)
      binary += String.fromCharCode.apply(null, Array.from(subArray))
    }
    return btoa(binary)
  }

  return (
    <section className="flex flex-1 flex-col items-center px-4 py-6 w-full h-screen">
      <div className="w-full max-w-3xl flex flex-col items-center flex-grow">
        <div className={cn("relative p-2")} aria-hidden="true">
          <div className="w-60 h-60">
            <BotFace3D />
          </div>
        </div>

        <h1 className="text-balance text-2xl md:text-3xl font-medium text-center mt-4">
          Hi, I&apos;m Milo. How can I help you?
        </h1>

        <div className="mt-6 w-full max-w-2xl space-y-2">
          {messages.map((msg, i) => (
            <div key={i} className="mb-2">
              {msg.type === "bot_response_text" && (
                <div className="bg-gray-100 p-2 rounded">{msg.text}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 w-full max-w-3xl">
        <ChatInput
          onSend={sendQuery}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          isRecording={isRecording}
        />
      </div>
    </section>
  )
}
