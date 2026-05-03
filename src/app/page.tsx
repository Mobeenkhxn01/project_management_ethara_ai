import Navbar from "@/components/layout/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 pt-28 pb-12 space-y-16">
        <section className="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Team Task Management for
              <span className="text-blue-600"> Modern Collaboration</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Create projects, assign tasks, track progress, and keep teams aligned
              with role-based workflows for admins and members.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="px-5 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Get Started
              </Link>
              <Link
                href="/dashboard"
                className="px-5 py-3 rounded-md border font-medium hover:bg-muted"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <Image
              src="/dashboard-preview.png"
              alt="Dashboard Preview"
              width={900}
              height={500}
              className="rounded-xl border shadow-lg"
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-white dark:bg-zinc-950 p-5">
            <h3 className="font-semibold text-lg">Project Management</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Create projects, add members, and keep ownership clear through Admin and Member roles.
            </p>
          </div>
          <div className="rounded-xl border bg-white dark:bg-zinc-950 p-5">
            <h3 className="font-semibold text-lg">Task Lifecycle</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Assign tasks with due dates and priority, then track status from To Do to Done.
            </p>
          </div>
          <div className="rounded-xl border bg-white dark:bg-zinc-950 p-5">
            <h3 className="font-semibold text-lg">Dashboard Insights</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Monitor total tasks, status distribution, per-user workload, and overdue items.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
