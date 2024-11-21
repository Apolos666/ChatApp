import { Search, UserRoundPlus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCallback } from 'react'
import debounce from 'lodash/debounce'
import { CreateRoomDialog } from './create-room-dialog'
import ModeratorAuthorizeComp from '../utils/moderator-authorize'

interface SearchBarProps {
  onSearch: (term: string) => void
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value)
    }, 300),
    [onSearch]
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  return (
    <div className='p-4'>
      <div className='flex items-center gap-2'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-muted-foreground' size={24} />
          <Input placeholder='Tìm kiếm' className='h-12 !bg-gray-300 pl-12 text-lg' onChange={handleSearch} />
        </div>
        <ModeratorAuthorizeComp>
          <CreateRoomDialog
            trigger={
              <Button variant='ghost' size='icon' className='h-12 w-12'>
                <UserRoundPlus className='!h-7 !w-7' />
              </Button>
            }
            onCreateRoom={(roomName, memberIds) => {
              // Xử lý logic tạo phòng chat mới
              console.log('Tạo phòng:', roomName, memberIds)
            }}
          />
        </ModeratorAuthorizeComp>
      </div>
    </div>
  )
}
