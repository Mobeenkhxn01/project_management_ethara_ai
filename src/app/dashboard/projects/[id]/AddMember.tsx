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

import { useState } from "react"
import { toast } from "sonner"

import { useUsers, type UserSummary } from "@/hooks/useUsers"
import { useAddMember } from "@/hooks/useAddMembers"

interface Props {
  open: boolean
  setOpen: (val: boolean) => void
  projectId: string
}

export default function AddMember({ open, setOpen, projectId }: Props) {
  const [query, setQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null)

  const { data: users = [], isLoading } = useUsers(query)
  const addMember = useAddMember()

  const handleSubmit = async () => {
    if (!selectedUser) {
      toast.error("Please select a user")
      return
    }

    try {
      await addMember.mutateAsync({
        projectId,
        userId: selectedUser.id,
      })

      toast.success("Member added successfully")

      // reset
      setQuery("")
      setSelectedUser(null)
      setOpen(false)
    } catch {
      toast.error("Failed to add member")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md space-y-4">
        
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>

        {/* 🔍 Search Input */}
        <Input
          placeholder="Search user by name or email..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedUser(null)
          }}
        />

        {/* 🔄 Loading */}
        {isLoading && (
          <p className="text-sm text-gray-500">Searching...</p>
        )}

        {/* 👥 User List */}
        {!selectedUser && users.length > 0 && (
          <div className="border rounded max-h-40 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  setSelectedUser(user)
                  setQuery(user.name ?? user.email)
                }}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Selected */}
        {selectedUser && (
          <div className="rounded-lg border bg-emerald-50 px-3 py-2 text-sm">
            <p className="font-medium text-emerald-700">
              Selected: {selectedUser.name ?? "Unnamed user"}
            </p>
            <p className="text-emerald-600">{selectedUser.email}</p>
            <Button
              variant="ghost"
              className="mt-2 h-7 px-2 text-xs"
              onClick={() => {
                setSelectedUser(null)
                setQuery("")
              }}
            >
              Change selection
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={addMember.isPending}
          >
            {addMember.isPending ? "Adding..." : "Add Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}