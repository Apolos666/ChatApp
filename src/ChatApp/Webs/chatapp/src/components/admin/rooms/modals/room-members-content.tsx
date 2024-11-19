import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MultipleSelector from "@/components/ui/multiple-selector"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Room } from "@/types/room"
import { PlusCircle, Search, UserMinus } from "lucide-react"

interface RoomMembersContentProps {
  room?: Room | null
  isEditing: boolean
  mode: 'add' | 'edit' | 'view'
}

export default function RoomMembersContent({ room, isEditing, mode }: RoomMembersContentProps) {
    return (
    <div className='space-y-4 py-4'>
      {(mode === 'add' || isEditing) ? (
        <div className='flex items-center justify-between'>
          <div className='w-full flex-1 mr-2'>
            <MultipleSelector
            placeholder='Add members...'
            options={room?.members?.map((user) => ({ value: user.id, label: user.name })) || []}
            emptyIndicator={
              <p className='text-center text-gray-600 dark:text-gray-400'>No users found.</p>
            }
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
        <div className="flex items-center">
          <Input placeholder="Search members..." className="w-full" />
        </div>
      )}

      <div className='text-sm text-muted-foreground px-2'>{room?.members?.length || 0} members</div>

      <ScrollArea className='h-[300px]'>
        <div className='space-y-2'>
          {room?.members?.map((user) => (
            <div key={user.id} className='group flex items-center justify-between rounded-md p-2 hover:bg-muted'>
              <div className='flex items-center gap-3'>
                <Avatar>
                  <AvatarFallback>
                    {user.name.charAt(0)}
                  </AvatarFallback>
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
      </ScrollArea>
    </div>
  )
}