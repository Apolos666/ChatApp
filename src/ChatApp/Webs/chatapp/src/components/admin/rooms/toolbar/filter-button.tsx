import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, Filter, RotateCcw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { DualRangeSlider } from '@/components/ui/dual-range-slider'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'

// Types and Interfaces
export interface RoomFilters {
  memberCount: {
    min: number | null
    max: number | null
  }
  dateRange: DateRange | undefined
}

interface FilterButtonProps {
  filters: RoomFilters
  setFilters: (filters: RoomFilters) => void
}

// Constants
export const DEFAULT_FILTERS: RoomFilters = {
  memberCount: {
    min: null,
    max: null
  },
  dateRange: undefined
}

const MEMBER_COUNT_CONFIG = {
  min: 0,
  max: 50,
  step: 1
}

// Component
const FilterButton = ({ filters = DEFAULT_FILTERS, setFilters }: FilterButtonProps) => {
  // State
  const [localFilters, setLocalFilters] = useState<RoomFilters>(filters)

  // Effects
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  // Helper Functions
  const hasChanges = () => {
    return JSON.stringify(localFilters) !== JSON.stringify(filters)
  }

  const getFilterCount = () => {
    let count = 0
    if (hasMemberCountFilter()) count++
    if (hasDateRangeFilter()) count++
    return count
  }

  const hasMemberCountFilter = () => {
    return (
      (localFilters.memberCount?.min !== null && localFilters.memberCount?.min !== MEMBER_COUNT_CONFIG.min) ||
      (localFilters.memberCount?.max !== null && localFilters.memberCount?.max !== MEMBER_COUNT_CONFIG.max)
    )
  }

  const hasDateRangeFilter = () => {
    return localFilters.dateRange?.from || localFilters.dateRange?.to
  }

  // Event Handlers
  const handleMemberCountChange = (value: number[]) => {
    setLocalFilters({
      ...localFilters,
      memberCount: { min: value[0], max: value[1] }
    })
  }

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    setLocalFilters({ ...localFilters, dateRange })
  }

  const resetFilters = () => {
    setLocalFilters(DEFAULT_FILTERS)
    setFilters(DEFAULT_FILTERS)
  }

  const applyFilters = () => {
    setFilters(localFilters)
  }

  // Render Helper Functions
  const renderDateRangeText = () => {
    if (!localFilters.dateRange?.from) return <span>Pick a date</span>

    return localFilters.dateRange.to ? (
      <>
        {format(localFilters.dateRange.from, 'dd/MM/yyyy')} -{' '}
        {format(localFilters.dateRange.to, 'dd/MM/yyyy')}
      </>
    ) : (
      format(localFilters.dateRange.from, 'dd/MM/yyyy')
    )
  }

  // Render
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>
          <Filter className='mr-2 h-4 w-4' />
          Filter
          {!hasChanges() && getFilterCount() > 0 && (
            <Badge variant='outline' className='ml-2 rounded-full'>
              {getFilterCount()}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[300px] px-2'>
        <div className='flex items-center justify-between'>
          <DropdownMenuLabel className='py-0'>Filters</DropdownMenuLabel>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8'
            onClick={resetFilters}
            disabled={JSON.stringify(localFilters) === JSON.stringify(DEFAULT_FILTERS)}
          >
            <RotateCcw className='h-4 w-4' />
          </Button>
        </div>
        <DropdownMenuSeparator />
        <div className='space-y-4 p-2'>
          {/* Member Count Filter */}
          <div className='space-y-2'>
            <div className='mb-8 text-sm font-light text-muted-foreground'>Member Count</div>
            <DualRangeSlider
              label={(value) => <span className='text-sm font-light'>{value}</span>}
              min={MEMBER_COUNT_CONFIG.min}
              max={MEMBER_COUNT_CONFIG.max}
              step={MEMBER_COUNT_CONFIG.step}
              value={[
                localFilters.memberCount?.min ?? MEMBER_COUNT_CONFIG.min,
                localFilters.memberCount?.max ?? MEMBER_COUNT_CONFIG.max
              ]}
              onValueChange={handleMemberCountChange}
            />
          </div>
          {/* Date Range Filter */}
          <div className='space-y-2'>
            <div className='text-sm font-light text-muted-foreground'>Date Created</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id='date'
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !localFilters.dateRange && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {renderDateRangeText()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='center'>
                <Calendar
                  initialFocus
                  mode='range'
                  defaultMonth={localFilters.dateRange?.from}
                  selected={localFilters.dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Button className='mt-4 w-full' onClick={applyFilters} disabled={!hasChanges()}>
          Apply Filters
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FilterButton
