import { SiteHeader } from "@/components/site-header";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CalendarClockIcon, FolderIcon, UserIcon } from "lucide-react";

export default async function TasksPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: {
      project: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    include: {
      assignee: true,
      project: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <SiteHeader title="Tasks" />
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="rounded-2xl border bg-linear-to-r from-slate-950 via-slate-900 to-indigo-950 p-4 sm:p-6 text-white">
          <h1 className="text-xl sm:text-2xl font-bold">All Tasks</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-200">
            Track project tasks, ownership and execution status in one place.
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border bg-card p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 md:flex-row md:items-center md:justify-between hover:shadow-md transition"
            >
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-sm sm:text-base line-clamp-2">{task.title}</h2>
                <div className="mt-2 space-y-1 text-xs sm:text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <FolderIcon className="size-4 shrink-0" />
                    <span className="line-clamp-1">{task.project.name}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <UserIcon className="size-4 shrink-0" />
                    <span>{task.assignee?.name ?? "Unassigned"}</span>
                  </p>
                  {task.dueDate && (
                    <p className="flex items-center gap-2">
                      <CalendarClockIcon className="size-4 shrink-0" />
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={task.priority === "HIGH" ? "destructive" : "secondary"}>
                  {task.priority}
                </Badge>
                <Badge variant={task.status === "DONE" ? "default" : "outline"}>
                  {task.status}
                </Badge>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No tasks found yet.</p>
          )}
        </div>
      </div>
    </>
  )
}


