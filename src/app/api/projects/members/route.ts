import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, userId } = await req.json();

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

  await prisma.projectMember.create({
    data: {
      projectId,
      userId,
    },
  });

  return Response.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, memberId } = await req.json();

  // Check requester is admin
  const requester = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: session.user.id,
      },
    },
  });

  if (requester?.role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Prevent removing the last admin
  const targetMember = await prisma.projectMember.findUnique({
    where: { id: memberId },
  });

  if (targetMember?.role === "ADMIN") {
    const adminCount = await prisma.projectMember.count({
      where: { projectId, role: "ADMIN" },
    });
    if (adminCount <= 1) {
      return Response.json(
        { error: "Cannot remove the last admin from a project" },
        { status: 400 }
      );
    }
  }

  await prisma.projectMember.delete({ where: { id: memberId } });

  return Response.json({ success: true });
}
