import { PersistedStateKey } from '@/data/persisted-keys'
import { AuthService, authTypesDto } from '@/services/user.service.api/auth'
import { setLocalStorageItem } from '@/utils/local-storage'
import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'

export function useRegisterMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof AuthService.registerMutation>>,
      DefaultError,
      authTypesDto.RegisterDto,
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
    mutationKey: ['register', ...mutationKey],
    onMutate: async (variables) => {
      await onMutate?.(variables)
    },
    mutationFn: async (registerDto: authTypesDto.RegisterDto)  => {
      return AuthService.registerMutation({ registerDto })
    },
    onSuccess: async (response, variables, context) => {
      const { email } = variables
      setLocalStorageItem(PersistedStateKey.EmailBeingUsedForSignup, email)

      await onSuccess?.(response, variables, context)
    },
    onError,
    onSettled
  })
}