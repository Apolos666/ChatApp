import { z } from 'zod'
import { DateTime } from 'luxon'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import FormInput from '@/components/signin/FormInput'
import FormCalendarInput from '@/components/signup/FormCalendarInput'
import ButtonLoading from '@/components/signin/ButtonLoading'
import { useLoggedInUserProfile } from '@/entities/user/hooks/userLoggedInUserProfile'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUpdateLoggedUserProfileMutation } from './updateProfile.mutation'
import { toastSuccess } from '@/components/shared/Toast'
import { UserQueries } from '@/entities/user'
import { queryClient } from '@/providers/query-provider'

const UserUpdateFormSchema = z.object({
  name: z.string().min(1),
  phoneNumber: z.string().min(1),
  dob: z
    .string()
    .min(1)
    .refine(
      (dob) => {
        const parsedData = DateTime.fromFormat(dob, 'dd/MM/yyyy')
        return parsedData.isValid
      },
      {
        message: 'Invalid date format. Expected format is dd/MM/yyyy'
      }
    )
    .transform((dob) => {
      const parsedData = DateTime.fromFormat(dob, 'dd/MM/yyyy')
      return parsedData.toFormat('yyyy-MM-dd')
    }),
  address: z.string().min(1)
})

type UserUpdateFormValues = z.infer<typeof UserUpdateFormSchema>

function UserInformationPanel() {
  const { data: user } = useLoggedInUserProfile()

  const { mutate: updateProfile, isPending } = useUpdateLoggedUserProfileMutation({
    onSuccess: async () => {
      toastSuccess("Update user's profile successfully!")
      queryClient.invalidateQueries({
        queryKey: UserQueries.loggedInUserProfileQuery().queryKey
      })
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid }
  } = useForm<UserUpdateFormValues>({
    defaultValues: {
      name: user?.name,
      dob: user?.dob,
      address: user?.address,
      phoneNumber: user?.phoneNumber
    },
    resolver: zodResolver(UserUpdateFormSchema)
  })

  const onSubmit = (data: UserUpdateFormValues) => {
    updateProfile(data)
  }

  const canUpdateForm = isValid && isDirty

  return (
    <div className='mt-4'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center gap-4'>
        <div className='grid w-full grid-cols-1 gap-x-8 gap-y-4'>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <FormInput
                title='Name*'
                value={field.value}
                placeholder='John Duty'
                onChange={field.onChange}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            name='dob'
            control={control}
            render={({ field }) => (
              <FormCalendarInput
                value={field.value}
                title='Date of Birth*'
                placeholder='dd/MM/yyyy'
                onChange={field.onChange}
                error={errors.dob?.message}
              />
            )}
          />

          <div className='col-span-2'>
            <Controller
              name='address'
              control={control}
              render={({ field }) => (
                <FormInput
                  title='Address*'
                  value={field.value}
                  placeholder='Da Nang'
                  onChange={field.onChange}
                  error={errors.address?.message}
                />
              )}
            />
          </div>

          <FormInput disabled value={user?.email} title='Email Address*' placeholder='abc@email.com' />

          <Controller
            name='phoneNumber'
            control={control}
            render={({ field }) => (
              <FormInput
                value={field.value}
                title='Phone Number*'
                placeholder='02633462532'
                onChange={field.onChange}
                error={errors.phoneNumber?.message}
              />
            )}
          />
        </div>

        <ButtonLoading loading={isPending} disabled={!canUpdateForm} type='submit' className='mt-1 w-full text-sm'>
          Save
        </ButtonLoading>
      </form>
    </div>
  )
}

export default UserInformationPanel
