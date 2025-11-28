"use client"

import React, { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { PersonalityConfig } from "@/components/personality-config"
import { Textarea } from "@/components/ui/textarea"
import { AudioRecorder } from "@/components/audio-recorder"
import { ChatInterface } from "@/components/chat-interface"
import { SaveChatDialog } from "@/components/save-chat-dialog"
import type { SavedChat, PersonalityConfig as PersonalityConfigType, ChatMessage, AIResponse } from "@/lib/types"
import { DEFAULT_PERSONALITY } from "@/lib/presets"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Save, Loader2 } from "lucide-react"
import { chatStorage } from "@/lib/storage"
import { audioUtils } from "@/lib/audio-utils"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [savedChats, setSavedChats] = useState<SavedChat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | undefined>()
  const [personality, setPersonality] = useState<PersonalityConfigType>(DEFAULT_PERSONALITY)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  // Load saved chats on mount
  useEffect(() => {
    const chats = chatStorage.loadChats()
    setSavedChats(chats)
  }, [])

  const handleNewChat = () => {
    setCurrentChatId(undefined)
    setMessages([])
    setPersonality(DEFAULT_PERSONALITY)
  }

  const handleLoadChat = (chatId: string) => {
    const chat = savedChats.find((c) => c.id === chatId)
    if (chat) {
      setCurrentChatId(chat.id)
      setPersonality(chat.personality)
      setMessages(chat.messages)
    }
  }

  const handleDeleteChat = (chatId: string) => {
    chatStorage.deleteChat(chatId)
    setSavedChats((prev) => prev.filter((c) => c.id !== chatId))

    if (currentChatId === chatId) {
      handleNewChat()
    }
  }

  const handleSaveChat = (name: string) => {
    const chatToSave: SavedChat = {
      id: currentChatId || crypto.randomUUID(),
      name,
      date: new Date(),
      personality,
      messages,
    }

    chatStorage.saveChat(chatToSave)

    const updatedChats = chatStorage.loadChats()
    setSavedChats(updatedChats)
    setCurrentChatId(chatToSave.id)

    toast({
      title: "Chat salvo",
      description: `"${name}" foi salvo com sucesso.`,
    })
  }

  const handleRecordingComplete = async (audioBlob: Blob) => {
    console.log("[v0] Audio recording completed:", audioBlob.size, "bytes")
    setIsProcessing(true)

    try {
      // Step 1: Transcribe audio
      const transcription = await audioUtils.transcribeAudio(audioBlob)
      console.log("[v0] Transcription:", transcription)

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: transcription,
        timestamp: new Date(),
        transcription,
      }

      setMessages((prev) => [...prev, userMessage])

      // Step 2: Get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: transcription,
          personality,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const aiResponse: AIResponse = await response.json()
      console.log("[v0] AI Response:", aiResponse)

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiResponse.text_short,
        timestamp: new Date(),
        response: aiResponse,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Step 3: Auto-play TTS response
      if (aiResponse.speech_text) {
        try {
          const audioBlob = await audioUtils.generateTTS(aiResponse.speech_text)
          await audioUtils.playAudio(audioBlob)
        } catch (error) {
          console.error("[v0] TTS playback error:", error)
        }
      }
    } catch (error) {
      console.error("[v0] Processing error:", error)
      toast({
        title: "Erro",
        description: "Não foi possível processar o áudio. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const [inputText, setInputText] = useState("")

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault()

    const messageText = inputText.trim()
    if (!messageText) return

    setIsProcessing(true)

    try {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: messageText,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, personality }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const aiResponse: AIResponse = await response.json()

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiResponse.text_short,
        timestamp: new Date(),
        response: aiResponse,
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (aiResponse.speech_text) {
        try {
          const audioBlob = await audioUtils.generateTTS(aiResponse.speech_text)
          await audioUtils.playAudio(audioBlob)
        } catch (error) {
          console.error("[v0] TTS playback error:", error)
        }
      }

      setInputText("")
    } catch (error) {
      console.error("[v0] Processing error:", error)
      toast({
        title: "Erro",
        description: "Não foi possível processar a mensagem. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePlayAudio = async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId)
    if (!message?.response?.speech_text) return

    try {
      const audioBlob = await audioUtils.generateTTS(message.response.speech_text)
      await audioUtils.playAudio(audioBlob)
    } catch (error) {
      console.error("[v0] Audio playback error:", error)
      toast({
        title: "Erro",
        description: "Não foi possível reproduzir o áudio.",
        variant: "destructive",
      })
    }
  }

  const canSaveChat = messages.length > 0

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        savedChats={savedChats}
        onNewChat={handleNewChat}
        onLoadChat={handleLoadChat}
        onDeleteChat={handleDeleteChat}
        currentChatId={currentChatId}
      />
      <main className="flex flex-1 flex-col bg-background">
        <div className="flex h-full flex-col">
          <Tabs defaultValue="chat" className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border px-6 pt-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="config">Configuração</TabsTrigger>
              </TabsList>

              <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(true)} disabled={!canSaveChat}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Chat
              </Button>
            </div>

            <TabsContent value="chat" className="flex flex-1 flex-col overflow-hidden p-6">
              {/* Processing Indicator */}
              {isProcessing && (
                <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-primary/10 p-3 text-sm text-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processando áudio...</span>
                </div>
              )}

              {/* Chat Messages */}
              <div className="flex-1 overflow-hidden">
                <ChatInterface messages={messages} onPlayAudio={handlePlayAudio} />
              </div>

              {/* Input area: keep both AudioRecorder and Textarea */}
              <div className="mt-6 border-t border-border pt-6">
                <div className="mx-auto w-full max-w-4xl px-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start">
                    <div className="md:w-1/3">
                      <AudioRecorder onRecordingComplete={handleRecordingComplete} disabled={isProcessing} />
                    </div>

                    <form onSubmit={handleSendText} className="md:w-2/3">
                      <Textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Digite sua mensagem aqui..."
                        rows={3}
                      />

                      <div className="mt-3 flex justify-end">
                        <Button type="submit" disabled={isProcessing || inputText.trim() === ""}>
                          Enviar
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="config" className="flex-1 overflow-auto p-6">
              <div className="mx-auto max-w-2xl">
                <PersonalityConfig personality={personality} onPersonalityChange={setPersonality} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <SaveChatDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={handleSaveChat}
        defaultName={`Chat ${new Date().toLocaleDateString("pt-BR")}`}
      />
    </div>
  )
}
