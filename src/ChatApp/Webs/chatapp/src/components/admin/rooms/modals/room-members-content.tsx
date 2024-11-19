import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import MultipleSelector from '@/components/ui/multiple-selector'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Room, User } from '@/types'
import { Loader2, UserMinus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { httpGet } from '@/services/user.service.api/_adminReq'
import { httpPostPrivate, httpDelPrivate, httpGetPrivate } from '@/services/user.service.api/_req'

interface RoomMembersContentProps {
  room?: Room | null
  onSuccess?: (updatedRoom: Room) => void
}

interface SelectedMember {
  value: string
  label: string
}

export default function RoomMembersContent({ room, onSuccess }: RoomMembersContentProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([])
  const [isAddingMembers, setIsAddingMembers] = useState(false)

  const fetchUsers = useCallback(async () => {
    try {
      const response = await httpGet('/admin/users')
      setUsers(response.data)
    } catch (error) {
      toast.error('Failed to fetch users')
      console.error('Error fetching users:', error)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  // Options for MultipleSelector with disabled state
  const usersOptions = useMemo(() => {
    const currentMemberIds = new Set(room?.members?.map((user) => user.id) || [])
    return users.map((user) => ({
      value: user.id,
      label: user.name,
      disable: currentMemberIds.has(user.id)
    }))
  }, [room?.members, users])

  // Fetch current room
  const fetchCurrentRoom = async () => {
    try {
      const response = await httpGetPrivate('/management/rooms')
      onSuccess?.(response.data.find((r: Room) => r.id === room?.id)) // Nhật đang get room thủ công, cần backend thêm endpoint get room by id
    } catch (error) {
      console.error('Error fetching room:', error)
    }
  }

  // Add members
  const handleAddMembers = async () => {
    if (selectedMembers.length === 0) {
      toast.error('Please select members to add')
      return
    }

    setIsAddingMembers(true)

    try {
      for (const member of selectedMembers) {
        await httpPostPrivate(`/management/rooms/${room?.id}/user/${member.value}`)
      }

      toast.success('Members added successfully')
      setSelectedMembers([])

      // Refresh both users and room data
      await Promise.all([fetchUsers(), fetchCurrentRoom()])
    } catch (error) {
      toast.error('Failed to add members')
      console.error('Error adding members:', error)
    } finally {
      setIsAddingMembers(false)
    }
  }

  // Delete members
  const handleDeleteMember = async (memberId: string) => {
    // Check if the member is the creator
    const creatorId = room?.creatorId
    if (creatorId === memberId) {
      toast.error('Cannot remove creator')
      return
    }

    try {
      await httpDelPrivate(`/management/rooms/${room?.id}/user/${memberId}`)
      toast.success('Member removed successfully')

      // Refresh both users and room data
      await Promise.all([fetchUsers(), fetchCurrentRoom()])
    } catch (error) {
      toast.error('Failed to remove member')
      console.error('Error removing member:', error)
    }
  }

  // Render content
  const renderContent = () => {
    if (room?.members?.length === 0) {
      return <div className='text-center text-muted-foreground'>No members found.</div>
    }

    return (
      <div className='space-y-2'>
        {room?.members?.map((user) => (
          <div key={user.id} className='group flex items-center justify-between rounded-md p-2 hover:bg-muted'>
            <div className='flex items-center gap-3'>
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className='font-medium'>{user.name}</div>
                <div className='text-sm text-muted-foreground'>{user.email}</div>
              </div>
            </div>
            <div className='flex items-center'>
              <Button
                variant='ghost'
                size='icon'
                className='text-destructive opacity-0 transition-opacity group-hover:opacity-100'
                onClick={() => handleDeleteMember(user.id)}
              >
                <UserMinus className='h-4 w-4' />
              </Button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='space-y-4 py-4'>
      <div className='flex items-center justify-between'>
        <div className='mr-2 w-full flex-1'>
          <MultipleSelector
              placeholder='Add members...'
              options={usersOptions}
              emptyIndicator={<p className='text-center text-gray-600 dark:text-gray-400'>No members found.</p>}
              onChange={setSelectedMembers}
              value={selectedMembers}
            />
          </div>
          <div className='flex items-center gap-2'>
            <Button onClick={handleAddMembers} disabled={selectedMembers.length === 0}>
              {isAddingMembers && <Loader2 className='h-4 w-4 animate-spin' />}
              {isAddingMembers ? 'Adding... ' : 'Add '}
              {selectedMembers.length > 0 && `(${selectedMembers.length})`}
            </Button>
          </div>
        </div>
        <div className='px-2 text-sm text-muted-foreground'>{room?.members?.length || 0} members</div>
      
      <ScrollArea className='h-[300px]'>{renderContent()}</ScrollArea>
    </div>
  )
}
