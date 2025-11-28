"use client"

import { useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "@/components/chat-message"
import type { ChatMessage as ChatMessageType } from "@/lib/types"

interface ChatInterfaceProps {
  messages: ChatMessageType[]
  onPlayAudio?: (messageId: string) => void
}

export function ChatInterface({ messages, onPlayAudio }: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Nenhuma mensagem ainda</p>
          <p className="mt-1 text-sm text-muted-foreground">Grave um áudio para começar a conversa</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full pr-4" ref={scrollRef}>
      <div className="space-y-4 py-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onPlayAudio={onPlayAudio ? () => onPlayAudio(message.id) : undefined}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
