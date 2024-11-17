import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'
import { httpPostPrivate } from '@/services/user.service.api/_req'
import { Loader2, Save } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const passwordSchema = z.object({
  oldPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

interface ChangePasswordDialogProps {
  onClose: () => void
  open: boolean
}

interface ErrorResponse {
  time: string;
  message: string;
  details: string;
}

export function ChangePasswordDialog({ onClose, open }: ChangePasswordDialogProps) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<z.ZodError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetForm = () => {
    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setErrors(null)
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(null)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    const result = passwordSchema.safeParse(formData)
    
    if (!result.success) {
      setErrors(result.error)
      return
    }

    setIsLoading(true)
    try {
      await httpPostPrivate(`/auth/password/modification`, { 
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      })
      toast({
        title: 'Success',
        description: 'Password has been changed successfully'
      })
      resetForm()
      onClose()
    } catch (error: any) {
      const errorResponse = error.response?.data as ErrorResponse;
      setError(errorResponse?.message || 'Failed to change password. Please try again.')
      console.error('Error changing password:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldError = (field: keyof typeof formData) => {
    return errors?.errors.find(error => error.path[0] === field)?.message
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label>Current Password</Label>
              <PasswordInput
                value={formData.oldPassword}
                onChange={handleChange('oldPassword')}
                placeholder='Enter current password'
              />
              {getFieldError('oldPassword') && (
                <p className='text-sm text-red-500'>{getFieldError('oldPassword')}</p>
              )}
            </div>

            <div className='grid gap-2'>
              <Label>New Password</Label>
              <PasswordInput
                value={formData.newPassword}
                onChange={handleChange('newPassword')}
                placeholder='Enter new password'
              />
              {getFieldError('newPassword') && (
                <p className='text-sm text-red-500'>{getFieldError('newPassword')}</p>
              )}
            </div>

            <div className='grid gap-2'>
              <Label>Confirm New Password</Label>
              <PasswordInput
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder='Confirm new password'
              />
              {getFieldError('confirmPassword') && (
                <p className='text-sm text-red-500'>{getFieldError('confirmPassword')}</p>
              )}
            </div>
          </div>
          {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button 
                type="button" 
                variant='outline' 
                disabled={isLoading}
                onClick={resetForm}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' disabled={isLoading} className='flex items-center gap-2'>
              {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Save className='h-4 w-4' />}
              {isLoading ? 'Saving...' : 'Change Password'}
            </Button>
          </DialogFooter>
        </form>
        
      </DialogContent>
    </Dialog>
  )
} 