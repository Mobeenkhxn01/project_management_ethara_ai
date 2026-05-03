import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { status, assigneeId, title, description } = await req.json()
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          members: true,
        },
      },
    },
  })
  if (!existingTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  const currentMember = existingTask.project.members.find(
    (member) => member.userId === session.user.id
  )
  if (!currentMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const isAdmin = currentMember.role === "ADMIN"
  const isAssignee = existingTask.assigneeId === session.user.id
  if (!isAdmin && !isAssignee) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      status,
      assigneeId: isAdmin ? assigneeId : existingTask.assigneeId,
      title: isAdmin ? title : existingTask.title,
      description: isAdmin ? description : existingTask.description,
    },
    include: {
      assignee: true,
    },
  })

  return NextResponse.json({ task })
}