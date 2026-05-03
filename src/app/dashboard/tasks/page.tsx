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
      <div className="p-6 space-y-6">
        <div className="rounded-2xl border bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 text-white">
          <h1 className="text-2xl font-bold">All Tasks</h1>
          <p className="mt-1 text-sm text-slate-200">
            Track project tasks, ownership and execution status in one place.
          </p>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border bg-card p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 className="font-semibold">{task.title}</h2>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <FolderIcon className="size-4" />
                  {task.project.name}
                </p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserIcon className="size-4" />
                  {task.assignee?.name ?? "Unassigned"}
                </p>
                {task.dueDate && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarClockIcon className="size-4" />
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
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
            <p className="text-sm text-muted-foreground">No tasks found yet.</p>
          )}
        </div>
      </div>
    </>
  )
}


