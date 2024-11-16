import { z } from 'zod'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useChangePasswordMutation } from './useChangePassword.mutation'
import { zodResolver } from '@hookform/resolvers/zod'
import { LockIcon } from 'lucide-react'
import FormInput from '@/components/signin/FormInput'
import FormPasswordInput from '@/components/signin/FormPasswordInput'
import ButtonLoading from '@/components/signin/ButtonLoading'
import { toastSuccess } from '@/components/shared/Toast'

const UpdatePasswordSchema = z
  .object({
    oldPassword: z.string().min(1),
    newPassword: z.string().min(1),
    validateNewPassword: z.string().min(1)
  })
  .superRefine(({ newPassword, validateNewPassword }, ctx) => {
    if (newPassword !== validateNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'New password does not match',
        path: ['validateNewPassword']
      })
    }
  })

type UpdatePasswordFormData = z.infer<typeof UpdatePasswordSchema>

function UserAccountPanel() {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      validateNewPassword: ''
    }
  })

  const { mutate: changePassword, isPending } = useChangePasswordMutation({
    onSuccess: async () => {
      toastSuccess('Change password successfully!')
    },
    onError: (error) => {
      console.log(error)
    },
    onSettled: () => {
      reset()
    }
  })

  const onSubmit = (data: UpdatePasswordFormData) => {
    const { oldPassword, newPassword } = data
    console.log({
      oldPassword,
      newPassword
    })

    changePassword({
      oldPassword,
      newPassword
    })
  }

  return (
    <div className='w-full px-4'>
      <form className='flex w-full flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name='oldPassword'
          control={control}
          render={({ field }) => (
            <FormPasswordInput
              value={field.value}
              icon={<LockIcon size={18} />}
              title='Current password*'
              placeholder='Enter your current password...'
              onChange={field.onChange}
              error={errors.oldPassword?.message}
            />
          )}
        />

        <Controller
          name='newPassword'
          control={control}
          render={({ field }) => (
            <FormPasswordInput
              icon={<LockIcon size={18} />}
              title='New password*'
              value={field.value}
              placeholder='Enter your new password...'
              onChange={field.onChange}
              error={errors.newPassword?.message}
            />
          )}
        />

        <Controller
          name='validateNewPassword'
          control={control}
          render={({ field }) => (
            <FormInput
              type='password'
              value={field.value}
              icon={<LockIcon size={18} />}
              title='Validate new password*'
              placeholder='Enter again your new password...'
              onChange={field.onChange}
              error={errors.validateNewPassword?.message}
            />
          )}
        />

        <ButtonLoading type='submit' className='mt-2' loading={isPending} disabled={isPending}>
          Change password
        </ButtonLoading>
      </form>
    </div>
  )
}

export default UserAccountPanel
