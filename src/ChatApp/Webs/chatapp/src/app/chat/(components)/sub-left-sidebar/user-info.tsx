import React from 'react'
import { useLoggedInUserProfile } from '@/entities/user/hooks/userLoggedInUserProfile'
import UserAvatar from './user-avatar'
import UserProfileModal from './user-profile-modal'
import UserAccountModal from './user-account-modal'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { PopoverContent } from '@radix-ui/react-popover'

function UserInfoPopoverContent({ userName }: { userName: string }) {
  const modals = [<UserProfileModal />, <UserAccountModal />]

  return (
    <div className='min-h-[100px] w-[240px] rounded-md border bg-white py-2 shadow-md'>
      <h4 className='block border-b border-gray-300 px-2 pb-2 text-xl font-semibold text-black'>{userName}</h4>
      <ul className='mt-1'>
        {modals.map((item, index) => (
          <li key={index} className='w-full rounded-sm p-2 hover:bg-gray-200'>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function UserInfo() {
  const { data } = useLoggedInUserProfile()
  const { name = '', avatar } = data || {}

  return (
    <Popover>
      <PopoverTrigger>
        <UserAvatar name={name} avatarUrl={avatar} />
      </PopoverTrigger>
      <PopoverContent side='right' className='z-[9999] translate-y-4' sideOffset={10}>
        <UserInfoPopoverContent userName={name} />
      </PopoverContent>
    </Popover>
  )
}

export default UserInfo
