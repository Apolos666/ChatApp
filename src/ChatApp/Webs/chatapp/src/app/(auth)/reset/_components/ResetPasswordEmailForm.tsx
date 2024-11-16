import { z } from 'zod'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import FormInput from '@/components/signin/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import ButtonLoading from '@/components/signin/ButtonLoading'
import { useResetPasswordMutation } from '../_mutations/resetPassword.mutation'

const ResetEmailFormSchema = z.object({
  email: z.string().email().min(1)
})

type ResetEmailFormData = z.infer<typeof ResetEmailFormSchema>

function ResetPasswordEmailForm({ onResetPasswordSuccessfully }: { onResetPasswordSuccessfully: () => void }) {
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetEmailFormData>({
    resolver: zodResolver(ResetEmailFormSchema),
    defaultValues: {
      email: ''
    }
  })

  const { mutate: resetPassword, isPending } = useResetPasswordMutation({
    onSuccess: async () => {
      onResetPasswordSuccessfully && onResetPasswordSuccessfully()
    },
    onSettled: () => {
      reset()
    }
  })

  const onSubmit = (data: ResetEmailFormData) => {
    resetPassword({
      email: data.email
    })
  }

  return (
    <div className='w-full'>
      <p className='mb-4 mt-3 text-center text-base text-gray-500'>Enter your email to reset your password</p>

      <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <FormInput
              title='Email*'
              placeholder='Enter your email...'
              value={field.value}
              onChange={field.onChange}
              error={errors.email?.message}
            />
          )}
        />

        <ButtonLoading type='submit' className='mt-4 w-full' disabled={isPending} loading={isPending}>
          Reset password
        </ButtonLoading>
      </form>
    </div>
  )
}

export default ResetPasswordEmailForm
