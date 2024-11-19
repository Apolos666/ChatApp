import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import UserProfilePanel from './user-profile-panel'

function UserProfileModal() {
  return (
    <Dialog>
      <DialogTrigger className='w-full'>
        <div className='text-left text-lg'>Your profile</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-2 text-center'>Thông tin tài khoản</DialogTitle>
          <UserProfilePanel />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default UserProfileModal
