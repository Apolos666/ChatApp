import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { ReactNode, useState, useMemo } from 'react'

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

interface AddMemberDialogProps {
  trigger: ReactNode
  onAddMember?: (userId: string) => void
}

export const AddMemberDialog = ({ trigger, onAddMember }: AddMemberDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [open, setOpen] = useState(false)

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return MOCK_USERS.filter(
      (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const handleAddMember = (userId: string) => {
    onAddMember?.(userId)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>Thêm thành viên mới</DialogTitle>
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
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className='group mb-2 cursor-pointer rounded-lg p-3 transition-all duration-200 hover:bg-accent hover:shadow-sm active:scale-[0.98]'
                onClick={() => handleAddMember(user.id)}
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
