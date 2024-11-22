import { RoomService, roomTypesDto } from '@/services/user.service.api/room'
import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

export function useAddUserToRoom(
  options?: Pick<
    UseMutationOptions<
      number[],
      DefaultError,
      { roomId: number, userIdList: number[] },
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
    mutationKey: ['add-user', 'room', ...mutationKey],
    onMutate: async (variables) => {
      await onMutate?.(variables)
    },
    mutationFn: async ({roomId, userIdList}: { roomId: number, userIdList: number[] })  => {
      for (const userId of userIdList) {
        await RoomService.addUserToRoom({roomId, userId})
      }
      return userIdList
    },
    onSuccess: async (response, variables, context) => {
      await onSuccess?.(response, variables, context)
    },
    onError,
    onSettled
  })
}