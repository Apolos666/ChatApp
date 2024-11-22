import { memo, useCallback } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import { Loader2, MoreVertical, Copy, Pin, Trash } from 'lucide-react'
import type { MessageDto, MessageStatus } from '../../(types)/message'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { usePinnedMessages } from '../../(hooks)/usePinnedMessage'
import { useAppSelector } from '@/store/hooks'
import ModeratorAuthorizeComp from '../utils/moderator-authorize'
import { useDeleteMessage } from '../../(hooks)/useDeleteMessage'

interface MessageItemProps {
  message: MessageDto
  isOwnMessage: boolean
}

const getStatusIcon = (status: MessageStatus) => {
  switch (status) {
    case 'Sending':
      return <Loader2 className='h-3 w-3 animate-spin' />
    case 'Sent':
      return <span className='text-xs'>✓</span>
    case 'Delivered':
      return <span className='text-xs'>✓✓</span>
    case 'Seen':
      return <span className='text-xs text-blue-500'>✓✓</span>
    case 'Failed':
      return <span className='text-xs text-red-500'>!</span>
    default:
      return null
  }
}

export const MessageItem = memo(({ message, isOwnMessage }: MessageItemProps) => {
  const { pinMessage, unpinMessage } = usePinnedMessages()
  const { mutateAsync: deleteMessage } = useDeleteMessage()
  const pinnedMessages = useAppSelector((state) => state.pinnedMessages.pinnedMessages[message.roomId] || [])

  const isPinned = pinnedMessages.some((pm) => pm.id === message.id)

  const handleDeleteMessage = useCallback(
    async (event: React.MouseEvent) => {
      try {
        await deleteMessage(message.id)
      } catch (error) {
        console.error('Error deleting message:', error)
      }
    },
    [deleteMessage, message.id]
  )

  if (message.isDeleted) {
    return (
      <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
        <Card className='max-w-xs bg-muted/50'>
          <CardHeader className='px-3 py-1'>
            <p className='font-semibold text-muted-foreground'>{message.senderName}</p>
          </CardHeader>
          <CardContent className='px-3 py-2'>
            <p className='text-sm italic text-muted-foreground'>Tin nhắn này đã bị xóa</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handlePinMessage = async () => {
    try {
      if (isPinned) {
        await unpinMessage.mutateAsync(message.id)
      } else {
        await pinMessage.mutateAsync(message.id)
      }
    } catch (error) {
      console.error('Error toggling pin status:', error)
    }
  }

  return (
    <div className={`group relative flex ${isOwnMessage ? 'justify-end' : 'justify-start'} items-center gap-2`}>
      {isOwnMessage && (
        <div className='opacity-0 transition-opacity group-hover:opacity-100'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              <DropdownMenuItem>
                <Copy className='mr-2 h-4 w-4' />
                <span>Sao chép tin nhắn</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePinMessage}>
                <Pin className='mr-2 h-4 w-4' />
                <span>{isPinned ? 'Bỏ ghim tin nhắn' : 'Ghim tin nhắn'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='text-destructive focus:text-destructive'>
                <ModeratorAuthorizeComp>
                  <div onClick={handleDeleteMessage} className='flex cursor-pointer flex-row gap-4'>
                    <Trash className='h-4 w-4' />
                    <span>Xóa tin nhắn</span>
                  </div>
                </ModeratorAuthorizeComp>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <Card className={`max-w-xs ${isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        <CardHeader className='px-3 py-1'>
          <p className='font-semibold'>{message.senderName}</p>
        </CardHeader>
        <CardContent className='px-3 py-1'>
          <p>{message.content}</p>
          {message.files && message.files.length > 0 && (
            <div className='mt-2 grid grid-cols-2 gap-2'>
              {message.files.map((file) => (
                <div key={file.id} className='relative'>
                  {file.type?.startsWith('image/') ? (
                    <Image
                      src={file.url}
                      alt={file.name}
                      width={300}
                      height={200}
                      quality={100}
                      className='h-auto w-full rounded object-cover'
                      loading='lazy'
                    />
                  ) : file.type?.startsWith('video/') ? (
                    <video
                      src={file.url}
                      controls
                      width={300}
                      height={200}
                      className='h-auto w-full rounded'
                      preload='metadata'
                    />
                  ) : (
                    <div className='rounded bg-muted p-4'>
                      <p className='truncate text-sm'>{file.name}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className='flex items-center justify-between px-3 py-1'>
          <span className='text-xs text-muted-foreground'>
            {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          {isOwnMessage && getStatusIcon(message.status)}
        </CardFooter>
      </Card>

      {!isOwnMessage && (
        <div className='opacity-0 transition-opacity group-hover:opacity-100'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='h-8 w-8'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem>
                <Copy className='mr-2 h-4 w-4' />
                <span>Sao chép tin nhắn</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePinMessage}>
                <Pin className='mr-2 h-4 w-4' />
                <span>{isPinned ? 'Bỏ ghim tin nhắn' : 'Ghim tin nhắn'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='text-destructive focus:text-destructive'>
                <ModeratorAuthorizeComp>
                  <div onClick={handleDeleteMessage} className='flex cursor-pointer flex-row gap-4'>
                    <Trash className='h-4 w-4' />
                    <span>Xóa tin nhắn</span>
                  </div>
                </ModeratorAuthorizeComp>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
})

MessageItem.displayName = 'MessageItem'
