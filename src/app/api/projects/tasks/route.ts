import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, title, assigneeId, description, dueDate, priority } =
    await req.json();

  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: session.user.id,
      },
    },
  });

  if (member?.role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const task = await prisma.task.create({
    data: {
      title,
      projectId,
      assigneeId,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority: priority ?? "MEDIUM",
      creatorId: session.user.id,
    },
    include: {
      assignee: true,
    },
  });

  return Response.json({ success: true, task });
}