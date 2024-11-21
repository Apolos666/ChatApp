import { useLoggedInUserProfile } from '@/entities/user/hooks/userLoggedInUserProfile'
import React from 'react'

function ModeratorAuthorizeComp({ children }: { children: React.ReactNode }) {
  const { data: user } = useLoggedInUserProfile()
  const validRoles = ['ADMIN', 'MODERATOR']

  const isRoleValid = validRoles.includes(user?.role?.name || '')

  return <>{isRoleValid ? children : null}</>
}

export default ModeratorAuthorizeComp
