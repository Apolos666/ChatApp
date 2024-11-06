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
  onChange?: (ev: ChangeEvent<HTMLInputElement>) => void
}

function FormInput({ title, placeholder, type = 'text', error, icon, onChange }: IProps) {
  const onInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(ev)
  }

  return (
    <div className='w-full flex flex-col'>
      <Label className='mb-1 text-sm'>{title}</Label>
      <div className={cn('relative rounded-md border border-stone-300', error && 'border-red-500')}>
        {icon && (
          <div className='pointer-events-none absolute rounded-l-md inset-y-0 left-0 w-10 flex items-center justify-center bg-gray-100'>
            {icon}
          </div>
        )}
        <Input
          type={type}
          onChange={onInputChange}
          placeholder={placeholder}
          className={cn('text-sm border-none focus:ring-0 focus-visible:ring-0', icon && 'pl-12')}
        />
      </div>
      {error && <span className='text-red-500 mt-1 text-sm'>{error}</span>}
    </div>
  )
}

export default FormInput
