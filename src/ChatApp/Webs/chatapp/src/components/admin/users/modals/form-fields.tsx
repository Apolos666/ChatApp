import { Input } from '@/components/ui/input'

import { SelectContent, Select, SelectTrigger, SelectValue } from '@/components/ui/select'

import { SelectItem } from '@/components/ui/select'

import { Label } from '@/components/ui/label'
import { User, USER_ROLES } from '@/types/user'

interface FormFieldsProps {
  formData: Partial<User>
  onChange: (field: keyof User, value: string) => void
}

export function FormFields({ formData, onChange }: FormFieldsProps) {
  return (
    <>
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
            value={String(formData.is_active)}
            onValueChange={(value) => onChange('is_active', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='true'>Activated</SelectItem>
              <SelectItem value='false'>Not Activated</SelectItem>
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
