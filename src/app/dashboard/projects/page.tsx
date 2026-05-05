"use client";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import NewProjectDialog from "./NewProjectCreate";
import Link from "next/link";
import { FolderKanbanIcon, UsersIcon, Trash2Icon } from "lucide-react";
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
import { toast } from "sonner";
import { useProjectsList } from "@/hooks/useProjectsList";
import { useDeleteProject } from "@/hooks/useDeleteProject";
import { useSession } from "@/hooks/useSession";

export default function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const { data: projects, isLoading } = useProjectsList();
  const { data: session } = useSession();
  const deleteProject = useDeleteProject();

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  return (
    <>
      <SiteHeader title="Projects" />

      <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 rounded-2xl border bg-linear-to-r from-indigo-950 via-blue-950 to-slate-900 p-4 sm:p-6 text-white md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">Projects</h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              Manage your team workspaces and collaborate effectively.
            </p>
          </div>
          <Button onClick={() => setOpen(true)} className="w-full md:w-auto mt-2 md:mt-0 bg-white text-indigo-950 hover:bg-slate-100 font-semibold">Create New Project</Button>
        </div>

        {/* Projects List */}
        {isLoading ? (
          <div className="rounded-xl border p-8 text-center text-muted-foreground">
            Loading projects...
          </div>
        ) : !projects || projects.length === 0 ? (
          <div className="rounded-xl border p-8 text-center text-muted-foreground">
            No projects found
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project) => {
              const isAdmin = project.members.some(
                (m) => m.userId === session?.userId && m.role === "ADMIN"
              );
              return (
                <div key={project.id} className="border rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition bg-card flex flex-col">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="block flex-1 p-4 sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h2 className="text-base sm:text-lg font-semibold line-clamp-2 flex-1">{project.name}</h2>
                      <FolderKanbanIcon className="size-5 shrink-0 text-muted-foreground" />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {project.description || "No description"}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <UsersIcon className="size-4 shrink-0" />
                      <span>{project.members.length} member(s)</span>
                    </div>
                  </Link>

                  {isAdmin && (
                    <div className="border-t p-3 sm:p-4">
                      <AlertDialog>
                        <AlertDialogTrigger render={<Button
                            size="sm"
                            className="w-full bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all gap-2"
                            disabled={deleteProject.isPending}
                            onClick={(e) => e.preventDefault()}
                          >
                            <Trash2Icon className="size-4" />
                            <span className="hidden sm:inline">Delete Project</span>
                            <span className="sm:hidden">Delete</span>
                          </Button>}/>
                          
                    
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete <strong>{project.name}</strong> along with all its tasks and member relationships. This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProject(project.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Yes, Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <NewProjectDialog
          open={open}
          setOpen={setOpen}
        />
      </div>
    </>
  );
}
