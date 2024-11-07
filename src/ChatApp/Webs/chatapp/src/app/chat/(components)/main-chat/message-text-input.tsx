import { memo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'

interface MessageTextInputProps {
  message: string
  isSending: boolean
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend: () => void
  onKeyPress: (e: React.KeyboardEvent) => void
  onFocus: () => void
  onBlur: () => void
}

export const MessageTextInput = memo(
  ({ message, isSending, onMessageChange, onSend, onKeyPress, onFocus, onBlur }: MessageTextInputProps) => {
    const selectedRoomId = useAppSelector((state) => state.room.selectedRoomId)
    const rooms = useAppSelector((state) => state.room.rooms)
    const selectedRoom = rooms.find((room) => room.id === selectedRoomId)

    if (!selectedRoom) return null

    return (
      <div className='flex items-center space-x-2 p-2'>
        <Input
          value={message}
          onChange={onMessageChange}
          onKeyPress={onKeyPress}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={`Nhập tin nhắn tới nhóm ${selectedRoom.name}`}
          className='h-12 flex-1 text-base'
          disabled={isSending}
        />
        <Button size='icon' className='h-12 w-12' onClick={onSend} disabled={isSending}>
          <Send size={28} />
        </Button>
      </div>
    )
  }
)

MessageTextInput.displayName = 'MessageTextInput'
