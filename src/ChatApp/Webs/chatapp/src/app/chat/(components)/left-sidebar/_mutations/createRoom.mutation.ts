import { RoomService, roomTypesDto } from '@/services/user.service.api/room'
import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'

export function useCreateRoomMutation(
  options?: Pick<
    UseMutationOptions<
      any,
      DefaultError,
      {createRoomDto: roomTypesDto.CreateRoomDto, userIdList?: number[]},
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
    mutationKey: ['create', 'room', ...mutationKey],
    onMutate: async (variables) => {
      await onMutate?.(variables)
    },
    mutationFn: async ({createRoomDto, userIdList}:{createRoomDto: roomTypesDto.CreateRoomDto, userIdList?: number[]})  => {
      const response = await RoomService.createRoomMutation({ createRoomDto })

      if (response.status === 201 && userIdList) {
        const {id: roomId} = response.data
        for (const userId of userIdList) {
          await RoomService.addUserToRoom({roomId, userId})
        }
      }
    },
    onSuccess: async (response, variables, context) => {
      await onSuccess?.(response, variables, context)
    },
    onError,
    onSettled
  })
}