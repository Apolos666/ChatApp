import { Button } from '@/components/ui/button'
import { Save, Loader2 } from 'lucide-react'
import { useUserForm } from '@/hooks/use-user-form'
import { User } from '@/types/user'
import { FormFields } from './form-fields'
import { z } from 'zod'
import { useState } from 'react'

const userFormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  email: z.string().trim().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
  role_id: z.union([z.string(), z.number()]).transform(val => Number(val)),
  is_active: z.boolean(),
  dob: z.string(),
  phone_number: z.string().trim().min(1, { message: 'Phone number is required' }),
  address: z.string().trim().min(1, { message: 'Address is required' })
})

interface UserEditFormProps {
  user: User
  onSave?: (user: User) => void
  onCancel: () => void
}

export function UserEditForm({ user, onSave, onCancel }: UserEditFormProps) {
  const { formData, isFormChanged, handleChange, handleSubmit } = useUserForm(user, onSave)
  const [errors, setErrors] = useState<z.ZodError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = userFormSchema.safeParse(formData)

    if (!result.success) {
      setErrors(result.error)
      return
    }

    setErrors(null)
    setIsLoading(true)
    try {
      handleSubmit(e, result.data)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <FormFields formData={formData} onChange={handleChange} errors={errors?.flatten().fieldErrors as Record<string, string[]>} />

      <div className='flex justify-between'>
        <Button type='button' variant='outline' onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type='submit' disabled={!isFormChanged || isLoading} className='flex items-center gap-2'>
          {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Save className='h-4 w-4' />}
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
