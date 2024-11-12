import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { User } from '@/types/user'
import { Label } from '@/components/ui/label'
import { FormEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { toast } from '@/hooks/use-toast'
import { z } from 'zod'
import { httpPostPrivate } from '@/services/user.service.api/_req'
import { Loader2, Save } from 'lucide-react'

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' })
    .or(z.string().length(0)) // Allow empty string to use default password
})

interface ResetPasswordDialogProps {
  user: User
  onClose: () => void
  open: boolean
}

const DEFAULT_NEW_PASSWORD = 'Abc123456@'

export function ResetPasswordDialog({ user, onClose, open }: ResetPasswordDialogProps) {
  const [newPassword, setNewPassword] = useState('')
  const [errors, setErrors] = useState<z.ZodError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result = passwordSchema.safeParse({ password: newPassword })
    
    if (!result.success) {
      setErrors(result.error)
      return
    }

    let passwordToUse = newPassword
    if (newPassword === '') {
      passwordToUse = DEFAULT_NEW_PASSWORD
    }

    console.log('passwordToUse', passwordToUse)

    setIsLoading(true)
    try {
      await httpPostPrivate(`/admin/user-reset-pass`, { 
        id: user.id, 
        newPassword: passwordToUse 
      })
      toast({
        title: 'Password reset',
        description: 'Password has been reset for ' + user.name
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset password',
        variant: 'destructive'
      })
      console.error('Error resetting password:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password for {user.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label>New Password</Label>
              <PasswordInput
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setErrors(null)
                }}
                placeholder='Enter new password'
              />
              {errors?.errors.map((error, index) => (
                <p key={index} className='text-sm text-red-500'>
                  {error.message}
                </p>
              ))}
              <span className='text-xs italic text-muted-foreground'>
                Leave blank to reset to default password: <b>{DEFAULT_NEW_PASSWORD}</b>
              </span>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant='outline' disabled={isLoading}>Cancel</Button>
            </DialogClose>
            <Button type='submit' disabled={isLoading} className='flex items-center gap-2'>
              {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Save className='h-4 w-4' />}
              {isLoading ? 'Saving...' : 'Reset Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
