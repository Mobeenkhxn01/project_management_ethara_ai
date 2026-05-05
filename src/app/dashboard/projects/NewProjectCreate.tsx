"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useState } from "react"
import { toast } from "sonner"
import { useCreateProject } from "@/hooks/useCreateProject"

interface Props {
  open: boolean
  setOpen: (val: boolean) => void
}

export default function CreateProjectDialog({ open, setOpen }: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  })
  const createProject = useCreateProject()

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim()) {
      toast.error("Project name is required")
      return
    }

    try {
      await createProject.mutateAsync(form)
      toast.success("Project created successfully")
      setForm({ name: "", description: "" })
      setOpen(false)
    } catch {
      toast.error("Failed to create project")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            {/* Project Name */}
            <Field>
              <Label>Project Name *</Label>
              <Input
                placeholder="e.g. Task Manager App"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={createProject.isPending}
              />
            </Field>

            {/* Description */}
            <Field>
              <Label>Description</Label>
              <Input
                placeholder="Optional description..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                disabled={createProject.isPending}
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createProject.isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}