import React, { Dispatch, SetStateAction } from 'react'
import { z } from 'zod'
import { format, isValid, parse } from 'date-fns'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import FormInput from '@/components/signin/FormInput'
import ButtonLoading from '@/components/signin/ButtonLoading'
import FormCalendarInput from '@/components/signup/FormCalendarInput'
import { authTypesDto } from '@/services/user.service.api/auth'
import { motion } from 'framer-motion'
import { useRegisterMutation } from '../_mutations/register.mutation'
import FormPasswordInput from '@/components/signin/FormPasswordInput'

const FormSchema = z
  .object({
    name: z.string().min(1),
    phoneNumber: z.string().min(1),
    dob: z
      .string()
      .min(1)
      .refine(
        (dob) => {
          const parsedData = parse(dob, 'dd/MM/yyyy', new Date())
          return isValid(parsedData)
        },
        {
          message: 'Invalid date format. Expected format is dd/MM/yyyy'
        }
      )
      .transform((dob) => {
        const parsedData = parse(dob, 'dd/MM/yyyy', new Date())
        return format(parsedData, 'yyyy-MM-dd')
      }),
    address: z.string().min(1),
    email: z.string().email().min(1),
    password: z.string().min(6),
    validatePassword: z.string()
  })
  .superRefine(({ password, validatePassword }, ctx) => {
    if (password !== validatePassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ['validatePassword']
      })
    }
  })

type FormValues = z.infer<typeof FormSchema>

function SignupInformationForm({ onFinishForm }: { onFinishForm: () => void }) {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema)
  })

  const { mutate: register, isPending } = useRegisterMutation({
    onSuccess: () => {
      // Go to next form
      onFinishForm()
    }
  })

  const onSubmit = (data: FormValues) => {
    const { name, email, phoneNumber, address, password, dob } = data
    const registerDto: authTypesDto.RegisterDto = {
      name,
      email,
      phoneNumber,
      address,
      password,
      dob
    }

    register(registerDto)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex min-w-[800px] max-w-[800px] flex-col items-center gap-4'>
      <div className='grid w-full grid-cols-2 gap-x-8 gap-y-4'>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <FormInput title='Name*' placeholder='John Duty' onChange={field.onChange} error={errors.email?.message} />
          )}
        />

        <Controller
          name='dob'
          control={control}
          render={({ field }) => (
            <FormCalendarInput
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
                placeholder='Da Nang'
                onChange={field.onChange}
                error={errors.address?.message}
              />
            )}
          />
        </div>

        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <FormInput
              title='Email Address*'
              placeholder='abc@email.com'
              onChange={field.onChange}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          name='phoneNumber'
          control={control}
          render={({ field }) => (
            <FormInput
              title='Phone Number*'
              placeholder='02633462532'
              onChange={field.onChange}
              error={errors.phoneNumber?.message}
            />
          )}
        />

        <Controller
          name='password'
          control={control}
          render={({ field }) => (
            <FormPasswordInput
              title='Password*'
              placeholder='Enter your password'
              onChange={field.onChange}
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          name='validatePassword'
          control={control}
          render={({ field }) => (
            <FormInput
              type='password'
              title='Validate Password*'
              placeholder='Enter again your password'
              onChange={field.onChange}
              error={errors.validatePassword?.message}
            />
          )}
        />
      </div>

      <ButtonLoading loading={isPending} disabled={isPending} type='submit' className='mt-1 w-full text-sm'>
        Complete
      </ButtonLoading>
    </form>
  )
}

export default SignupInformationForm
