import { Button } from '@/components/ui/button'
import { Save, Loader2, Plus } from 'lucide-react'
import { useUserForm } from '@/hooks/use-user-form'
import { User } from '@/types/user'
import { FormFields } from './form-fields'
import { z } from 'zod'
import { useState } from 'react'
import { userFormSchema } from './user-edit-form'

interface UserAddFormProps {
  user: User
  onSave?: (user: User) => void
  onCancel: () => void
}

export function UserAddForm({ user, onSave, onCancel }: UserAddFormProps) {
  const { formData, handleChange, handleSubmit } = useUserForm(user, onSave)
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
        handleSubmit(e, result.data as User)
    } catch (error) {
        console.error('Error submitting form:', error)
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <FormFields formData={formData} onChange={handleChange} mode='add' errors={errors?.flatten().fieldErrors as Record<string, string[]>} />

      <div className='flex justify-between'>
        <Button type='button' variant='outline' onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type='submit' disabled={isLoading} className='flex items-center gap-2'>
          {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Plus className='h-4 w-4' />}
          {isLoading ? 'Adding...' : 'Add User'}
        </Button>
      </div>
    </form>
  )
}
