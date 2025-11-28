export const audioUtils = {
  // Convert audio blob to base64 for API transmission
  blobToBase64: (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        resolve(base64.split(",")[1])
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  },

  // Play audio from URL or blob
  playAudio: async (source: string | Blob): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio()

      if (typeof source === "string") {
        audio.src = source
      } else {
        audio.src = URL.createObjectURL(source)
      }

      audio.onended = () => {
        if (typeof source !== "string") {
          URL.revokeObjectURL(audio.src)
        }
        resolve()
      }

      audio.onerror = reject
      audio.play().catch(reject)
    })
  },

  // Transcribe audio using API
  transcribeAudio: async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData()
    formData.append("audio", audioBlob, "recording.webm")

    const response = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Transcription failed")
    }

    const data = await response.json()
    return data.text
  },

  // Generate TTS audio
  generateTTS: async (text: string): Promise<Blob> => {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error("TTS generation failed")
    }

    return await response.blob()
  },
}
