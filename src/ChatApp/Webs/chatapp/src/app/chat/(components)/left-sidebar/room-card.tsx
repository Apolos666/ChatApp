import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setSelectedRoom } from '@/store/features/roomSlice'
import { Room } from '../../(types)/room'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useEffect, useState, useRef } from 'react'
import { getLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'

interface RoomCardProps {
  room: Room
}

export const RoomCard = ({ room }: RoomCardProps) => {
  const dispatch = useAppDispatch()
  const selectedRoomId = useAppSelector((state) => state.room.selectedRoomId)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const lastMessageRef = useRef(room.lastMessage)
  const currentUserId = parseInt(getLocalStorageItem(PersistedStateKey.MeId) || '0', 10)

  useEffect(() => {
    if (
      room.lastMessage?.createdAt !== lastMessageRef.current?.createdAt &&
      selectedRoomId !== room.id &&
      room.lastMessage?.senderId !== currentUserId
    ) {
      setHasNewMessage(true)
      const timer = setTimeout(() => setHasNewMessage(false), 2000)
      lastMessageRef.current = room.lastMessage
      return () => clearTimeout(timer)
    }
  }, [room.lastMessage, room.id, selectedRoomId, currentUserId])

  const handleSelectRoom = () => {
    dispatch(setSelectedRoom(room.id))
    setHasNewMessage(false)
  }

  return (
    <div
      className={cn(
        'cursor-pointer rounded-lg p-4 transition-all duration-200',
        'relative border-2',
        'hover:bg-gray-100/80',
        {
          'border-blue-400 bg-blue-50': room.unreadCount > 0,
          'border-primary bg-gray-100': selectedRoomId === room.id,
          'border-transparent hover:border-gray-200':
            selectedRoomId !== room.id && !hasNewMessage && room.unreadCount === 0,
          'animate-pulse border-yellow-400 bg-yellow-50': hasNewMessage
        }
      )}
      onClick={handleSelectRoom}
    >
      <div className='flex items-start justify-between'>
        <h3 className={cn('text-lg font-semibold', room.unreadCount > 0 && 'text-blue-700')}>{room.name}</h3>
        {room.lastMessage && (
          <span className='text-xs text-gray-500'>
            {formatDistanceToNow(new Date(room.lastMessage.createdAt), {
              addSuffix: true,
              locale: vi
            })}
          </span>
        )}
      </div>
      {room.lastMessage && (
        <p className={cn('mt-1 line-clamp-1 text-sm', room.unreadCount > 0 ? 'text-blue-600' : 'text-gray-600')}>
          <span className='font-medium'>{room.lastMessage.senderName}:</span> {room.lastMessage.content}
        </p>
      )}
      {room.unreadCount > 0 && (
        <span className='absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white'>
          {room.unreadCount}
        </span>
      )}
    </div>
  )
}
