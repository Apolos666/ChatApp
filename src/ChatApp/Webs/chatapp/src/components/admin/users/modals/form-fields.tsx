import { Input } from '@/components/ui/input'

import { SelectContent, Select, SelectTrigger, SelectValue } from '@/components/ui/select'

import { SelectItem } from '@/components/ui/select'

import { Label } from '@/components/ui/label'
import { User, USER_ROLES } from '@/types/user'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface FormFieldsProps {
  formData: Partial<User>
  onChange: (field: keyof User, value: string | boolean) => void
}

export function FormFields({ formData, onChange }: FormFieldsProps) {
  return (
    <>
      <div className='mb-6 flex items-center gap-4'>
        <Avatar className='h-16 w-16 border border-gray-400'>
          <AvatarImage src={formData.avatar || ''} alt={formData.name || ''} className='object-cover' />
          <AvatarFallback>{formData.name?.split(' ')[0][0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className='flex-1'>
          <Label htmlFor='name'>Name</Label>
          <Input id='name' value={formData.name || ''} onChange={(e) => onChange?.('name', e.target.value)} />
        </div>
      </div>
      <div className='grid gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='email' className='text-muted-foreground'>
            Email
          </Label>
          <Input id='email' type='email' value={formData.email} onChange={(e) => onChange('email', e.target.value)} />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='role' className='text-muted-foreground'>
            Role
          </Label>
          <Select value={formData.role_id?.toString()} onValueChange={(value) => onChange('role_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder='Select role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='1'>{USER_ROLES[1]}</SelectItem>
              <SelectItem value='2'>{USER_ROLES[2]}</SelectItem>
              <SelectItem value='3'>{USER_ROLES[3]}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='is_active' className='text-muted-foreground'>
            Account Status
          </Label>
          <Select
            value={formData.is_active ? 'active' : 'inactive'}
            onValueChange={(value) => onChange('is_active', value === 'active')}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='active'>Activated</SelectItem>
              <SelectItem value='inactive'>Not Activated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='dob' className='text-muted-foreground'>
            Date of Birth
          </Label>
          <Input id='dob' type='date' value={formData.dob} onChange={(e) => onChange('dob', e.target.value)} />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='phone_number' className='text-muted-foreground'>
            Phone Number
          </Label>
          <Input
            id='phone_number'
            value={formData.phone_number}
            onChange={(e) => onChange('phone_number', e.target.value)}
          />
        </div>
      </div>

      <div className='grid gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='address' className='text-muted-foreground'>
            Address
          </Label>
          <Input id='address' value={formData.address} onChange={(e) => onChange('address', e.target.value)} />
        </div>
      </div>
    </>
  )
}
