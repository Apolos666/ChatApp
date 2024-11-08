import { MoreVertical, Copy, Pin, FileIcon, VideoIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { usePinnedMessages } from '../../(hooks)/usePinnedMessage'
import { FileDto } from '../../(types)/message'
import Image from 'next/image'

interface PinnedMessage {
  id: number
  content: string
  author: string
  time: string
  files: FileDto[]
}

interface PinnedMessagesDialogProps {
  messages: PinnedMessage[]
  trigger: React.ReactNode
}

export const PinnedMessagesDialog = ({ messages, trigger }: PinnedMessagesDialogProps) => {
  const { unpinMessage } = usePinnedMessages()

  const getFilePreview = (file: FileDto) => {
    if (file.type.startsWith('image/')) {
      return <Image src={file.url} alt={file.name} width={40} height={40} className='rounded object-cover' />
    }

    if (file.type.startsWith('video/')) {
      return <VideoIcon className='h-4 w-4 text-muted-foreground' />
    }

    return <FileIcon className='h-4 w-4 text-muted-foreground' />
  }

  const handleUnpin = async (messageId: number) => {
    try {
      await unpinMessage.mutateAsync(messageId)
    } catch (error) {
      console.error('Error unpinning message:', error)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className='text-lg font-semibold'>Tin nhắn đã ghim</SheetTitle>
        </SheetHeader>
        <div className='mt-6 space-y-4'>
          {messages.map((msg) => (
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
                    <DropdownMenuItem
                      onClick={() => handleUnpin(msg.id)}
                      className='text-destructive focus:text-destructive'
                    >
                      <Pin className='mr-2 h-4 w-4' />
                      <span>Bỏ ghim</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className='mt-2 text-sm'>{msg.content}</p>
              {msg.files && msg.files.length > 0 && (
                <div className='mt-2 flex flex-wrap gap-2'>
                  {msg.files.map((file) => (
                    <div key={file.id} className='flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2'>
                      {getFilePreview(file)}
                      <span className='max-w-[150px] truncate text-sm'>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
