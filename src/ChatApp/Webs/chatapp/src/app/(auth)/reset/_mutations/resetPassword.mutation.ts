import { AuthService, authTypesDto } from '@/services/user.service.api/auth'
import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'

export function useResetPasswordMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof AuthService.registerMutation>>,
      DefaultError,
      authTypesDto.ResetPasswordDto,
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
    mutationKey: ['reset-password', ...mutationKey],
    onMutate: async (variables) => {
      await onMutate?.(variables)
    },
    mutationFn: async (resetPasswordDto: authTypesDto.ResetPasswordDto)  => {
      return AuthService.resetPasswordMutation({ resetPasswordDto })
    },
    onSuccess: async (response, variables, context) => {
      await onSuccess?.(response, variables, context)
    },
    onError,
    onSettled
  })
}