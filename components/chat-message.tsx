"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, User, Bot } from "lucide-react"
import type { ChatMessage as ChatMessageType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: ChatMessageType
  onPlayAudio?: () => void
}

export function ChatMessage({ message, onPlayAudio }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {/* Avatar */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}

      {/* Message Content */}
      <div className={cn("flex max-w-[80%] flex-col gap-2", isUser && "items-end")}>
        <Card className={cn("px-4 py-3 shadow-sm", isUser ? "bg-primary text-primary-foreground" : "bg-card")}>
          <p className="text-sm leading-relaxed">{message.content}</p>

          {/* Transcription for user messages */}
          {isUser && message.transcription && (
            <p className="mt-2 border-t border-primary-foreground/20 pt-2 text-xs opacity-70">
              Transcrição: {message.transcription}
            </p>
          )}

          {/* AI Response Details */}
          {!isUser && message.response && (
            <div className="mt-3 space-y-2 border-t border-border pt-3">
              {message.response.text_long && (
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium">Resposta completa:</p>
                  <p className="mt-1">{message.response.text_long}</p>
                </div>
              )}

              {message.response.action && message.response.action.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium">Ações:</p>
                  <ul className="mt-1 list-inside list-disc">
                    {message.response.action.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Audio Playback Button for AI messages */}
        {!isUser && message.response?.speech_text && onPlayAudio && (
          <Button size="sm" variant="ghost" onClick={onPlayAudio} className="h-7 gap-1 px-2">
            <Volume2 className="h-3 w-3" />
            <span className="text-xs">Ouvir resposta</span>
          </Button>
        )}

        {/* Timestamp */}
        <span className="text-xs text-muted-foreground">
          {new Date(message.timestamp).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}
