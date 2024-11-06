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
      router.push('/home')
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const onSubmit = (data: LoginFormValues) => {
    login(data)
  }

  return (
    <div className='relative w-96 border rounded-2xl shadow-md flex flex-col items-center px-6 py-10 bg-white'>
      <div className='flex items-center justify-center gap-4'>
        <h3 className='text-2xl font-semibold'>User</h3>
        <h3 className='relative z-[100] text-2xl text-white font-semibold after:bg-black after:z-[-1] after:block after:w-[120%] after:-translate-x-[10%] after:h-full after:absolute after:top-0 after:-skew-x-12'>
          Login
        </h3>
      </div>
      <p className='text-center text-base mt-3 mb-4'>
        Hey, Enter your details to get sign in <br /> to your account
      </p>
      <form className='w-full flex flex-col items-center gap-4' onSubmit={handleSubmit(onSubmit)}>
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

        <ButtonLoading loading={isPending} disabled={isPending} type='submit' className='text-sm w-full mt-1'>
          Sign in
        </ButtonLoading>
      </form>
      <div className='mt-4 w-full flex items-center justify-center'>
        <span className='text-sm mr-2'>Don't have an account?</span>
        <Link className='text-sm font-semibold hover:underline' href='/signup'>
          Request Now
        </Link>
      </div>

      <div className='absolute size-full bg-white border shadow-md rounded-2xl z-[-1] top-0 -translate-y-2 translate-x-2'></div>
    </div>
  )
}

export default SigninForm
