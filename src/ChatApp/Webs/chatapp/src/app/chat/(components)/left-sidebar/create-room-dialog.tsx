import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { ReactNode, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  name: string
  email: string
}

const MOCK_USERS: User[] = [
  { id: '1', name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com' },
  { id: '2', name: 'Trần Thị B', email: 'tranthib@gmail.com' },
  { id: '3', name: 'Lê Văn C', email: 'levanc@gmail.com' },
  { id: '4', name: 'Phạm Thị D', email: 'phamthid@gmail.com' },
  { id: '5', name: 'Hoàng Văn E', email: 'hoangvane@gmail.com' }
]

interface CreateRoomDialogProps {
  trigger: ReactNode
  onCreateRoom?: (roomName: string, memberIds: string[]) => void
}

export const CreateRoomDialog = ({ trigger, onCreateRoom }: CreateRoomDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [roomName, setRoomName] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [open, setOpen] = useState(false)

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return MOCK_USERS.filter(
      (user) =>
        !selectedUsers.find((selected) => selected.id === user.id) &&
        (user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query))
    )
  }, [searchQuery, selectedUsers])

  const handleSelectUser = (user: User) => {
    setSelectedUsers([...selectedUsers, user])
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId))
  }

  const handleCreateRoom = () => {
    if (roomName.trim() && selectedUsers.length > 0) {
      onCreateRoom?.(
        roomName,
        selectedUsers.map((user) => user.id)
      )
      setOpen(false)
      // Reset form
      setRoomName('')
      setSelectedUsers([])
      setSearchQuery('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>Tạo nhóm chat mới</DialogTitle>
        </DialogHeader>
        <div className='mt-4 space-y-4'>
          <div>
            <Input
              placeholder='Tên nhóm chat...'
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className='w-full focus-visible:ring-2'
            />
          </div>

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

          <div className='custom-scrollbar mt-2 max-h-[200px] overflow-y-auto pr-2'>
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className='group mb-2 cursor-pointer rounded-lg p-3 transition-all duration-200 hover:bg-accent hover:shadow-sm active:scale-[0.98]'
                onClick={() => handleSelectUser(user)}
              >
                <div className='flex items-center space-x-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                    <span className='text-sm font-medium'>
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </span>
                  </div>
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

          <Button
            className='w-full'
            disabled={!roomName.trim() || selectedUsers.length === 0}
            onClick={handleCreateRoom}
          >
            Tạo nhóm chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
