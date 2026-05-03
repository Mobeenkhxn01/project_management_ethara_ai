"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { useState } from "react"
import { toast } from "sonner"
import { useAssignTask } from "@/hooks/useAssignTask"

type ProjectMember = {
  user: {
    id: string
    name: string | null
  }
}

type ProjectDetails = {
  id: string
  members: ProjectMember[]
}

interface Props {
  open: boolean
  setOpen: (val: boolean) => void
  project: ProjectDetails
}

export default function AssignTaskDialog({
  open,
  setOpen,
  project,
}: Props) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM")
  const [assigneeId, setAssigneeId] = useState("")

  const assignTask = useAssignTask()

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Task title required")
      return
    }

    if (!assigneeId) {
      toast.error("Select a member")
      return
    }

    try {
      await assignTask.mutateAsync({
        projectId: project.id,
        title,
        description,
        dueDate: dueDate || undefined,
        priority,
        assigneeId,
      })

      toast.success("Task assigned")

      // reset
      setTitle("")
      setDescription("")
      setDueDate("")
      setPriority("MEDIUM")
      setAssigneeId("")
      setOpen(false)
    } catch {
      toast.error("Failed to assign task")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
        </DialogHeader>

        {/* Task Title */}
        <Input
          placeholder="Task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")
            }
            className="border p-2 rounded w-full"
          >
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>
        </div>

        {/* Select Member */}
        <select
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select member</option>
          {project.members.map((m) => (
            <option key={m.user.id} value={m.user.id}>
              {m.user.name}
            </option>
          ))}
        </select>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={assignTask.isPending}
          >
            {assignTask.isPending ? "Assigning..." : "Assign Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}