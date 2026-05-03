import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type AssignTaskPayload = {
  projectId: string;
  title: string;
  assigneeId: string;
    description?: string;
    dueDate?: string;
    priority?: "LOW" | "MEDIUM" | "HIGH";
};

export const useAssignTask = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignTaskPayload) =>
      axios.post("/api/projects/tasks", data),

    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["project", vars.projectId],
      });
    },
  });
};