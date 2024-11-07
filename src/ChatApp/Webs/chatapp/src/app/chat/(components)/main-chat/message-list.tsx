import { Loader2, ArrowDownToDot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MessageItem } from './message-item'
import { useMessageListManager } from '../../(hooks)/useMessageListManager'

interface MessageListProps {
  roomId: number
}

export const MessageList = ({ roomId }: MessageListProps) => {
  const {
    currentUserId,
    allMessages,
    isFetchingNextPage,
    showScrollButton,
    scrollContainerRef,
    handleScroll,
    scrollToBottom
  } = useMessageListManager(roomId)

  return (
    <div
      ref={scrollContainerRef}
      className='messages-scrollbar flex-1 space-y-4 overflow-y-auto bg-slate-300 p-4'
      style={{ scrollBehavior: 'auto' }}
      onScroll={handleScroll}
    >
      {isFetchingNextPage && (
        <div className='flex justify-center'>
          <Loader2 className='h-6 w-6 animate-spin' />
        </div>
      )}

      <div className='space-y-4'>
        {allMessages.map((message) => (
          <MessageItem key={message.id} message={message} isOwnMessage={message.senderId === currentUserId} />
        ))}
      </div>

      {showScrollButton && (
        <div className='sticky bottom-4 left-0 right-0 flex justify-center'>
          <Button
            onClick={() => scrollToBottom(true)}
            size='icon'
            className='rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90'
          >
            <ArrowDownToDot className='!h-5 !w-5' />
          </Button>
        </div>
      )}
    </div>
  )
}
