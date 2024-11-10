'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { httpPost } from '@/services/user.service.api/_req'
import { PasswordInput } from './password-input'
import { EmailInput } from './email-input'
import { SubmitButton } from './submit-button'
import { setLocalStorageItem } from '@/utils/local-storage'
import { PersistedStateKey } from '@/data/persisted-keys'
import { useEffect } from 'react'

// Zod schema for form validation
const AdminLoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(50, 'Password is too long')
})

type AdminLoginFormValues = z.infer<typeof AdminLoginSchema>

interface LoginFormProps {
  error: string
  setError: (error: string) => void
  onSuccess: () => void
  initialError?: string
}

export function LoginForm({ error, setError, onSuccess, initialError }: LoginFormProps) {
  useEffect(() => {
    if (initialError) {
      setError(initialError)
    }
  }, [initialError, setError])

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(AdminLoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // Handle form submission
  const onSubmit = async (data: AdminLoginFormValues) => {
    setError('')
    try {
      // Attempt to login with provided credentials
      const response = await httpPost('/auth/login', data)
      if (response.status !== 200) {
        throw new Error('Invalid credentials')
      }
      
      // Store authentication tokens and user ID in local storage
      const { accessToken, refreshToken, id } = response.data
      setLocalStorageItem(PersistedStateKey.MeId, id)
      setLocalStorageItem(PersistedStateKey.Token, accessToken) 
      setLocalStorageItem(PersistedStateKey.RefreshToken, refreshToken)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <EmailInput control={control} error={errors.email} />
      <PasswordInput control={control} error={errors.password} />

      {error && (
        <Alert variant='destructive'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  )
}