import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export type UserSummary = {
  id: string
  name: string | null
  email: string
}

export const useUsers = (search: string) => {
  return useQuery<UserSummary[]>({
    queryKey: ["users", search],
    queryFn: async () => {
      if (!search) return []

      const res = await axios.get<{ users: UserSummary[] }>(
        `/api/users?search=${search}`
      )
      return res.data.users
    },
    enabled: !!search,
  })
}