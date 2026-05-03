import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type AddMemberPayload = {
  projectId: string;
  userId: string;
};

export const useAddMember = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: AddMemberPayload) =>
      axios.post("/api/projects/members", data),

    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ["project", vars.projectId],
      });
    },
  });
};