import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      members: {
        include: { user: true },
      },
      tasks: {
        include: { assignee: true },
      },
    },
  });
  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  const isMember = project.members.some((member) => member.userId === session.user.id);
  if (!isMember) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return Response.json(project);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId: id,
        userId: session.user.id,
      },
    },
  });

  if (member?.role !== "ADMIN") {
    return Response.json({ error: "Forbidden – only admins can delete projects" }, { status: 403 });
  }

  // Cascade: tasks and members are deleted via onDelete: Cascade in schema
  await prisma.project.delete({ where: { id } });

  return Response.json({ success: true });
}
