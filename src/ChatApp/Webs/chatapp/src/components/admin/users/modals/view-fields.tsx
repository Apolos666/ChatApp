import { User, USER_ROLES } from '@/types/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'
import { Camera } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { getLocalStorageItem } from '@/utils/local-storage'
import { useUserForm } from '@/hooks/use-user-form'
import { useRef, ChangeEvent } from 'react'

interface ViewFieldsProps {
  user: User
}

export function ViewFields({ user, onSave }: ViewFieldsProps & { onSave?: (user: User) => void }) {
  const { handleAvatarRemove, handleAvatarUpload } = useUserForm(user, onSave)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleAvatarUpload(file)
    }
    // Reset input so the same file can be selected again
    event.target.value = ''
  }

  const renderField = (label: string, value: string) => (
    <div className='space-y-2'>
      <label className='text-sm text-gray-500'>{label}</label>
      <div>{value}</div>
    </div>
  )

  return (
    <>
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className='flex flex-col items-center gap-4'>
        <div className='relative'>
          <Avatar className='h-32 w-32 border border-gray-400'>
            <AvatarImage src={user.avatar || ''} alt={user.name} className='object-cover' />
            <AvatarFallback>
              {user.name
                .split(' ')[0][0]
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {user.id === getLocalStorageItem('meId') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='absolute bottom-0 right-0 rounded-full bg-white p-2 shadow-md hover:bg-gray-100'>
                  <Camera className='h-4 w-4' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleFileSelect}>
                  {user.avatar ? 'Change Avatar' : 'Upload Avatar'}
                </DropdownMenuItem>
                {user.avatar && (
                  <DropdownMenuItem className='text-red-600' onClick={handleAvatarRemove}>
                    Remove Avatar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className='text-xl font-semibold'>{user.name}</div>
      </div>
      <div className='grid gap-4'>{renderField('Email', user.email)}</div>

      <div className='grid grid-cols-2 gap-6'>
        {renderField('Role', USER_ROLES[user.role_id as keyof typeof USER_ROLES])}
        {renderField('Status', user.is_active ? 'Activated' : 'Not Activated')}
        {renderField('Date of Birth', formatDate(user.dob))}
        {renderField('Phone Number', user.phone_number)}
      </div>

      <div className='grid gap-4'>{renderField('Address', user.address)}</div>
    </>
  )
}
