import { UserService, userTypesDto } from "@/services/user.service.api/user"
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query"
import { transformUserDtoToUser } from "./user.lib"
import { UsersByNameFilterQuery } from "./user.types"

export class UserQueries {
  static readonly keys = {
    root: ['user'] as const,
    rootInfinity: ['article', 'infinite-articles'] as const
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

  static usersByNameInfiniteQuery(filter: UsersByNameFilterQuery) {
    const {
      name,
      pageSize = 10,
      pageNumber = 1,
      sortBy = 'id',
      sortDir = 'ASC'
    } = filter

    const queryKey = [
      ...this.keys.rootInfinity,
      'by-filter',
      {name},
      {pageSize} ,
      {pageNumber} ,
      {sortBy} ,
      {sortDir}
    ].filter(Boolean) as string[]

    return infiniteQueryOptions({
      queryKey,
      queryFn: async ({ pageParam }) => {
        const response = await UserService.usersByNameQuery({
          params: {
            pageSize,
            pageNumber: pageParam,
            name,
            sortBy,
            sortDir,
          }
        })

        return response.data
      },
      initialPageParam: pageNumber || 1,
      getNextPageParam: (lastPage: userTypesDto.UsersByNameDto) => {
        return lastPage.last ? undefined : lastPage.pageNumber + 1
      },
      getPreviousPageParam: (firstPage) => {
        return firstPage.pageNumber > 1 ? firstPage.pageNumber - 1 : undefined
      }
    })
  }
}