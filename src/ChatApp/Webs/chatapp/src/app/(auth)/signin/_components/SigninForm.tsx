'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FormInput from '@/components/signin/FormInput'
import FormPasswordInput from '@/components/signin/FormPasswordInput'
import { KeyRound, Mail } from 'lucide-react'
import ButtonLoading from '@/components/signin/ButtonLoading'
import { authContractsDto, authTypesDto } from '@/services/user.service.api/auth'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoginMutation } from '../_mutations/signin.mutation'

type LoginFormValues = authTypesDto.LoginDto

function SigninForm() {
  const router = useRouter()

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(authContractsDto.LoginDtoSchema)
  })

  const { mutate: login, isPending } = useLoginMutation({
    onSuccess: (response) => {
      router.push('/chat')
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const onSubmit = (data: LoginFormValues) => {
    login(data)
  }

  return (
    <div className='relative flex w-96 flex-col items-center rounded-2xl border bg-white px-6 py-10 shadow-md'>
      <div className='flex items-center justify-center gap-4'>
        <h3 className='text-2xl font-semibold'>User</h3>
        <h3 className='relative z-[100] text-2xl font-semibold text-white after:absolute after:top-0 after:z-[-1] after:block after:h-full after:w-[120%] after:-translate-x-[10%] after:-skew-x-12 after:bg-black'>
          Login
        </h3>
      </div>
      <p className='mb-4 mt-3 text-center text-base'>
        Hey, Enter your details to get sign in <br /> to your account
      </p>
      <form className='flex w-full flex-col items-center gap-4' onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <FormInput
              title='Email'
              icon={<Mail className='size-5' />}
              placeholder='abc@email.com'
              onChange={field.onChange}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          name='password'
          control={control}
          render={({ field }) => (
            <FormPasswordInput
              type='password'
              placeholder='Your password'
              title='Password'
              icon={<KeyRound className='size-4' />}
              onChange={field.onChange}
              error={errors.password?.message}
            />
          )}
        />

        <ButtonLoading loading={isPending} disabled={isPending} type='submit' className='mt-1 w-full text-sm'>
          Sign in
        </ButtonLoading>
      </form>
      <div className='mt-4 flex w-full items-center justify-center'>
        <span className='mr-2 text-sm'>Don't have an account?</span>
        <Link className='text-sm font-semibold hover:underline' href='/signup'>
          Request Now
        </Link>
      </div>
      <Link href='/reset' className='mt-4 text-sm font-semibold hover:underline'>
        Forgot your password
      </Link>

      <div className='absolute top-0 z-[-1] size-full -translate-y-2 translate-x-2 rounded-2xl border bg-white shadow-md'></div>
    </div>
  )
}

export default SigninForm
