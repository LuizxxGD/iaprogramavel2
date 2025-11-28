import type { PersonalityConfig, PresetName } from "./types"

export const PERSONALITY_PRESETS: Record<PresetName, PersonalityConfig> = {
  Sério: {
    seriedade: 90,
    sarcasmo: 0,
    humor: 5,
    empatia: 40,
  },
  Engraçado: {
    humor: 85,
    sarcasmo: 10,
    seriedade: 10,
    empatia: 50,
  },
  Sarcasticão: {
    sarcasmo: 90,
    humor: 30,
    seriedade: 20,
    empatia: 10,
  },
  Apoiador: {
    empatia: 95,
    humor: 20,
    seriedade: 30,
    sarcasmo: 0,
  },
}

export const DEFAULT_PERSONALITY: PersonalityConfig = PERSONALITY_PRESETS["Apoiador"]
