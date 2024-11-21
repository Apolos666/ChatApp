import { RoomService, roomTypesDto } from '@/services/user.service.api/room'
import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'

export function useRemoveUserFromRoom(
  options?: Pick<
    UseMutationOptions<
      any,
      DefaultError,
      {roomId: number, userId: number},
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
    mutationKey: ['remove-user', 'room', ...mutationKey],
    onMutate: async (variables) => {
      await onMutate?.(variables)
    },
    mutationFn: async ({roomId, userId}: {roomId: number, userId: number})  => {
      return RoomService.removeUserFromRoom({roomId, userId})
    },
    onSuccess: async (response, variables, context) => {
      await onSuccess?.(response, variables, context)
    },
    onError,
    onSettled
  })
}