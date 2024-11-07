import { CircleUserRound, UserRoundPlus, Search, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAppSelector } from '@/store/hooks'
import { AddMemberDialog } from '../utils/add-member-dialog'

export const ChatHeader = () => {
  const selectedRoomId = useAppSelector((state) => state.room.selectedRoomId)
  const rooms = useAppSelector((state) => state.room.rooms)
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId)

  if (!selectedRoom) return null

  return (
    <div className='flex flex-none items-center justify-between border-b-3 bg-background p-4'>
      <div className='space-y-1'>
        <h2 className='text-xl font-semibold'>{selectedRoom.name}</h2>
        <span className='flex items-center gap-2'>
          <CircleUserRound size={20} />
          <p className='text-muted-foreground'>{selectedRoom.memberCount} thành viên</p>
        </span>
      </div>
      <div className='flex items-center space-x-5'>
        <AddMemberDialog
          trigger={
            <Button variant='ghost'>
              <UserRoundPlus className='!h-7 !w-7' size={28} />
            </Button>
          }
          onAddMember={(userId) => {
            // Xử lý logic thêm thành viên vào phòng chat
            console.log('Thêm user:', userId)
          }}
        />
        <Button variant='ghost'>
          <Search className='!h-7 !w-7' size={28} />
        </Button>
        <Button variant='ghost'>
          <Video className='!h-7 !w-7' size={28} />
        </Button>
        <SidebarTrigger className='rotate-180' />
      </div>
    </div>
  )
}
