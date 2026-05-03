"use client";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NewProjectDialog from "./NewProjectCreate";
import Link from "next/link";
import { FolderKanbanIcon, UsersIcon } from "lucide-react";

type Project = {
  id: string;
  name: string;
  description?: string;
};

export default function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects
  

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/projects");
        console.log("Fetched projects:", res.data.projects);
        setProjects(res.data.projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <>
      <SiteHeader title="Projects" />

      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-2xl border bg-gradient-to-r from-indigo-950 via-blue-950 to-slate-900 p-6 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-sm text-slate-200 mt-1">
              Manage your team workspaces and collaborate effectively.
            </p>
          </div>

          <Button onClick={() => setOpen(true)}>
            Create New Project
          </Button>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="rounded-xl border p-8 text-center text-muted-foreground">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-xl border p-8 text-center text-muted-foreground">
            No projects found
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="block border rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer bg-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold">{project.name}</h2>
                  <FolderKanbanIcon className="size-5 text-muted-foreground" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {project.description || "No description"}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <UsersIcon className="size-4" />
                  Team workspace
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Dialog */}
        <NewProjectDialog
          open={open}
          setOpen={(val) => {
            setOpen(val);
          }}
        />
      </div>
    </>
  );
}