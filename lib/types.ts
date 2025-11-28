export interface PersonalityConfig {
  humor: number // 0-100
  sarcasmo: number // 0-100
  seriedade: number // 0-100
  empatia: number // 0-100
}

export type PresetName = "Sério" | "Engraçado" | "Sarcasticão" | "Apoiador"

export interface AIResponse {
  text_short: string
  text_long: string
  speech_text: string
  tone_summary: PersonalityConfig
  action: string[]
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  transcription?: string
  response?: AIResponse
}

export interface SavedChat {
  id: string
  name: string
  date: Date
  personality: PersonalityConfig
  messages: ChatMessage[]
}
