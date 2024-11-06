import React, { ComponentPropsWithoutRef } from 'react'
import { Button } from '../ui/button'

const LoadingIcon = () => {
  return (
    <svg className='size-6 animate-spin text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      ></path>
    </svg>
  )
}

type IButtonLoadingProps = ComponentPropsWithoutRef<'button'> & { loading?: boolean }

function ButtonLoading({ loading = false, children, className, ...props }: IButtonLoadingProps) {
  return (
    <Button {...props} className={className}>
      {loading && (
        <span className='animate-spin'>
          <LoadingIcon />
        </span>
      )}
      {children}
    </Button>
  )
}

export default ButtonLoading
