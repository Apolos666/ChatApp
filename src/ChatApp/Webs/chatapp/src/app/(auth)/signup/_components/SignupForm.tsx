import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import SignupInformationForm from './SignupInformationForm'
import SignupProcessBar from './SignupProcessBar'
import SignupActivateAccountForm from './SignupActivateAccountForm'
import MotionForm from './MotionForm'

const STEPS = 2

function SignupForm() {
  const [step, setStep] = useState(1)

  const handleGoToNextForm = () => {
    if (step < STEPS) {
      setStep(step + 1)
    }
  }

  const renderForm = () => {
    if (step === 1)
      return (
        <MotionForm key='informationForm'>
          <SignupInformationForm onFinishForm={handleGoToNextForm} />
        </MotionForm>
      )
    if (step === 2)
      return (
        <MotionForm key='activateForm'>
          <SignupActivateAccountForm />
        </MotionForm>
      )
  }

  return (
    <div className='relative flex w-auto flex-col items-center overflow-hidden rounded-2xl border bg-white px-6 py-10 shadow-md'>
      <div className='flex items-center justify-center gap-4'>
        <h3 className='text-2xl font-semibold'>User</h3>
        <h3 className='relative z-[100] text-2xl font-semibold text-white after:absolute after:top-0 after:z-[-1] after:block after:h-full after:w-[120%] after:-translate-x-[10%] after:-skew-x-12 after:bg-black'>
          Sign Up
        </h3>
      </div>
      <p className='mb-4 mt-3 text-center text-base text-gray-500'>Enter the details to get going</p>
      <SignupProcessBar indexActive={step} />
      <AnimatePresence mode='sync' initial={false}>
        {renderForm()}
      </AnimatePresence>
    </div>
  )
}

export default SignupForm
