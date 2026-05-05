import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Project = {
  id: string;
  name: string;
  description?: string;
  members: {
    userId: string;
    role: string;
  }[];
};

export const useProjectsList = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await axios.get<{ projects: Project[] }>("/api/projects");
      return res.data.projects;
    },
  });
