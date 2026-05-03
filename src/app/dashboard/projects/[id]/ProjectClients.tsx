"use client";

import { useState } from "react";
import { toast } from "sonner";
import AddMember from "./AddMember";
import AssignTaskDialog from "./AssignTaskDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUpdateTask } from "@/hooks/useUpdateTask";
import { useProject, type ProjectDetails } from "@/hooks/useProjects";
import { UsersIcon, ClipboardListIcon } from "lucide-react";

type ProjectClientProps = {
  projectId: string;
  userId: string;
  initialProject: ProjectDetails;
};

export default function ProjectClient({
  projectId,
  userId,
  initialProject,
}: ProjectClientProps) {
  const [openMember, setOpenMember] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const updateTask = useUpdateTask();
  const { data: project, isLoading, isError } = useProject(projectId, initialProject);

  if (isLoading) {
    return <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">Loading project details...</div>;
  }

  if (isError || !project) {
    return <div className="rounded-xl border bg-card p-6 text-sm text-red-500">Unable to load project details.</div>;
  }

  const currentMember = project.members.find(
    (member: { userId: string; role: string }) => member.userId === userId
  );
  const isAdmin = currentMember?.role === "ADMIN";

  const markTaskDone = async (taskId: string) => {
    try {
      await updateTask.mutateAsync({ projectId, taskId, status: "DONE" });
      toast.success("Task marked as done");
    } catch {
      toast.error("Failed to update task");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "DONE") return <Badge>Done</Badge>;
    if (status === "IN_PROGRESS") return <Badge variant="secondary">In Progress</Badge>;
    return <Badge variant="outline">To Do</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === "HIGH") return <Badge variant="destructive">High</Badge>;
    if (priority === "MEDIUM") return <Badge variant="secondary">Medium</Badge>;
    return <Badge variant="outline">Low</Badge>;
  };

  return (
    <>
      {/* Dialogs */}
      <AddMember
        open={openMember}
        setOpen={setOpenMember}
        projectId={projectId}
      />

      <AssignTaskDialog
        open={openTask}
        setOpen={setOpenTask}
        project={project}
      />

      {/* Grid */}
      <div className="space-y-6">
        {isAdmin && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <UsersIcon className="size-4 text-indigo-600" />
                <h2 className="text-base font-semibold">Add Member</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Invite teammates to this project.
              </p>
              <Button
                onClick={() => setOpenMember(true)}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700"
              >
                Add Member
              </Button>
            </div>

            <div className="rounded-xl border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <ClipboardListIcon className="size-4 text-orange-500" />
                <h2 className="text-base font-semibold">Assign Task</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Create and assign tasks to members.
              </p>
              <Button
                onClick={() => setOpenTask(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
              >
                Assign Task
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="border rounded-xl p-4 shadow-sm bg-card">
          <h2 className="text-lg font-semibold mb-3">Members</h2>
          <ul className="space-y-2">
            {project.members.map((m) => (
              <li key={m.id} className="flex justify-between items-center border rounded-md px-3 py-2 bg-white/70">
                <div>
                  <p>{m.user.name ?? "Unnamed user"}</p>
                  <p className="text-xs text-muted-foreground">{m.user.email}</p>
                </div>
                <Badge variant="outline">{m.role}</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="border rounded-xl p-4 shadow-sm bg-card md:col-span-1">
          <h2 className="text-lg font-semibold mb-3">Tasks</h2>
          <ul className="space-y-3">
            {project.tasks.map((task) => (
              <li
                key={task.id}
                className="border p-4 rounded-lg flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Assigned to: {task.assignee?.name ?? "Unassigned"}
                  </p>
                  {task.dueDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(task.priority)}
                  {getStatusBadge(task.status)}
                </div>

                {(task.assigneeId === userId || isAdmin) && task.status !== "DONE" && (
                  <Button
                    variant="outline"
                    onClick={() => markTaskDone(task.id)}
                    disabled={updateTask.isPending}
                  >
                    Mark Done
                  </Button>
                )}
              </li>
            ))}
            {project.tasks.length === 0 && (
              <li className="text-sm text-muted-foreground">No tasks found yet.</li>
            )}
          </ul>
        </div>
        </div>
      </div>
    </>
  );
}