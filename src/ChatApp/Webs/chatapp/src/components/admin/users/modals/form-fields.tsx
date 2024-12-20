import { Input } from '@/components/ui/input'

import { SelectContent, Select, SelectTrigger, SelectValue } from '@/components/ui/select'

import { SelectItem } from '@/components/ui/select'

import { Label } from '@/components/ui/label'
import { User, USER_ROLES } from '@/types/user'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useState, useRef, ChangeEvent } from 'react'
import { Eye } from 'lucide-react'
import { EyeOff } from 'lucide-react'
import { Camera } from 'lucide-react'
import { useUserForm } from '@/hooks/use-user-form'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { getLocalStorageItem } from '@/utils/local-storage'

interface FormFieldsProps {
  formData: Partial<User>
  onChange?: (field: keyof User, value: string | boolean) => void
  errors?: Record<string, string[]>
  mode: 'add' | 'edit' | 'edit-profile'
  onSave?: (user: User) => void
}

export function FormFields({ formData, onChange, errors, mode, onSave }: FormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isEditProfile = mode === 'edit-profile'
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { handleAvatarRemove, handleAvatarUpload } = useUserForm(formData as User, onSave)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleAvatarUpload(file)
    }
    event.target.value = ''
  }

  return (
    <>
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className='mb-6 flex items-center gap-4'>
        <div className='relative'>
          <Avatar className='h-16 w-16 border border-gray-400'>
            <AvatarImage src={formData.avatar || ''} alt={formData.name || ''} className='object-cover' />
            <AvatarFallback>{formData.name ? formData.name.split(' ')[0][0].toUpperCase() : ''}</AvatarFallback>
          </Avatar>
          
          {(isEditProfile && formData.id === getLocalStorageItem('meId')) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='absolute bottom-0 right-0 rounded-full bg-white p-1.5 shadow-md hover:bg-gray-100'>
                  <Camera className='h-3 w-3' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleFileSelect}>
                  {formData.avatar ? 'Change Avatar' : 'Upload Avatar'}
                </DropdownMenuItem>
                {formData.avatar && (
                  <DropdownMenuItem className='text-red-600' onClick={handleAvatarRemove}>
                    Remove Avatar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className='flex-1'>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            placeholder='Enter name'
            value={formData.name || ''}
            onChange={(e) => onChange?.('name', e.target.value)}
            className={cn(errors?.name && 'border-red-500')}
          />
          {errors?.name && <p className='text-sm text-red-500'>{errors.name[0]}</p>}
        </div>
      </div>
      <div className='grid gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='email' className='text-muted-foreground'>
            Email
          </Label>
          <Input
            id='email'
            type='email'
            placeholder='Enter email'
            disabled={mode === 'edit' || isEditProfile}
            value={formData.email}
            onChange={(e) => onChange?.('email', e.target.value)}
            className={cn(errors?.email && 'border-red-500')}
          />
          {errors?.email && <p className='text-sm text-red-500'>{errors.email[0]}</p>}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='role' className='text-muted-foreground'>
            Role
          </Label>
          <Select
            value={formData.role_id?.toString()}
            onValueChange={(value) => onChange?.('role_id', value)}
            disabled={isEditProfile}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select role' className={cn(errors?.role_id && 'border-red-500')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='1'>{USER_ROLES[1]}</SelectItem>
              <SelectItem value='2'>{USER_ROLES[2]}</SelectItem>
              <SelectItem value='3'>{USER_ROLES[3]}</SelectItem>
            </SelectContent>
          </Select>
          {errors?.role_id && <p className='text-sm text-red-500'>{errors.role_id[0]}</p>}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='is_active' className='text-muted-foreground'>
            Account Status
          </Label>
          <Select
            value={mode === 'add' ? 'false' : String(Boolean(formData.is_active))}
            onValueChange={(value) => onChange?.('is_active', value === 'true')}
            disabled={isEditProfile}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select status' className={cn(errors?.is_active && 'border-red-500')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='true'>Activated</SelectItem>
              <SelectItem value='false'>Not Activated</SelectItem>
            </SelectContent>
          </Select>
          {errors?.is_active && <p className='text-sm text-red-500'>{errors.is_active[0]}</p>}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='dob' className='text-muted-foreground'>
            Date of Birth
          </Label>
          <Input
            id='dob'
            type='date'
            value={formData.dob}
            onChange={(e) => onChange?.('dob', e.target.value)}
            className={cn(errors?.dob && 'border-red-500')}
          />
          {errors?.dob && <p className='text-sm text-red-500'>{errors.dob[0]}</p>}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='phone_number' className='text-muted-foreground'>
            Phone Number
          </Label>
          <Input
            id='phone_number'
            placeholder='Enter phone number'
            value={formData.phone_number}
            onChange={(e) => onChange?.('phone_number', e.target.value)}
            className={cn(errors?.phone_number && 'border-red-500')}
          />
          {errors?.phone_number && <p className='text-sm text-red-500'>{errors.phone_number[0]}</p>}
        </div>
      </div>

      <div className='grid gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='address' className='text-muted-foreground'>
            Address
          </Label>
          <Input
            id='address'
            placeholder='Enter address'
            value={formData.address}
            onChange={(e) => onChange?.('address', e.target.value)}
            className={cn(errors?.address && 'border-red-500')}
          />
          {errors?.address && <p className='text-sm text-red-500'>{errors.address[0]}</p>}
        </div>
      </div>

      {mode === 'add' && (
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='password' className='text-muted-foreground'>
              Password
            </Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter password'
                value={formData.password}
                onChange={(e) => onChange?.('password', e.target.value)}
                className={cn(errors?.password && 'border-red-500')}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2'
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4 text-gray-500' />
                ) : (
                  <Eye className='h-4 w-4 text-gray-500' />
                )}
              </button>
            </div>
            {errors?.password && <p className='text-sm text-red-500'>{errors.password[0]}</p>}
          </div>
        </div>
      )}
    </>
  )
}
