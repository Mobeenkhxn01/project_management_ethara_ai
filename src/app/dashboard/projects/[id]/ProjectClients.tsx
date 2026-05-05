"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AddMember from "./AddMember";
import AssignTaskDialog from "./AssignTaskDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUpdateTask } from "@/hooks/useUpdateTask";
import { useProject, type ProjectDetails } from "@/hooks/useProjects";
import { useDeleteProject } from "@/hooks/useDeleteProject";
import { useRemoveMember } from "@/hooks/useRemoveMember";
import { useDeleteTask as useDeleteTaskMutation } from "@/hooks/useDeleteTask";
import { UsersIcon, ClipboardListIcon, Trash2Icon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

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
  const deleteProject = useDeleteProject();
  const removeMember = useRemoveMember();
  const deleteTask = useDeleteTaskMutation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: project,
    isLoading,
    isError,
  } = useProject(projectId, initialProject);

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
        Loading project details...
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="rounded-xl border bg-card p-6 text-sm text-red-500">
        Unable to load project details.
      </div>
    );
  }

  const currentMember = project.members.find(
    (member: { userId: string; role: string }) => member.userId === userId,
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

  const handleDeleteProject = async () => {
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push("/dashboard/projects");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember.mutateAsync({ projectId, memberId });
      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove member");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask.mutateAsync(taskId);
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "DONE") return <Badge>Done</Badge>;
    if (status === "IN_PROGRESS")
      return <Badge variant="secondary">In Progress</Badge>;
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

      <div className="space-y-4 sm:space-y-6">
        {/* Admin Action Cards */}
        {isAdmin && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-xl border bg-card p-3 sm:p-4 shadow-sm hover:shadow-md transition">
              <div className="mb-3 flex items-center gap-2">
                <UsersIcon className="size-4 text-indigo-600" />
                <h2 className="text-sm sm:text-base font-semibold">
                  Add Member
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Invite teammates to this project.
              </p>
              <Button
                onClick={() => setOpenMember(true)}
                className="w-full bg-linear-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all"
              >
                Add Member
              </Button>
            </div>

            <div className="rounded-xl border bg-card p-3 sm:p-4 shadow-sm hover:shadow-md transition">
              <div className="mb-3 flex items-center gap-2">
                <ClipboardListIcon className="size-4 text-orange-500" />
                <h2 className="text-sm sm:text-base font-semibold">
                  Assign Task
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Create and assign tasks to members.
              </p>
              <Button
                onClick={() => setOpenTask(true)}
                className="w-full bg-linear-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all"
              >
                Assign Task
              </Button>
            </div>

            {/* Delete Project */}
            <div className="rounded-xl border border-red-200 bg-card p-3 sm:p-4 shadow-sm hover:shadow-md transition">
              <div className="mb-3 flex items-center gap-2">
                <Trash2Icon className="size-4 text-red-500" />
                <h2 className="text-sm sm:text-base font-semibold">
                  Delete Project
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Permanently delete this project and all its tasks.
              </p>
              <AlertDialog>
                <AlertDialogTrigger render={<Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all"
                    disabled={deleteProject.isPending}
                  >
                    Delete Project
                  </Button>} />
                  
               
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the project along with all
                      members and tasks. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteProject}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Members List */}
          <div className="border rounded-xl p-3 sm:p-4 shadow-sm bg-card">
            <h2 className="text-base sm:text-lg font-semibold mb-3">Members</h2>
            <ul className="space-y-2">
              {project.members.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded-md px-3 py-2 bg-white/70 dark:bg-zinc-900 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">
                      {m.user.name ?? "Unnamed user"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {m.user.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <Badge variant="outline">{m.role}</Badge>
                    {isAdmin && m.userId !== userId && (
                      <AlertDialog>
                        <AlertDialogTrigger render={<Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 h-7"
                            disabled={removeMember.isPending}
                          >
                            <Trash2Icon className="size-3.5" />
                          </Button>} />
                          
                    
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Member?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Remove <strong>{m.user.name}</strong> from this
                              project? Their tasks will remain but they will
                              lose access.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveMember(m.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Tasks List */}
          <div className="border rounded-xl p-3 sm:p-4 shadow-sm bg-card">
            <h2 className="text-base sm:text-lg font-semibold mb-3">Tasks</h2>
            <ul className="space-y-2 sm:space-y-3">
              {project.tasks.map((task) => (
                <li
                  key={task.id}
                  className="border p-2 sm:p-4 rounded-lg flex flex-col gap-2 sm:gap-3 text-sm"
                >
                  <div className="flex-1">
                    <p className="font-medium line-clamp-2">{task.title}</p>
                    {task.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Assigned to: {task.assignee?.name ?? "Unassigned"}
                    </p>
                    {task.dueDate && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    {getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status)}
                    {(task.assigneeId === userId || isAdmin) &&
                      task.status !== "DONE" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markTaskDone(task.id)}
                          disabled={updateTask.isPending}
                          className="text-xs"
                        >
                          Mark Done
                        </Button>
                      )}
                    {isAdmin && (
                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 h-7"
                              disabled={deleteTask.isPending}
                            >
                              <Trash2Icon className="size-3.5" />
                            </Button>
                          }
                        />
                        ]
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete{" "}
                              <strong>{task.title}</strong>? This cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteTask(task.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </li>
              ))}
              {project.tasks.length === 0 && (
                <li className="text-xs sm:text-sm text-muted-foreground text-center py-4">
                  No tasks found yet.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
