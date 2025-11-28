"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SaveChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (name: string) => void
  defaultName?: string
}

export function SaveChatDialog({ open, onOpenChange, onSave, defaultName = "" }: SaveChatDialogProps) {
  const [name, setName] = useState(defaultName)

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim())
      setName("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salvar Chat</DialogTitle>
          <DialogDescription>Dê um nome para este chat para encontrá-lo facilmente depois.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="chat-name">Nome do Chat</Label>
          <Input
            id="chat-name"
            placeholder="Ex: Conversa sobre produtividade"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave()
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
