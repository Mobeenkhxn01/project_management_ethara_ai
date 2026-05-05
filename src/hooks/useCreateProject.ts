import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type CreateProjectPayload = {
  name: string;
  description?: string;
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectPayload) => {
      const res = await axios.post("/api/projects", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
