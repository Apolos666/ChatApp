import { AuthService, authTypesDto } from '@/services/user.service.api/auth'
import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'

export function useChangePasswordMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof AuthService.changePasswordMutation>>,
      DefaultError,
      authTypesDto.ChangePasswordDto,
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
    mutationKey: ['change-password', 'logged-user', ...mutationKey],
    onMutate: async (variables) => {
      await onMutate?.(variables)
    },
    mutationFn: async (changePasswordDto: authTypesDto.ChangePasswordDto)  => {
      return AuthService.changePasswordMutation({ changePasswordDto: changePasswordDto })
    },
    onSuccess: async (response, variables, context) => {
      await onSuccess?.(response, variables, context)
    },
    onError,
    onSettled
  })
}