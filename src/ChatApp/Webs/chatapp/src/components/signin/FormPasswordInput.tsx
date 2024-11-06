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
  onChange?: (ev: ChangeEvent<HTMLInputElement>) => void
}

function FormPasswordInput({ title, placeholder, type = 'text', error, icon, onChange }: IProps) {
  const [showPassword, setShowPassword] = useState(false)

  const onInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(ev)
  }

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword)
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
          type={showPassword ? 'text' : 'password'}
          onChange={onInputChange}
          placeholder={placeholder}
          className={cn('text-sm border-none focus:ring-0 focus-visible:ring-0', icon && 'pl-12')}
        />
        <div
          onClick={handleToggleShowPassword}
          className='absolute hover:bg-gray-200 inset-y-1 right-2 flex items-center justify-center w-8 cursor-pointer rounded-md'
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </div>
      </div>
      {error && <span className='text-red-500 mt-1 text-sm'>{error}</span>}
    </div>
  )
}

export default FormPasswordInput
