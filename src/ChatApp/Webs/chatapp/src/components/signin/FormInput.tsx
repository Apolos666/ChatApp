'use client'

import React, { ReactNode, ChangeEvent } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface IProps {
  title: string
  placeholder: string
  type?: string
  error?: string
  icon?: ReactNode
  value?: string
  disabled?: boolean
  onChange?: (ev: ChangeEvent<HTMLInputElement>) => void
}

function FormInput({ title, placeholder, type = 'text', error, icon, onChange, value, disabled }: IProps) {
  const onInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(ev)
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
          value={value}
          type={type}
          onChange={onInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn('border-none text-sm focus:ring-0 focus-visible:ring-0 disabled:opacity-80', icon && 'pl-12')}
        />
      </div>
      {error && <span className='mt-1 text-sm text-red-500'>{error}</span>}
    </div>
  )
}

export default FormInput
