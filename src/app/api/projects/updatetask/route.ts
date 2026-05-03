import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId, status } = await req.json();

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: {
        include: {
          members: true,
        },
      },
    },
  });
  if (!task) {
    return Response.json({ error: "Task not found" }, { status: 404 });
  }

  const currentMember = task.project.members.find(
    (member) => member.userId === session.user.id
  );
  const isAdmin = currentMember?.role === "ADMIN";
  const isAssignee = task.assigneeId === session.user.id;

  if (!isAdmin && !isAssignee) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { status },
    include: {
      assignee: true,
    },
  });

  return Response.json({ success: true, task: updatedTask });
}