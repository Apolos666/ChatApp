import React, { ChangeEvent, ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { Label } from '@radix-ui/react-label'
import { format, parse, isValid } from 'date-fns'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import type { DayPickerProps } from 'react-day-picker'
import { CalendarIcon } from 'lucide-react'

interface IProps {
  title: string
  placeholder: string
  error?: string
  icon?: ReactNode
  onChange?: (ev: ChangeEvent<HTMLInputElement>) => void
}

function CalendarButton(props: DayPickerProps) {
  return (
    <Popover>
      <PopoverTrigger className='absolute inset-y-0 right-0 rounded-md pr-1'>
        <div className='rounded-md p-1 hover:bg-slate-200'>
          <CalendarIcon className='size-5' />
        </div>
      </PopoverTrigger>
      <PopoverContent className='p-0'>
        <Calendar {...props} toMonth={new Date()} className='w-full' />
      </PopoverContent>
    </Popover>
  )
}

function FormCalendarInput({ title, placeholder, error, icon, onChange }: IProps) {
  const [inputValue, setInputValue] = useState('')
  const [month, setMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e)
    setInputValue(e.target.value)
    const parsedDate = parse(e.target.value, 'dd/MM/yyyy', new Date())

    if (isValid(parsedDate)) {
      setMonth(parsedDate)
      setSelectedDate(parsedDate)
    } else {
      setSelectedDate(undefined)
    }
  }

  const handleDayPickerSelect = (date: Date | undefined) => {
    if (!date) {
      setInputValue('')
      setSelectedDate(undefined)
    } else {
      setMonth(date)
      setSelectedDate(date)
      setInputValue(format(date, 'dd/MM/yyyy'))
    }
  }

  return (
    <div className='flex w-full flex-col'>
      <Label className='mb-1 text-sm'>{title}</Label>
      <div className={cn('relative rounded-md border border-stone-300', error && 'border-red-500')}>
        {icon && (
          <div className='pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center rounded-l-md bg-gray-100'>
            {icon}
          </div>
        )}
        <Input
          type='text'
          value={inputValue}
          onChange={onInputChange}
          placeholder={placeholder}
          className={cn('border-none text-sm focus:ring-0 focus-visible:ring-0', icon && 'pl-12')}
        />
        <CalendarButton
          mode='single'
          month={month}
          onMonthChange={setMonth}
          selected={selectedDate}
          onSelect={handleDayPickerSelect}
        />
      </div>
      {error && <span className='mt-1 text-sm text-red-500'>{error}</span>}
    </div>
  )
}

export default FormCalendarInput