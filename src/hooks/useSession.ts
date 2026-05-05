import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type SessionData = {
  userId: string;
  email?: string;
  name?: string;
};

export const useSession = () =>
  useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await axios.get<SessionData>("/api/me");
      return res.data;
    },
  });
