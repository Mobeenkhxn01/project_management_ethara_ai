import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers";


export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  const { name, description } = await req.json()
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  const project = await prisma.project.create({
    data: {
      name,
      description,
      members: {
        create: {
          userId: user!.id,
          role: "ADMIN",
        },
      },
    },
  })

  return NextResponse.json({ success: true, project })
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  const projects = await prisma.project.findMany({
    where: {
      members: {
        some: {
          userId: user!.id,
        },
      },
    },
    include: {
      members: {
        include: { user: true },
      },
    },
  })

  return NextResponse.json({ projects })
}