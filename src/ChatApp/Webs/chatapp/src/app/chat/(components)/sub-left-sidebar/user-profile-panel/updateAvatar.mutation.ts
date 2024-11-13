import { UserService, userTypesDto } from '@/services/user.service.api/user'
import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'

export function useUpdateLoggedUserAvatarMutation(
  options?: Pick<
    UseMutationOptions<
      any,
      DefaultError,
      FormData,
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
    mutationKey: ['update-avatar', 'logged-user', ...mutationKey],
    onMutate: async (variables) => {
      await onMutate?.(variables)
    },
    mutationFn: async (formData: FormData)  => {
      return UserService.updateUserAvatarMutation(formData)
    },
    onSuccess: async (response, variables, context) => {
      await onSuccess?.(response, variables, context)
    },
    onError,
    onSettled
  })
}