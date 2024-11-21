import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { ReactNode, useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useCreateRoomMutation } from '../left-sidebar/_mutations/createRoom.mutation'
import ButtonLoading from '@/components/signin/ButtonLoading'
import { useInfiniteQuery } from '@tanstack/react-query'
import { UserQueries } from '@/entities/user'
import { useDebounce } from '@/hooks/use-debounce'
import UserAvatar from '../sub-left-sidebar/user-avatar'
import { useAddUserToRoom } from '../left-sidebar/_mutations/addUserToRoom.mutation'
import { cn } from '@/lib/utils'
import { useLoggedInUserProfile } from '@/entities/user/hooks/userLoggedInUserProfile'
import { useAppSelector } from '@/store/hooks'
import { toastError, toastSuccess } from '@/components/shared/Toast'
import { queryClient } from '@/providers/query-provider'

interface User {
  id: number
  name: string
  email: string
  avatar?: string | null
}

interface CreateRoomDialogProps {
  trigger: ReactNode
  onCreateRoom?: (roomName: string, memberIds: string[]) => void
}

export const AddMemberDialog = ({ trigger, onCreateRoom }: CreateRoomDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const searchName = useDebounce(searchQuery, 800)

  const roomId = useAppSelector((state) => state.room.selectedRoomId)

  const { data: currentUser } = useLoggedInUserProfile()

  const [roomName, setRoomName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [open, setOpen] = useState(false)

  const { fetchNextPage, data } = useInfiniteQuery(
    UserQueries.usersByNameInfiniteQuery({
      name: searchName,
      pageSize: 10,
      pageNumber: 1,
      sortBy: 'id',
      sortDir: 'ASC'
    })
  )

  const filteredUsers = useMemo(() => {
    console.log(data)
    return data?.pages.flatMap((page) => page.content).filter((user) => currentUser && user.id !== currentUser.id)
  }, [data, currentUser])

  const { mutateAsync: addUserToRoomAsync, isPending } = useAddUserToRoom({
    onSuccess: async () => {
      toastSuccess('Thêm thành viên thành công')
      queryClient.invalidateQueries({
        queryKey: ['rooms']
      })
    },
    onError: (error) => {
      toastError('Thêm thành viên thất bại')
      console.log(error)
    },
    onSettled: () => {
      setOpen(false)
    }
  })

  const handleSelectUser = (user: User) => {
    const isExist = selectedUsers.find((selectedUser) => user.id === selectedUser.id)
    if (!isExist) {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId))
  }

  const handleAddMember = async () => {
    if (roomId && selectedUsers.length > 0) {
      await addUserToRoomAsync({
        roomId,
        userIdList: selectedUsers.map((user) => user.id)
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[460px]'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>Thêm thành viên mới</DialogTitle>
        </DialogHeader>
        <div className='mt-4 space-y-4'>
          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {selectedUsers.map((user) => (
                <div key={user.id} className='flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm'>
                  <span>{user.name}</span>
                  <button onClick={() => handleRemoveUser(user.id)} className='ml-1 rounded-full hover:bg-primary/20'>
                    <X className='h-4 w-4' />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className='relative'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Tìm kiếm thành viên...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 focus-visible:ring-2'
            />
          </div>

          {filteredUsers && (
            <div className='custom-scrollbar mt-2 max-h-[280px] overflow-y-auto pr-2'>
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={cn(
                    'group mb-2 cursor-pointer rounded-lg p-3 transition-all duration-200 hover:bg-accent hover:shadow-sm active:scale-[0.98]',
                    selectedUsers.find((selectedUser) => selectedUser.id === user.id) && 'bg-blue-200 hover:bg-blue-300'
                  )}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className='flex items-center space-x-3'>
                    <UserAvatar size='sm' name={user?.name} avatarUrl={user?.avatar} />
                    <div className='flex flex-1 flex-col'>
                      <span className='font-medium transition-colors group-hover:text-primary'>{user.name}</span>
                      <span className='text-sm text-muted-foreground'>{user.email}</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className='py-8 text-center text-muted-foreground'>
                  <div className='mb-2 text-3xl'>🔍</div>
                  <p>Không tìm thấy người dùng</p>
                </div>
              )}
            </div>
          )}

          <ButtonLoading
            type='button'
            loading={isPending}
            disabled={isPending}
            className='w-full'
            onClick={handleAddMember}
          >
            Thêm thành viên
          </ButtonLoading>
        </div>
      </DialogContent>
    </Dialog>
  )
}
