import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type RemoveMemberPayload = {
  projectId: string;
  memberId: string;
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RemoveMemberPayload) => {
      await axios.delete("/api/projects/members", {
        data,
      });
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({
        queryKey: ["project", vars.projectId],
      });
    },
  });
};
