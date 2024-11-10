import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MailIcon } from 'lucide-react'
import { Control, Controller, FieldError } from 'react-hook-form'

interface EmailInputProps {
  control: Control<any>
  error?: FieldError
}

export function EmailInput({ control, error }: EmailInputProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor='email' className='text-sm font-medium'>
        Email
      </Label>
      <div className='relative'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <MailIcon className='h-5 w-5 text-gray-400' />
        </div>
        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id='email'
              type='email'
              autoComplete='email'
              className='pl-10'
              placeholder='admin@example.com'
              aria-invalid={!!error}
            />
          )}
        />
      </div>
      {error && <p className='mt-1 text-sm text-destructive'>{error.message}</p>}
    </div>
  )
}