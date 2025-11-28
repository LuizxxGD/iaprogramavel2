"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { PERSONALITY_PRESETS, type PresetName } from "@/lib/presets"
import type { PersonalityConfig as PersonalityConfigType } from "@/lib/types"
import { Sparkles, Smile, Briefcase, Heart } from "lucide-react"

interface PersonalityConfigProps {
  personality: PersonalityConfigType
  onPersonalityChange: (personality: PersonalityConfigType) => void
}

const PRESET_ICONS: Record<PresetName, React.ReactNode> = {
  Sério: <Briefcase className="h-4 w-4" />,
  Engraçado: <Smile className="h-4 w-4" />,
  Sarcasticão: <Sparkles className="h-4 w-4" />,
  Apoiador: <Heart className="h-4 w-4" />,
}

export function PersonalityConfig({ personality, onPersonalityChange }: PersonalityConfigProps) {
  const [activePreset, setActivePreset] = useState<PresetName | null>("Apoiador")

  const handleSliderChange = (trait: keyof PersonalityConfigType, value: number[]) => {
    onPersonalityChange({
      ...personality,
      [trait]: value[0],
    })
    setActivePreset(null) // Clear active preset when manually adjusting
  }

  const handlePresetClick = (presetName: PresetName) => {
    onPersonalityChange(PERSONALITY_PRESETS[presetName])
    setActivePreset(presetName)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuração de Personalidade</CardTitle>
        <CardDescription>Ajuste os traços da IA ou escolha um preset</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Buttons */}
        <div className="space-y-2">
          <Label>Presets Rápidos</Label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(PERSONALITY_PRESETS) as PresetName[]).map((presetName) => (
              <Button
                key={presetName}
                variant={activePreset === presetName ? "default" : "outline"}
                onClick={() => handlePresetClick(presetName)}
                className="justify-start"
              >
                {PRESET_ICONS[presetName]}
                {presetName}
              </Button>
            ))}
          </div>
        </div>

        {/* Trait Sliders */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="humor-slider">Humor</Label>
              <span className="text-sm text-muted-foreground">{personality.humor}</span>
            </div>
            <Slider
              id="humor-slider"
              value={[personality.humor]}
              onValueChange={(value) => handleSliderChange("humor", value)}
              min={0}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sarcasmo-slider">Sarcasmo</Label>
              <span className="text-sm text-muted-foreground">{personality.sarcasmo}</span>
            </div>
            <Slider
              id="sarcasmo-slider"
              value={[personality.sarcasmo]}
              onValueChange={(value) => handleSliderChange("sarcasmo", value)}
              min={0}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="seriedade-slider">Seriedade</Label>
              <span className="text-sm text-muted-foreground">{personality.seriedade}</span>
            </div>
            <Slider
              id="seriedade-slider"
              value={[personality.seriedade]}
              onValueChange={(value) => handleSliderChange("seriedade", value)}
              min={0}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="empatia-slider">Empatia</Label>
              <span className="text-sm text-muted-foreground">{personality.empatia}</span>
            </div>
            <Slider
              id="empatia-slider"
              value={[personality.empatia]}
              onValueChange={(value) => handleSliderChange("empatia", value)}
              min={0}
              max={100}
              step={1}
            />
          </div>
        </div>

        {/* Active Preset Indicator */}
        {activePreset && (
          <div className="rounded-lg bg-primary/10 p-3 text-sm">
            <p className="text-foreground">
              <span className="font-medium">Preset ativo:</span> {activePreset}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
