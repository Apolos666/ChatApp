import React from 'react'
import { cn } from '@/lib/utils'

function StepPoint({
  index,
  title,
  isLast = false,
  isPass = false,
  isActive = false
}: {
  index: number
  title: string
  isLast?: boolean
  isPass?: boolean
  isActive?: boolean
}) {
  return (
    <div className='flex items-center gap-3'>
      <div
        className={cn(
          'flex size-7 items-center justify-center rounded-full border border-2 border-gray-500 bg-gray-200 bg-white text-sm font-semibold text-black',
          isActive && 'border-blue-500 bg-white text-blue-600'
        )}
      >
        {index}
      </div>
      <span className={cn('text-sm font-semibold text-stone-500', isActive && 'text-blue-600')}>{title}</span>
      {!isLast ? <div className={cn('h-[2px] w-24 rounded-full bg-gray-300', isPass && 'bg-blue-500')}></div> : null}
    </div>
  )
}

function SignupProcessBar({ indexActive = 1 }: { indexActive?: number }) {
  const steps = ['Fill in information', 'Activate account']

  return (
    <div className='mb-6 mt-2 flex w-full items-center justify-center gap-4'>
      {steps.map((stepName, index) => {
        const stepIndex = index + 1
        const isPass = stepIndex < indexActive
        const isLast = stepIndex === steps.length
        const isActive = stepIndex === indexActive
        return (
          <StepPoint
            key={stepIndex}
            title={stepName}
            index={stepIndex}
            isLast={isLast}
            isPass={isPass}
            isActive={isActive || isPass}
          />
        )
      })}
    </div>
  )
}

export default SignupProcessBar
