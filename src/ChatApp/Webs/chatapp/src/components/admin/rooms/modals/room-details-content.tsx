import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Room } from "@/types/room";
import { formatDate } from "@/lib/utils";

interface RoomDetailsContentProps {
  mode: 'add' | 'edit' | 'view'
  isEditing: boolean
  room?: Room | null
}

export default function RoomDetailsContent({ mode, isEditing, room }: RoomDetailsContentProps) {
  return (
    <div className='space-y-4 py-4'>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Room Name</Label>
          {(mode === 'view' && !isEditing) ? (
            <div className='p-2 rounded-md bg-muted'>{room?.name || 'N/A'}</div>
          ) : (
            <Input 
              id='name' 
              placeholder={mode === 'add' ? 'Enter room name' : undefined}
              defaultValue={mode === 'add' ? undefined : room?.name}
            />
          )}
        </div>
        {mode !== 'add' && (
          <div className='space-y-2'>
            <Label htmlFor='createdAt'>Created At</Label>
            <div className='p-2 rounded-md bg-muted'>
              {formatDate(room?.createdAt as string || '') || 'Not created yet'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}