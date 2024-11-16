'use client'

import React, { useState } from 'react'
import ResetPasswordEmailForm from './ResetPasswordEmailForm'
import ResetPasswordSuccessNotification from './ResetPasswordSuccessNotification'

function ResetPasswordForm() {
  const [isResetSuccessfully, setIsResetSuccessfully] = useState(false)

  const handleShowSuccessNotification = () => {
    setIsResetSuccessfully(true)
  }

  return (
    <div className='relative flex w-[400px] flex-col items-center overflow-hidden rounded-2xl border bg-white px-6 py-10 shadow-md'>
      <div className='flex items-center justify-center gap-6'>
        <h3 className='text-2xl font-semibold'>Reset</h3>
        <h3 className='relative z-[100] text-2xl font-semibold text-white after:absolute after:top-0 after:z-[-1] after:block after:h-full after:w-[120%] after:-translate-x-[10%] after:-skew-x-12 after:bg-black'>
          Password
        </h3>
      </div>
      {isResetSuccessfully ? (
        <ResetPasswordSuccessNotification />
      ) : (
        <ResetPasswordEmailForm onResetPasswordSuccessfully={handleShowSuccessNotification} />
      )}
    </div>
  )
}

export default ResetPasswordForm
