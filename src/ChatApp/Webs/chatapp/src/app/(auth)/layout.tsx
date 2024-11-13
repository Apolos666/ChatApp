import React, { ReactNode } from 'react'
import Link from 'next/link'
import { Zap } from 'lucide-react'

function Header() {
  return (
    <header className='fixed top-0 z-20 flex w-full items-center justify-between border-b bg-white px-6 py-2'>
      <Link
        className='text-semibold group rounded-lg border border-2 border-black p-2 text-lg text-black hover:border-white hover:bg-black'
        href='/'
      >
        <Zap className='size-6 group-hover:text-white' />
      </Link>
      <div className='flex items-center'>
        <Link href='/signup' className='rounded-md bg-black px-4 py-2 text-white hover:bg-black/80'>
          Sign up
        </Link>
      </div>
    </header>
  )
}

function Vignette() {
  return (
    <div className='absolute h-full w-full overflow-hidden'>
      <div className='absolute right-[-10vw] top-[6vh] size-80 rounded-full bg-black/70 blur-[100px]'></div>
      <div className='absolute left-[-10vw] top-1/2 size-80 rounded-full bg-black/70 blur-[100px]'></div>
    </div>
  )
}

function layout({ children }: { children: ReactNode }) {
  return (
    <div className='relative flex h-[120vh] w-full items-center justify-center'>
      <Header />
      <div className='relative z-10'>{children}</div>
      <Vignette />
    </div>
  )
}

export default layout
