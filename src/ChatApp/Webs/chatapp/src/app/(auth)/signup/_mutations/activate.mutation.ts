import { AuthService, authTypesDto } from '@/services/user.service.api/auth'
import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'

export function useActivateAccountMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof AuthService.activateAccountMutation>>,
      DefaultError,
      authTypesDto.ActivateAccountDto,
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
    mutationKey: ['activate', 'register', ...mutationKey],
    onMutate: async (variables) => {
      await onMutate?.(variables)
    },
    mutationFn: async (activateAccountDto: authTypesDto.ActivateAccountDto)  => {
      return AuthService.activateAccountMutation({ activateAccountDto })
    },
    onSuccess: async (response, variables, context) => {
      await onSuccess?.(response, variables, context)
    },
    onError,
    onSettled
  })
}