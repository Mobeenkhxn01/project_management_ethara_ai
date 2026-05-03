import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type UpdateTaskPayload = {
  projectId: string;
  taskId: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

export const useUpdateTask = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTaskPayload) =>
      axios.post("/api/projects/updatetask", data),

    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["project", vars.projectId] });
    },
  });
};