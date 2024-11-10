import { Button } from '@/components/ui/button'

interface SubmitButtonProps {
  isSubmitting: boolean
}

export function SubmitButton({ isSubmitting }: SubmitButtonProps) {
  return (
    <Button type='submit' className='w-full' disabled={isSubmitting} size='lg'>
      {isSubmitting ? (
        <div className='flex items-center justify-center gap-2'>
          <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
          <span>Signing in...</span>
        </div>
      ) : (
        'Sign in'
      )}
    </Button>
  )
}