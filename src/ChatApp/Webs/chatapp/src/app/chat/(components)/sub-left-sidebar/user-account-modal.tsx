import React from 'react'
import Image from 'next/image'
import UserAccountPanel from './user-account-panel'
import ResetPasswordImage from 'public/reset-password.jpg'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

function UserAccountModal() {
  return (
    <Dialog>
      <DialogTrigger className='w-full'>
        <div className='text-left text-lg'>Change password</div>
      </DialogTrigger>
      <DialogContent
        style={{
          borderRadius: '24px'
        }}
      >
        <DialogHeader className='flex flex-col items-center'>
          <DialogTitle className='mb-2 text-center'>Change your password</DialogTitle>
          <Image src={ResetPasswordImage} className='w-48' alt='reset password image' />
        </DialogHeader>
        <UserAccountPanel />
      </DialogContent>
    </Dialog>
  )
}

export default UserAccountModal
