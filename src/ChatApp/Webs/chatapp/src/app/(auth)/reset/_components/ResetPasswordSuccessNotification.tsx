import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import SuccessfullyImage from 'public/submit-successfully.png'

function ResetPasswordSuccessNotification() {
  const router = useRouter()

  const handleReturnToSigninPage = () => {
    router.replace('/signin')
  }

  return (
    <div className='mt-4 flex w-full flex-col items-center gap-4'>
      <Image className='w-[60px]' src={SuccessfullyImage} alt='successfully reset password' />
      <p className='text-sm text-gray-400'>
        Your password has been successfully reset. <br /> A new password has been sent to your email.
      </p>
      <Button onClick={handleReturnToSigninPage} type='button' className='w-full'>
        Return to the sign in page
      </Button>
    </div>
  )
}

export default ResetPasswordSuccessNotification
