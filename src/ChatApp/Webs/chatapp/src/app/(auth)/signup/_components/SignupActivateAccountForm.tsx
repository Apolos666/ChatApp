import React from 'react'
import { z } from 'zod'
import FormInput from '@/components/signin/FormInput'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ButtonLoading from '@/components/signin/ButtonLoading'
import { useActivateAccountMutation } from '../_mutations/activate.mutation'
import { usePersistedState } from '@/hooks/usePersistedState'
import { PersistedStateKey } from '@/data/persisted-keys'
import { authTypesDto } from '@/services/user.service.api/auth'
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
  activationCode: z.string()
})

type FormValues = z.infer<typeof FormSchema>

function SignupActivateAccountForm() {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema)
  })

  // Email is being used for sign up, activate account
  const [email, setPersisterEmail] = usePersistedState(PersistedStateKey.EmailBeingUsedForSignup, '')
  const { mutate: activate, isPending } = useActivateAccountMutation({
    onSuccess(data, variables, context) {
      setPersisterEmail('')
      router.replace('signin')
    }
  })

  const onSubmit = (data: FormValues) => {
    if (email) {
      const activeAccountDto: authTypesDto.ActivateAccountDto = {
        email,
        activationCode: data.activationCode
      }
      activate(activeAccountDto)
    } else {
      console.log('Email does not exist to be used for activate account')
    }
  }

  return (
    <div className='flex min-w-[800px] max-w-[800px] flex-col items-center'>
      <p className='text-center text-base text-gray-500'>
        We have sent a code to your <span className='text-base font-medium text-blue-600'>{email}</span>. Please enter
        it in the box below <br /> to complete account verification.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className='mt-6 flex w-1/2 flex-col items-center gap-4'>
        <div className='w-full'>
          <div className='mb-2 text-center text-lg font-semibold'>Enter Your Activation Code</div>
          <Controller
            name='activationCode'
            control={control}
            render={({ field }) => (
              <FormInput
                title=''
                placeholder='Example: E#56ba'
                onChange={field.onChange}
                error={errors.activationCode?.message}
              />
            )}
          />
        </div>

        <ButtonLoading loading={isPending} disabled={isPending} type='submit' className='mt-1 w-full text-sm'>
          Finish
        </ButtonLoading>
      </form>
    </div>
  )
}

export default SignupActivateAccountForm
