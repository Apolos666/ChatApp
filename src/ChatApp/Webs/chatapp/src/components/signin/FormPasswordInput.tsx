'use client'

import React, { ReactNode, ChangeEvent, useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Eye, EyeOff } from 'lucide-react'

interface IProps {
  title: string
  placeholder: string
  type?: string
  error?: string
  icon?: ReactNode
  value?: string
  onChange?: (ev: ChangeEvent<HTMLInputElement>) => void
}

function FormPasswordInput({ title, placeholder, type = 'text', value, error, icon, onChange }: IProps) {
  const [showPassword, setShowPassword] = useState(false)

  const onInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(ev)
  }

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword)
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
          type={showPassword ? 'text' : 'password'}
          onChange={onInputChange}
          placeholder={placeholder}
          className={cn('border-none text-sm focus:ring-0 focus-visible:ring-0', icon && 'pl-12')}
        />
        <div
          onClick={handleToggleShowPassword}
          className='absolute inset-y-1 right-2 flex w-8 cursor-pointer items-center justify-center rounded-md hover:bg-gray-200'
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </div>
      </div>
      {error && <span className='mt-1 text-sm text-red-500'>{error}</span>}
    </div>
  )
}

export default FormPasswordInput
