import { PersistedStateKey } from '@/data/persisted-keys'
import { setLocalStorageItem } from '@/utils/local-storage'
import { AuthService, authTypesDto } from '@/services/user.service.api/auth'
import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'

export function useLoginMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof AuthService.loginMutation>>,
      DefaultError,
      authTypesDto.LoginDto,
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
    mutationKey: ['sign-in', ...mutationKey],
    onMutate: async (variables) => {
      await onMutate?.(variables)
    },
    mutationFn: async (loginDto: authTypesDto.LoginDto)  => {
      return AuthService.loginMutation({ loginDto })
    },
    onSuccess: async (response, variables, context) => {
      const { accessToken, refreshToken, id } = response.data

      setLocalStorageItem(PersistedStateKey.MeId, id)
      setLocalStorageItem(PersistedStateKey.Token, accessToken)
      setLocalStorageItem(PersistedStateKey.RefreshToken, refreshToken)

      await onSuccess?.(response, variables, context)
    },
    onError,
    onSettled
  })
}