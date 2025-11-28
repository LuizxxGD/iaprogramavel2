"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Save, Trash2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import type { SavedChat } from "@/lib/types"
import { useState } from "react"

interface SidebarProps {
  savedChats: SavedChat[]
  onNewChat: () => void
  onLoadChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  currentChatId?: string
}

export function Sidebar({ savedChats, onNewChat, onLoadChat, onDeleteChat, currentChatId }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"current" | "saved">("current")

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-sidebar-border p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
          <MessageSquare className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-semibold text-sidebar-foreground">IA Assistente</h1>
          <p className="text-xs text-muted-foreground">Programável</p>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-sidebar-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab("current")}
            className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "current"
                ? "border-primary text-sidebar-foreground"
                : "border-transparent text-muted-foreground hover:text-sidebar-foreground"
            }`}
          >
            Chat Atual
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "saved"
                ? "border-primary text-sidebar-foreground"
                : "border-transparent text-muted-foreground hover:text-sidebar-foreground"
            }`}
          >
            Salvos ({savedChats.length})
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button onClick={onNewChat} className="w-full bg-transparent" variant="outline">
          <MessageSquare className="mr-2 h-4 w-4" />
          Novo Chat
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-3">
        {activeTab === "current" ? (
          <div className="space-y-2 pb-4">
            <div className="py-8 text-center text-sm text-muted-foreground">
              {currentChatId ? "Chat atual em andamento" : "Inicie um novo chat"}
            </div>
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {savedChats.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Nenhum chat salvo</div>
            ) : (
              savedChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative rounded-lg transition-colors hover:bg-sidebar-accent ${
                    currentChatId === chat.id ? "bg-sidebar-accent" : ""
                  }`}
                >
                  <button onClick={() => onLoadChat(chat.id)} className="w-full p-3 text-left">
                    <div className="flex items-start gap-2">
                      <Save className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium text-sidebar-foreground">{chat.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(chat.date).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-xs text-muted-foreground">{chat.messages.length} mensagens</p>
                      </div>
                    </div>
                  </button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat(chat.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
