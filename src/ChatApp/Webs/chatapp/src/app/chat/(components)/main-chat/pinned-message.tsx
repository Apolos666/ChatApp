import { MessageCircleMore, MoreVertical, Copy, Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PinnedMessagesDialog } from '../utils/pinned-messages-dialog'
import { useAppSelector } from '@/store/hooks'
import { usePinnedMessages } from '../../(hooks)/usePinnedMessage'
import { usePinnedMessageList } from '../../(hooks)/usePinnedMessageList'

export const PinnedMessage = () => {
  const selectedRoomId = useAppSelector((state) => state.room.selectedRoomId)
  const pinnedMessages = useAppSelector((state) =>
    selectedRoomId ? state.pinnedMessages.pinnedMessages[selectedRoomId] || [] : []
  )
  const { unpinMessage } = usePinnedMessages()

  const { isLoading } = usePinnedMessageList(selectedRoomId || 0)

  if (!selectedRoomId || pinnedMessages.length === 0 || isLoading) return null

  const latestPinnedMessage = pinnedMessages[pinnedMessages.length - 1]

  const handleUnpin = async () => {
    try {
      await unpinMessage.mutateAsync(latestPinnedMessage.id)
    } catch (error) {
      console.error('Error unpinning message:', error)
    }
  }

  return (
    <div className='flex-none border-b bg-muted/30 p-3'>
      <div className='flex items-center gap-3'>
        <MessageCircleMore className='h-7 w-7 flex-shrink-0 text-muted-foreground' />
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-muted-foreground'>Tin nhắn đã ghim</span>
            {pinnedMessages.length > 1 && (
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
                  <Button
                    variant='secondary'
                    size='sm'
                    className='h-7 px-2 text-xs font-medium transition-colors hover:bg-secondary/80'
                  >
                    Xem tất cả ({pinnedMessages.length})
                  </Button>
                }
              />
            )}
          </div>
          <p className='truncate text-sm'>
            {latestPinnedMessage.senderName}: {latestPinnedMessage.content}
          </p>
          {/* {latestPinnedMessage.files?.length > 0 && (
            <div className='mt-2 flex gap-2 overflow-x-auto'>
              {latestPinnedMessage.files.map((file) => (
                <div key={file.id} className='flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1'>
                  <span className='max-w-[100px] truncate text-xs text-muted-foreground'>{file.name}</span>
                </div>
              ))}
            </div>
          )} */}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='flex-shrink-0'>
              <MoreVertical className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>
              <Copy className='mr-2 h-4 w-4' />
              <span>Sao chép tin nhắn</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleUnpin} className='text-destructive focus:text-destructive'>
              <Pin className='mr-2 h-4 w-4' />
              <span>Bỏ ghim</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
