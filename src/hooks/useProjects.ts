import { useQuery } from "@tanstack/react-query";

import axios from "axios";

export type ProjectDetails = {
  id: string;
  name: string;
  description: string | null;
  members: {
    id: string;
    role: string;
    userId: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }[];
  tasks: {
    id: string;
    title: string;
    assigneeId: string | null;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    description: string | null;
    dueDate: string | Date | null;
    priority: "LOW" | "MEDIUM" | "HIGH";
    assignee: {
      name: string | null;
    } | null;
  }[];
};

export const useProject = (id: string, initialData?: ProjectDetails) =>
  useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const res = await axios.get<ProjectDetails>(`/api/projects/${id}`);
      return res.data;
    },
    initialData,
    enabled: Boolean(id),
  });