import { useQuery } from "@tanstack/react-query"
import { UserQueries } from "../user.queries"

export const useLoggedInUserProfile = () => {
  return useQuery(UserQueries.loggedInUserProfileQuery())
}