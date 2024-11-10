import { User, USER_ROLES } from '@/types/user'

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
      <div className="grid grid-cols-2 gap-4">
        {renderField('Email', user.email)}
      </div>

      <div className='grid grid-cols-2 gap-6'>
        {renderField('Role', USER_ROLES[user.role_id as keyof typeof USER_ROLES])}
        {renderField('Status', user.is_active ? 'Activated' : 'Not Activated')}
        {renderField('Date of Birth', user.dob)}
        {renderField('Phone Number', user.phone_number)}
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {renderField('Address', user.address)}
      </div>
    </>
  )
}
