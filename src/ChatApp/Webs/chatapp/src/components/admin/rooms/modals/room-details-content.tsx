import { Label } from "@/components/ui/label";
import { Room } from "@/types/room";
import { formatDate } from "@/lib/utils";

interface RoomDetailsContentProps {
  room?: Room | null
}

export default function RoomDetailsContent({ room }: RoomDetailsContentProps) {
  return (
    <div className='space-y-4 py-4'>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='name' className='text-sm font-medium text-muted-foreground'>Room Name</Label>
          <div className='p-2 rounded-md'>{room?.name || 'N/A'}</div>
        </div>
        <div className='space-y-2'>
          <div className='space-y-2'>
            <Label htmlFor='createdAt' className='text-sm font-medium text-muted-foreground'>Created At</Label>
            <div className='p-2 rounded-md'>
              {formatDate(room?.createdAt as string || '') || 'Not created yet'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}