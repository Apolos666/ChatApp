import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ChevronDown, LogOut, User, MessageSquareReply, Lock } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/admin/shared/spinner'
import { UserViewMode } from '../users/modals/user-view-mode'
import { httpGet as httpGetAdmin } from '@/services/user.service.api/_adminReq'
import { useToast } from '@/hooks/use-toast'
import { httpPut as httpPutAdmin } from '@/services/user.service.api/_adminReq'
import { UserEditForm } from '../users/modals/user-edit-form'
import { User as UserType } from '@/types'
import { ChangePasswordDialog } from './change-password-dialog'

export function ProfileMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isNavigating, setIsNavigating] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [profileData, setProfileData] = useState(null)

  const handleNavigateToChat = () => {
    setIsNavigating(true)
    router.push('/chat')
  }

  const handleViewProfile = async () => {
    setIsProfileOpen(true)
    setIsLoading(true)
    try {
      const response = await httpGetAdmin(`/admin/user/${user?.id}`)
      setProfileData(response.data)
    } catch (error) {
      console.error('Error fetching profile data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProfileData = async () => {
    try {
      const response = await httpGetAdmin(`/admin/user/${user?.id}`)
      setProfileData(response.data)
    } catch (error) {
      console.error('Error refreshing profile data:', error)
      toast({
        title: 'Error',
        description: 'Failed to refresh profile data',
        variant: 'destructive'
      })
    }
  }

  const handleEditProfile = () => {
    setIsEditMode(true)
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    refreshProfileData()
  }

  const handleSaveProfile = async (updatedUser: UserType) => {
    try {
        const requestBody = {
            id: user?.id,
            email: updatedUser.email,
            name: updatedUser.name,
            role_id: Number(updatedUser.role_id),
            is_active: Boolean(updatedUser.is_active),
            dob: updatedUser.dob,
            phone_number: updatedUser.phone_number,
            address: updatedUser.address,
            ...(updatedUser.password && { password: updatedUser.password }) // Only send password if it's provided
        }

        await httpPutAdmin(`/admin/user`, requestBody)
        await refreshProfileData()
        setIsEditMode(false)
        toast({
            title: 'Success',
            description: 'Profile data saved successfully',
            variant: 'default'
        })
    } catch (error) {
        console.error('Error saving profile data:', error)
        toast({
            title: 'Error',
            description: 'Failed to save profile data',
            variant: 'destructive'
        })
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='relative flex h-8 cursor-pointer items-center gap-2 px-2'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className='text-sm font-medium'>{user?.name}</span>
            <ChevronDown className='h-4 w-4 text-muted-foreground' />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end'>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleViewProfile}>
              <User className='mr-2 h-4 w-4' />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsChangePasswordOpen(true)}>
              <Lock className='mr-2 h-4 w-4' />
              <span>Change Password</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleNavigateToChat} disabled={isNavigating}>
              {isNavigating ? (
                <Spinner size='sm' text='Navigating...' className='text-muted-foreground' />
              ) : (
                <>
                  <MessageSquareReply className='mr-2 h-4 w-4' />
                  <span>Back to Chat</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='text-red-600' onClick={logout}>
            <LogOut className='mr-2 h-4 w-4' />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Profile' : 'Profile'}</DialogTitle>
          </DialogHeader>
          {isLoading ? (
            <div className='flex h-40 items-center justify-center'>
              <Spinner text='Loading profile...' />
            </div>
          ) : (
            profileData && (
                isEditMode ? (
                    <UserEditForm 
                        user={profileData} 
                        onCancel={handleCancelEdit} 
                        onSave={handleSaveProfile} 
                        mode='edit-profile'
                    />
                ) : (
                    <UserViewMode 
                        user={profileData} 
                        onEdit={handleEditProfile} 
                        onSave={refreshProfileData} 
                    />
                )
            )
          )}
        </DialogContent>
      </Dialog>

      <ChangePasswordDialog open={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
    </>
  )
}
