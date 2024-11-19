import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MultipleSelector, { useDebounce } from '@/components/ui/multiple-selector'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Room } from '@/types/room'
import { PlusCircle, UserMinus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Spinner } from "@/components/admin/shared/spinner";
interface RoomMembersContentProps {
  room?: Room | null
  isEditing: boolean
  mode: 'add' | 'edit' | 'view'
}

export default function RoomMembersContent({ room, isEditing, mode }: RoomMembersContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const isSearching = debouncedSearchQuery !== searchQuery

  // Filtered members
  const filteredMembers = useMemo(() => {
    const members = room?.members || []
    const query = debouncedSearchQuery.toLowerCase()
    return members.filter((user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query))
  }, [room?.members, debouncedSearchQuery])

  const renderContent = () => {
    if (isSearching) {
      return (
        <Spinner className="justify-center mt-2"/>
      )
    }

    if (filteredMembers.length === 0) {
      return <div className='text-center text-muted-foreground'>No members found.</div>
    }

    return (
      <div className='space-y-2'>
            {filteredMembers.map((user) => (
              <div key={user.id} className='group flex items-center justify-between rounded-md p-2 hover:bg-muted'>
                <div className='flex items-center gap-3'>
                <Avatar>
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
      {mode === 'add' || isEditing ? (
        <div className='flex items-center justify-between'>
          <div className='mr-2 w-full flex-1'>
            <MultipleSelector
              placeholder='Add members...'
              options={room?.members?.map((user) => ({ value: user.id, label: user.name })) || []}
              emptyIndicator={<p className='text-center text-gray-600 dark:text-gray-400'>No users found.</p>}
            />
          </div>
          <div className='flex items-center gap-2'>
            <Button>
              <PlusCircle className='mr-2 h-4 w-4' />
              Add
            </Button>
          </div>
        </div>
      ) : (
        <div className='flex items-center'>
          <Input
            placeholder='Search members...'
            className='w-full'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <div className='px-2 text-sm text-muted-foreground'>{room?.members?.length || 0} members</div>

      <ScrollArea className='h-[300px]'>{renderContent()}</ScrollArea>
    </div>
  )
}
