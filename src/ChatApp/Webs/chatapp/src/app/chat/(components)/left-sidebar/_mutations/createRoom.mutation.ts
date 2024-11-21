import { RoomService, roomTypesDto } from '@/services/user.service.api/room'
import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query'

export function useCreateRoomMutation(
  options?: Pick<
    UseMutationOptions<
      Awaited<ReturnType<typeof RoomService.createRoomMutation>>,
      DefaultError,
      roomTypesDto.CreateRoomDto,
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
    mutationFn: async (createRoomDto: roomTypesDto.CreateRoomDto)  => {
      return RoomService.createRoomMutation({ createRoomDto })
    },
    onSuccess: async (response, variables, context) => {
      await onSuccess?.(response, variables, context)
    },
    onError,
    onSettled
  })
}