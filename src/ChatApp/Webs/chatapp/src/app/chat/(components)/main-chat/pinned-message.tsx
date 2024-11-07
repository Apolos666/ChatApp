import { MessageCircleMore, MoreVertical, Copy, Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PinnedMessagesDialog } from '../utils/pinned-messages-dialog'

// Dữ liệu giả
const PINNED_MESSAGES = [
  {
    id: 1,
    content: 'Hello, something something something something something something',
    author: 'Jonas',
    time: '21:00'
  },
  {
    id: 2,
    content: 'Another pinned message here',
    author: 'Maria',
    time: '22:15'
  }
]

export const PinnedMessage = () => {
  return (
    <div className='flex-none border-b bg-muted/30 p-3'>
      <div className='flex items-center gap-3'>
        <MessageCircleMore className='h-7 w-7 flex-shrink-0 text-muted-foreground' />
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-muted-foreground'>Tin nhắn đã ghim</span>
            {PINNED_MESSAGES.length > 1 && (
              <PinnedMessagesDialog
                trigger={
                  <Button
                    variant='secondary'
                    size='sm'
                    className='h-7 px-2 text-xs font-medium transition-colors hover:bg-secondary/80'
                  >
                    Xem tất cả ({PINNED_MESSAGES.length})
                  </Button>
                }
              />
            )}
          </div>
          <p className='truncate text-sm'>
            {PINNED_MESSAGES[0].author}: {PINNED_MESSAGES[0].content}
          </p>
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
            <DropdownMenuItem className='text-destructive focus:text-destructive'>
              <Pin className='mr-2 h-4 w-4' />
              <span>Bỏ ghim</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
