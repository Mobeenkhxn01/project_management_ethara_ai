import { SiteHeader } from "@/components/site-header"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import {
  CheckCircle2Icon,
  CircleDashedIcon,
  Clock3Icon,
  ListTodoIcon,
  TriangleAlertIcon,
} from "lucide-react"

export default function Page() {
  return <DashboardPage />
}

async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    redirect("/login")
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
    },
  })

  const totalTasks = tasks.length
  const todoTasks = tasks.filter((task) => task.status === "TODO").length
  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length
  const doneTasks = tasks.filter((task) => task.status === "DONE").length
  const overdueTasks = tasks.filter(
    (task) =>
      task.status !== "DONE" &&
      task.dueDate !== null &&
      new Date(task.dueDate) < new Date()
  ).length

  const tasksPerUser = tasks.reduce<Record<string, number>>((acc, task) => {
    const key = task.assignee?.name ?? "Unassigned"
    acc[key] = (acc[key] ?? 0) + 1
    return acc
  }, {})

  const statCards = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: ListTodoIcon,
      chip: "All",
    },
    {
      title: "To Do",
      value: todoTasks,
      icon: CircleDashedIcon,
      chip: "Pending",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: Clock3Icon,
      chip: "Active",
    },
    {
      title: "Done",
      value: doneTasks,
      icon: CheckCircle2Icon,
      chip: "Completed",
    },
    {
      title: "Overdue",
      value: overdueTasks,
      icon: TriangleAlertIcon,
      chip: "Attention",
    },
  ]

  return (
    <>
      <SiteHeader title="Dashboard" />
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="rounded-2xl border bg-linear-to-r from-slate-950 via-slate-900 to-blue-950 p-4 sm:p-6 text-white">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 md:items-center">
            <div>
              <Badge variant="secondary" className="mb-2 sm:mb-3 bg-white/15 text-white text-xs sm:text-sm">
                Productivity Hub
              </Badge>
              <h2 className="text-xl sm:text-2xl font-bold">Team Task Overview</h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-200">
                Track progress across all your projects.
              </p>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Manage workload, monitor delivery and keep collaboration smooth.
              </p>
            </div>
            <Image
              src="/dashboard-hero"
              alt="Dashboard analytics visual"
              width={1200}
              height={420}
              className="h-auto w-full rounded-xl border border-white/10 hidden sm:block"
              priority
            />
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-semibold">Snapshot</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Track progress across all your projects.
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {statCards.map((stat) => (
            <Card key={stat.title} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-4">
                <CardTitle className="text-xs sm:text-sm font-medium line-clamp-2">{stat.title}</CardTitle>
                <stat.icon className="size-4 shrink-0 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-semibold">{stat.value}</div>
                <p className="mt-2 text-xs text-muted-foreground">{stat.chip}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Tasks Per User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 p-4 sm:p-6 pt-0 sm:pt-0">
            {Object.entries(tasksPerUser).map(([name, count]) => (
              <div key={name} className="flex items-center justify-between rounded-lg border px-3 sm:px-4 py-2 sm:py-3 text-sm">
                <div>
                  <p className="font-medium text-xs sm:text-sm">{name}</p>
                  <p className="text-xs text-muted-foreground">Assigned workload</p>
                </div>
                <Badge variant="outline" className="font-semibold text-xs sm:text-sm">{count} task(s)</Badge>
              </div>
            ))}
            {Object.keys(tasksPerUser).length === 0 && (
              <p className="text-xs sm:text-sm text-muted-foreground text-center py-4">No task data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
