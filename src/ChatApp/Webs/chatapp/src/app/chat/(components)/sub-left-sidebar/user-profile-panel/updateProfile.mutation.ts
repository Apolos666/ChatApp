import { UserService, userTypesDto } from '@/services/user.service.api/user'
import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'

export function useUpdateLoggedUserProfileMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof UserService.updateLoggedUserProfileMutation>>,
      DefaultError,
      userTypesDto.UpdateUserDto,
      unknown
    >,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  >
) {
  const {
    mutationKey = [],
    onMutate,
    onSuccess,
    onError,
    onSettled
  } = options || {}

  return useMutation({
    mutationKey: ['update-profile', 'logged-user', ...mutationKey],
    onMutate: async (variables) => {
      await onMutate?.(variables)
    },
    mutationFn: async (updateLoggedUserDto: userTypesDto.UpdateUserDto)  => {
      return UserService.updateLoggedUserProfileMutation({ updateLoggedUserProfileDto: updateLoggedUserDto })
    },
    onSuccess: async (response, variables, context) => {
      await onSuccess?.(response, variables, context)
    },
    onError,
    onSettled
  })
}