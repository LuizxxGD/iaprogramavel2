import type { SavedChat } from "./types"

const STORAGE_KEY = "ai-assistant-chats"

export const chatStorage = {
  // Load all saved chats from localStorage
  loadChats: (): SavedChat[] => {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return []

      const chats = JSON.parse(stored) as SavedChat[]
      // Convert date strings back to Date objects
      return chats.map((chat) => ({
        ...chat,
        date: new Date(chat.date),
        messages: chat.messages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }))
    } catch (error) {
      console.error("Error loading chats:", error)
      return []
    }
  },

  // Save all chats to localStorage
  saveChats: (chats: SavedChat[]): void => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
    } catch (error) {
      console.error("Error saving chats:", error)
    }
  },

  // Add or update a single chat
  saveChat: (chat: SavedChat): void => {
    const chats = chatStorage.loadChats()
    const existingIndex = chats.findIndex((c) => c.id === chat.id)

    if (existingIndex >= 0) {
      chats[existingIndex] = chat
    } else {
      chats.push(chat)
    }

    chatStorage.saveChats(chats)
  },

  // Delete a chat
  deleteChat: (chatId: string): void => {
    const chats = chatStorage.loadChats()
    const filtered = chats.filter((c) => c.id !== chatId)
    chatStorage.saveChats(filtered)
  },
}
