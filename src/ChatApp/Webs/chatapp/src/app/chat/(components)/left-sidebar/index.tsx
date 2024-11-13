import { SearchBar } from './search-bar'
import { RoomCard } from './room-card'
import { useRooms } from '../../(hooks)/useRooms'
import { RoomCardSkeleton } from './room-card.skeleton'
import { useState, useMemo } from 'react'
import { useAppSelector } from '@/store/hooks'
import SubLeftSidebar from '../sub-left-sidebar'

export const LeftSidebar = () => {
  const { isLoading, error } = useRooms()
  const [searchTerm, setSearchTerm] = useState('')

  const rooms = useAppSelector((state) => state.room.rooms)

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => room.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [rooms, searchTerm])

  return (
    <div className='sticky top-0 flex h-svh border-r-3'>
      <SubLeftSidebar />
      <div>
        <SearchBar onSearch={setSearchTerm} />
        <div className='custom-scrollbar h-[calc(100vh-80px)] space-y-2 overflow-y-auto p-3'>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => <RoomCardSkeleton key={index} />)
          ) : error ? (
            <div className='py-4 text-center text-red-500'>Không thể tải danh sách phòng chat</div>
          ) : (
            filteredRooms.map((room) => <RoomCard key={room.id} room={room} />)
          )}
        </div>
      </div>
    </div>
  )
}
