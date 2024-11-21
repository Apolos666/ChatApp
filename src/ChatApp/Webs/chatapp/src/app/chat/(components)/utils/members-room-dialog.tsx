import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { ReactNode, useState, useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import UserAvatar from '../sub-left-sidebar/user-avatar'
import { useQuery } from '@tanstack/react-query'
import { httpGetPrivate } from '@/services/user.service.api/_req'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useRemoveUserFromRoom } from '../left-sidebar/_mutations/removeUser.mutation'
import { toastSuccess, toastError } from '@/components/shared/Toast'
import ButtonLoading from '@/components/signin/ButtonLoading'
import { queryClient } from '@/providers/query-provider'
import { httpGet } from '@/services/user.service.api/_adminReq'
import ModeratorAuthorizeComp from './moderator-authorize'

interface AddMemberDialogProps {
  trigger: ReactNode
  onAddMember?: (userId: string) => void
}

function UserRoleBadges({ userId, isRoomOwner }: { userId: any; isRoomOwner: boolean }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await httpGet(`/admin/user/${userId}`)
      return response.data
    }
  })

  const { role_id: roleId } = user || {}

  const renderRoleBadges = () => {
    if (roleId && roleId === 1) {
      return <span className='rounded-sm bg-red-400 p-1 text-xs text-white'>Admin</span>
    }
    if (roleId && roleId === 2) {
      return <span className='rounded-sm bg-amber-500 p-1 text-xs text-white'>Moderator</span>
    } else {
      return <span className='rounded-sm bg-blue-500 p-1 text-xs text-white'>User</span>
    }
  }

  return (
    <div className='flex flex-wrap items-center gap-2'>
      {isRoomOwner && <span className='rounded-sm bg-green-600 p-1 text-xs text-white'>Room owner</span>}
      {renderRoleBadges()}
    </div>
  )
}

function DeleteUserDialog({ user, roomId }: { user: any | null; roomId: number | null }) {
  const [open, setOpen] = useState(false)

  const { mutate: removeUserFromRoom, isPending } = useRemoveUserFromRoom({
    onSuccess: async () => {
      toastSuccess('Xóa người dùng khỏi phòng thành công')
      queryClient.invalidateQueries({
        queryKey: ['rooms']
      })
    },
    onError: (error) => {
      toastError('Xóa người dùng khỏi phòng thất bại')
      console.log(error)
    },
    onSettled: () => {
      setOpen(false)
    }
  })

  const handleCancelAction = () => {
    setOpen(false)
  }

  const handleDeleteUser = () => {
    if (roomId && user) {
      removeUserFromRoom({
        roomId,
        userId: user.id
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className='absolute right-0 top-1/2 -translate-y-1/2 rounded-md bg-red-500 px-2 py-1 text-white hover:bg-red-600'>
          Xóa
        </div>
      </DialogTrigger>
      <DialogContent className='max-w-[300px]'>
        <DialogHeader>
          <h3 className='text-center text-lg font-semibold'>Thông báo</h3>
        </DialogHeader>
        <DialogDescription>
          <p className='text-center text-base text-red-500'>Bạn sẽ xóa người dùng này ra khỏi phòng chat</p>
        </DialogDescription>
        <div className='flex w-full justify-between gap-4'>
          <ButtonLoading
            disabled={isPending}
            onClick={handleCancelAction}
            className='flex-1 bg-gray-300 text-sm text-black hover:bg-black hover:text-white'
          >
            Hủy
          </ButtonLoading>
          <ButtonLoading
            loading={isPending}
            disabled={isPending}
            onClick={handleDeleteUser}
            className='flex-1 bg-red-500 text-sm hover:bg-red-600'
          >
            Xóa
          </ButtonLoading>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const MemberRoomDialog = ({ trigger, onAddMember }: AddMemberDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)

  const { data: rooms } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await httpGetPrivate('/management/rooms')
      return response.data
    }
  })

  const currentRoomId = useAppSelector((state) => state.room.selectedRoomId)

  const currentRoom = useMemo(() => {
    if (!rooms || !currentRoomId) return

    return rooms.find((room: any) => room.id === currentRoomId)
  }, [currentRoomId, rooms])

  console.log('CURRENT ROOM:', currentRoom)

  const filteredUsers = useMemo(() => {
    return currentRoom?.members
  }, [currentRoom])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>Thành viên nhóm</DialogTitle>
        </DialogHeader>
        <div className='mt-4 space-y-4'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Tìm kiếm theo tên hoặc email...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 focus-visible:ring-2'
            />
          </div>
          <div className='custom-scrollbar mt-2 max-h-[300px] overflow-y-auto pr-2'>
            {filteredUsers?.map((user: any) => (
              <div
                key={user.id}
                className='group mb-2 cursor-pointer rounded-lg p-3 transition-all duration-200 hover:bg-accent hover:shadow-sm active:scale-[0.98]'
              >
                <div className='relative flex items-center space-x-3'>
                  <UserAvatar size='sm' name={user?.name} avatarUrl={user?.avatar} />
                  <div className='flex flex-1 flex-col'>
                    <span className='font-medium transition-colors group-hover:text-primary'>{user.name}</span>
                    <span className='text-sm text-muted-foreground'>{user.email}</span>
                    <UserRoleBadges userId={user?.id} isRoomOwner={currentRoom?.creatorId === user?.id} />
                  </div>
                  {currentRoom?.creatorId !== user?.id && (
                    <ModeratorAuthorizeComp>
                      <DeleteUserDialog user={user} roomId={currentRoomId} />
                    </ModeratorAuthorizeComp>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
