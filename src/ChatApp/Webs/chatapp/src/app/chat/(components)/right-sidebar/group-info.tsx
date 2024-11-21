import { Users, Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from '@/components/ui/sidebar'
import { AddMemberDialog } from '../utils/add-member-dialog'
import { PinnedMessagesDialog } from '../utils/pinned-messages-dialog'
import { useAppSelector } from '@/store/hooks'
import { MemberRoomDialog } from '../utils/members-room-dialog'
import ModeratorAuthorizeComp from '../utils/moderator-authorize'

export const GroupInfo = () => {
  const selectedRoomId = useAppSelector((state) => state.room.selectedRoomId)
  const rooms = useAppSelector((state) => state.room.rooms)
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId)
  const pinnedMessages = useAppSelector((state) =>
    selectedRoomId ? state.pinnedMessages.pinnedMessages[selectedRoomId] || [] : []
  )

  if (!selectedRoom) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel className='mb-2 text-base font-semibold text-typography-heading'>
        {selectedRoom.name}
      </SidebarGroupLabel>
      <div className='space-y-4'>
        <SidebarGroupContent className='space-y-2'>
          <ModeratorAuthorizeComp>
            <AddMemberDialog
              trigger={
                <Button variant='outline' className='h-12 w-full justify-start'>
                  <Users size={24} className='mr-2' />
                  <span>Thêm thành viên</span>
                </Button>
              }
            />
          </ModeratorAuthorizeComp>
          <MemberRoomDialog
            trigger={
              <Button variant='outline' className='h-12 w-full justify-start'>
                <Users size={24} className='mr-2' />
                <span>Thành viên nhóm</span>
              </Button>
            }
          />
          <PinnedMessagesDialog
            messages={pinnedMessages.map((pm) => ({
              id: pm.id,
              content: pm.content,
              author: pm.senderName,
              time: new Date(pm.pinnedAt).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              files: pm.files
            }))}
            trigger={
              <Button variant='outline' className='h-12 w-full justify-start'>
                <Pin size={24} className='mr-2' />
                <span>Tin nhắn đã ghim {pinnedMessages.length > 0 && `(${pinnedMessages.length})`}</span>
              </Button>
            }
          />
        </SidebarGroupContent>
      </div>
    </SidebarGroup>
  )
}
