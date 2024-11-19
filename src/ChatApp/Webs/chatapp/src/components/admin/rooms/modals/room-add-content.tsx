import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { httpPostPrivate } from "@/services/user.service.api/_req";
import { Room } from "@/types/room";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RoomAddContentProps {
  room?: Room | null
    onSuccess?: () => void
    onCancel?: () => void
}

export default function RoomAddContent({ room = null, onSuccess, onCancel }: RoomAddContentProps) {
  const [name, setName] = useState(room?.name || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleAddRoom = async () => {
    try {
      setIsLoading(true)
      await httpPostPrivate('/management/rooms/creation', { name })
      toast.success('Room created successfully')
      onCancel?.()
      onSuccess?.()
    } catch (error) {
      console.error("Error creating room", error)
      toast.error('Failed to create room')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='space-y-4 py-4'>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='name' className='text-sm font-medium text-muted-foreground'>Room Name</Label>
          <Input id='name' placeholder='Enter Room Name' value={name} onChange={(e) => setName(e.target.value)} />
        </div>
      </div>
      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={() => onCancel?.()} disabled={isLoading}>Cancel</Button>
        <Button disabled={isLoading} onClick={handleAddRoom}>
          {isLoading && <Loader2 className='h-4 w-4 animate-spin' />}
          {isLoading ? 'Adding...' : 'Add Room'}
        </Button>
      </div>
    </div>
  )
}

