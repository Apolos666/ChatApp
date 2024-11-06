import React from 'react'
import { Loader2 } from 'lucide-react'

function loading() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background'>
      <Loader2 className='h-12 w-12 animate-spin text-primary' />
      <h2 className='mt-4 text-xl font-semibold text-foreground'>Loading...</h2>
    </div>
  )
}

export default loading
