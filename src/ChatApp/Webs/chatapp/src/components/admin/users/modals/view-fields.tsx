import { User, USER_ROLES } from '@/types/user'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'

interface ViewFieldsProps {
  user: User
}

export function ViewFields({ user }: ViewFieldsProps) {
  const renderField = (label: string, value: string) => (
    <div className='space-y-2'>
      <label className='text-sm text-gray-500'>{label}</label>
      <div>{value}</div>
    </div>
  )

  return (
    <>
      <div className='flex flex-col items-center gap-4'>
        <Avatar className='h-32 w-32 border border-gray-400'>
          <AvatarImage src={user.avatar || ''} alt={user.name} className='object-cover' />
          <AvatarFallback>
            {user.name
              .split(' ')[0][0]
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
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
