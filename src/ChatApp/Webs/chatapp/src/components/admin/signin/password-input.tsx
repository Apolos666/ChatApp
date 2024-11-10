import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react'
import { useState } from 'react'
import { Control, Controller, FieldError } from 'react-hook-form'

interface PasswordInputProps {
  control: Control<any>
  error?: FieldError
}

export function PasswordInput({ control, error }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className='space-y-2'>
      <Label htmlFor='password' className='text-sm font-medium'>
        Password
      </Label>
      <div className='relative'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <LockIcon className='h-5 w-5 text-gray-400' />
        </div>
        <Controller
          name='password'
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id='password'
              type={showPassword ? 'text' : 'password'}
              autoComplete='current-password'
              className='pl-10'
              placeholder='Enter your password'
              aria-invalid={!!error}
            />
          )}
        />
        <button
          type='button'
          className='absolute inset-y-0 right-0 flex items-center pr-3 transition-colors hover:text-gray-600'
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOffIcon className='h-5 w-5 text-gray-400' />
          ) : (
            <EyeIcon className='h-5 w-5 text-gray-400' />
          )}
        </button>
      </div>
      {error && <p className='mt-1 text-sm text-destructive'>{error.message}</p>}
    </div>
  )
}