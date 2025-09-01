"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

type Task = { title: string; description?: string }
type Column = { id: string; title: string; tasks: Task[] }
type GenerateResult = { columns: Column[] }

export function AiAssistant(props: {
  getBoard: () => { columns: Column[] }
  addTasks: (tasks: Task[], status: string) => Promise<void> | void
}) {
  const { getBoard, addTasks } = props
  const { toast } = useToast()
  const [open, setOpen] = React.useState(false)
  const [prompt, setPrompt] = React.useState("")
  const [loading, setLoading] = React.useState<"idle" | "generate" | "summarize">("idle")
  const [summary, setSummary] = React.useState<string | null>(null)

  async function onGenerate() {
    if (!prompt.trim()) {
      toast({ title: "Enter a prompt", description: "Describe what tasks you want created." })
      return
    }
    try {
      setLoading("generate")
      const res = await fetch("/api/users/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: "generate", prompt }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = (await res.json()) as { result: GenerateResult }
      const todoCol = data?.result?.columns?.find((c) => c.id === "todo") || data?.result?.columns?.[0]
      const tasks = (todoCol?.tasks || []).map((t) => ({ title: t.title, description: t.description }))
      await addTasks(tasks, todoCol?.id || "todo")
      toast({ title: "Tasks created", description: `Added ${tasks.length} task(s).` })
      setOpen(false)
      setPrompt("")
      setSummary(null)
    } catch (e: any) {
      toast({
        title: "AI error",
        description: e?.message || "Failed to generate tasks. Ensure xAI is configured.",
        variant: "destructive",
      })
    } finally {
      setLoading("idle")
    }
  }

  async function onSummarize() {
    try {
      setLoading("summarize")
      const board = getBoard()
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: "summarize", board }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = (await res.json()) as { summary: string }
      setSummary(data.summary)
    } catch (e: any) {
      toast({
        title: "AI error",
        description: e?.message || "Failed to summarize. Ensure xAI is configured.",
        variant: "destructive",
      })
    } finally {
      setLoading("idle")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button aria-label="Open AI Assist" className="h-12">
          AI Assist
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-pretty">Generate tasks with AI</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <label className="text-sm font-medium" htmlFor="ai-prompt">
            Describe what you need
          </label>
          <Textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Set up onboarding flow with signup, email verification, and walkthrough."
            className="min-h-[120px]"
          />
          <div className="flex items-center justify-between">
            <Badge variant="secondary">Grok-4</Badge>
            <div className="flex items-center gap-2">
              <Button onClick={onSummarize} variant="secondary" disabled={loading !== "idle"} aria-label="Summarize">
                {loading === "summarize" ? "Summarizing..." : "Summarize board"}
              </Button>
              <Button onClick={onGenerate} disabled={loading !== "idle"} aria-label="Generate">
                {loading === "generate" ? "Generating..." : "Generate tasks"}
              </Button>
            </div>
          </div>
          {summary ? <div className="rounded-md border p-3 text-sm leading-relaxed bg-muted">{summary}</div> : null}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AiAssistant
