import React from 'react'
import UserAvatarPanel from './user-avatar-panel'
import UserInformationPanel from './user-information-panel'

function UserProfilePanel() {
  return (
    <div className='w-full'>
      <UserAvatarPanel />
      <UserInformationPanel />
    </div>
  )
}

export default UserProfilePanel
