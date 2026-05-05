import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      await axios.delete(`/api/tasks/${taskId}`);
    },
    onSuccess: (_, __, context: any) => {
      if (context?.projectId) {
        queryClient.invalidateQueries({
          queryKey: ["project", context.projectId],
        });
      }
    },
  });
};
