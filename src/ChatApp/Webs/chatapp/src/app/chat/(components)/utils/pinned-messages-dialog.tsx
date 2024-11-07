import { MoreVertical, Copy, Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

// Tạm thời giữ data ở đây, sau này có thể chuyển vào props
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

interface PinnedMessagesDialogProps {
  trigger: React.ReactNode
}

export const PinnedMessagesDialog = ({ trigger }: PinnedMessagesDialogProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className='text-lg font-semibold'>Tin nhắn đã ghim</SheetTitle>
        </SheetHeader>
        <div className='mt-6 space-y-4'>
          {PINNED_MESSAGES.map((msg) => (
            <div key={msg.id} className='group relative rounded-lg border p-4 hover:bg-muted/50'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium'>{msg.author}</span>
                  <span className='text-sm text-muted-foreground'>{msg.time}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='h-8 w-8 opacity-0 group-hover:opacity-100'>
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
              <p className='mt-2 text-sm'>{msg.content}</p>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
