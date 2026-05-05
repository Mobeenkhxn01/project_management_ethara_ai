import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ProjectClient from "./ProjectClients";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    redirect("/login");
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
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        Project not found
      </div>
    );
  }

  // ✅ CORRECT ADMIN CHECK
  const currentMember = project.members.find(
    (m) => m.userId === session?.user?.id
  );

  if (!currentMember) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl">
        You are not a member of this project
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Project Info */}
      <div className="rounded-2xl border bg-linear-to-r from-indigo-950 via-blue-950 to-purple-950 p-4 sm:p-6 text-white">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge className="bg-white/20 text-white hover:bg-white/20 text-xs sm:text-sm">Project Workspace</Badge>
          <Badge className="bg-white/10 text-white hover:bg-white/10 text-xs sm:text-sm">
            {project.members.length} Member(s)
          </Badge>
          <Badge className="bg-white/10 text-white hover:bg-white/10 text-xs sm:text-sm">
            {project.tasks.length} Task(s)
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold line-clamp-2">{project.name}</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-200 line-clamp-3">
          {project.description || "No description provided"}
        </p>
        <p className="text-xs sm:text-sm mt-3 text-slate-100">
          Your Role: <span className="font-semibold">{currentMember.role}</span>
        </p>
      </div>

      {/* 4 Cards */}
      <ProjectClient
        projectId={id}
        userId={session.user.id}
        initialProject={project}
      />
    </div>
  );
}