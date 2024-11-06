import { UserService } from "@/services/user.service.api/user"
import { queryOptions } from "@tanstack/react-query"
import { transformUserDtoToUser } from "./user.lib"

export class UserQueries {
  static readonly keys = {
    root: ['user'] as const
  }

  static loggedInUserProfileQuery() {
    return queryOptions({
      queryKey: [ this.keys, 'profile', 'me' ],
      queryFn: async () => {
        const response = await UserService.loggedUserProfileQuery()
        return transformUserDtoToUser(response.data)
      }
    })
  }
}